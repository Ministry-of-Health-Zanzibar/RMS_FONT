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
  styleUrl: './addmedicalform.component.scss',
})
export class AddmedicalformComponent implements OnInit, OnDestroy {
  medicalForm!: FormGroup;
  loading = false;
  backendErrors: any = {};
  reasonList: any[] = [];
  selectedFile: File | null = null;
  diagnosesList: any[] = [];
  filteredDiagnoses: any[] = [];
  diagnosisSearch = '';
  loadingDiagnoses = false;

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
  console.log('Dialog received data:', this.data);

  const patient = this.data.patient; // full patient object
  const patientHistoryId = this.data.patientHistoryId;

  console.log('Patient Matibabu Card:', patient.matibabu_card);
  console.log('Latest history ID:', patientHistoryId);

  this.buildForm(patient); // send full patient to form builder
  this.loadDiagnoses();
  this.loadReasons();
}


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  buildForm(patient: any) {
  this.medicalForm = this.fb.group({
    patient_histories_id: [
      patient.latest_history?.patient_histories_id || '',
      Validators.required,
    ],
    board_comments: ['', Validators.required],
    board_reason_id: ['', Validators.required],
    board_diagnosis_ids: [[], Validators.required], // must be an array
  });
}


  loadReasons() {
    this.reasonServices.getAllReasons().subscribe({
      next: (res: any) => {
        this.reasonList = res.data || [];
      },
      error: (err) => console.error('Failed to load reasons', err),
    });
  }

 loadDiagnoses() {
  this.loadingDiagnoses = true;

  this.diagnosisService.getAllDiagnosis().subscribe({
    next: (res: any) => {
      this.diagnosesList = res.data || [];
      this.filteredDiagnoses = [...this.diagnosesList];
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

filterDiagnoses() {
  const term = this.diagnosisSearch.toLowerCase();
  this.filteredDiagnoses = this.diagnosesList.filter((d) =>
    d.diagnosis_name.toLowerCase().includes(term)
  );
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

  // Prepare JSON payload
  const payload = {
    board_comments: formValue.board_comments,
    board_reason_id: formValue.board_reason_id,
    board_diagnosis_ids: formValue.board_diagnosis_ids,
  };

  // If you have a file, you need a separate endpoint or use FormData + multipart
  // For now, sending JSON only

  const patientHistoryId = this.data.patientHistoryId;

  console.log('Payload:', payload);

  this.medicalHistoryService.updateMedicals(patientHistoryId, payload).subscribe({
    next: (res) => {
      Swal.fire('Success', 'Medical history updated successfully', 'success');
      this.loading = false;
      this.dialogRef.close({ success: true, data: res });
    },
    error: (err) => {
      console.log('Validation Errors:', err.error.errors);
      this.backendErrors = err.error.errors || {};
      Swal.fire('Error', 'Failed to update medical history', 'error');
      this.loading = false;
    }
  });
}



}
