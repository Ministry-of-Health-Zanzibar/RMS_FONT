import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { DiagnosisService } from '../../../services/system-configuration/diagnosis.service';
import { ReasonsService } from '../../../services/system-configuration/reasons.service';
import { MedicalhistoryService } from '../../../services/partient/medicalhistory.service';

@Component({
  selector: 'app-addmedicalform',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './addmedicalform.component.html',
  styleUrls: ['./addmedicalform.component.scss'],
})
export class AddmedicalformComponent implements OnInit, OnDestroy {
  mode: 'add' | 'edit' = 'add';
  medicalForm!: FormGroup;
  loading = false;
  backendErrors: any = {};
  reasonList: any[] = [];
  diagnosesList: any[] = [];
  filteredDiagnoses: any[] = [];
  diagnosisSearch = '';
  loadingDiagnoses = false;
  selectedFile: File | null = null;
  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private diagnosisService: DiagnosisService,
    private reasonServices: ReasonsService,
    private medicalHistoryService: MedicalhistoryService,
    public dialogRef: MatDialogRef<AddmedicalformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode;
    const patient = this.data.patient;
    this.buildForm(patient);
    this.loadReasons();
    this.loadDiagnoses();
    if (this.mode === 'edit') {
      this.patchMedicalData(patient);
    }
  }

  buildForm(patient: any) {
    this.medicalForm = this.fb.group({
      patient_histories_id: [
        patient.latest_history?.patient_histories_id || '',
        Validators.required,
      ],
      board_comments: ['', Validators.required],
      board_reason_id: ['', Validators.required],
      board_diagnosis_ids: [[], Validators.required], // must be array
    });
  }

patchMedicalData(patient: any) {
  const history = patient.latest_history;
  if (!history) return;

  // Patch comments and reason
  this.medicalForm.patchValue({
    board_comments: history.board_comments,
    board_reason_id: history.board_reason_id,
  });

  // ✅ Patch diagnoses from API response
  const selectedDiagnoses = history.board_diagnoses?.map((d: any) => d.diagnosis_id) || [];
  console.log('Board diagnoses from patient history:', history.board_diagnoses);
  console.log('Selected diagnosis IDs to patch:', selectedDiagnoses);

  this.medicalForm.get('board_diagnosis_ids')?.setValue(selectedDiagnoses);

  // Clear previously selected file (optional)
  this.selectedFile = null;
}
  loadReasons() {
    this.reasonServices.getAllReasons().subscribe({
      next: (res: any) => (this.reasonList = res.data || []),
      error: (err) => console.error(err),
    });
  }

loadDiagnoses() {
  this.loadingDiagnoses = true;
  this.diagnosisService.getAllDiagnosis().subscribe({
    next: (res: any) => {
      this.diagnosesList = res.data || [];
      this.filteredDiagnoses = [...this.diagnosesList];

      // Patch diagnoses baada ya list kupakia
      if (this.mode === 'edit') {
        const patient = this.data.patient;
        const selectedDiagnoses = patient.latest_history.board_diagnoses?.map((d: { diagnosis_id: number }) => d.diagnosis_id) || [];
        this.medicalForm.get('board_diagnosis_ids')?.setValue(selectedDiagnoses);
      }

      this.loadingDiagnoses = false;
    },
    error: (err) => {
      console.error('Failed to load diagnoses', err);
      this.loadingDiagnoses = false;
    },
  });
}
  onDiagnosesDropdownOpened() {
    this.filteredDiagnoses = [...this.diagnosesList];
    this.diagnosisSearch = '';
  }

  normalize(text: string) {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  filterDiagnoses() {
    const terms = this.normalize(this.diagnosisSearch).split(' ');
    this.filteredDiagnoses = this.diagnosesList.filter((d) => {
      const name = this.normalize(d.diagnosis_name);
      return terms.every((t) => name.includes(t));
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      Swal.fire('Error', 'File must be 1MB or less', 'error');
      this.selectedFile = null;
      event.target.value = '';
      return;
    }
    this.selectedFile = file;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.medicalForm.invalid) {
      this.medicalForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValue = this.medicalForm.value;
    const formData = new FormData();
    formData.append('board_comments', formValue.board_comments);
    formData.append('board_reason_id', formValue.board_reason_id);
    formValue.board_diagnosis_ids.forEach((id: any) => {
      formData.append('board_diagnosis_ids[]', id);
    });
    if (this.selectedFile) formData.append('patient_file', this.selectedFile);

    const patientHistoryId = this.data.patientHistoryId;

    const request$ =
      this.mode === 'edit'
        ? this.medicalHistoryService.updateMedicalHistory(patientHistoryId, formData)
        : this.medicalHistoryService.addMedicalHistory(patientHistoryId, formData);

    request$.subscribe({
      next: () => {
        Swal.fire('Success', `Medical history ${this.mode}ed successfully`, 'success');
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.backendErrors = err.error.errors || {};
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}