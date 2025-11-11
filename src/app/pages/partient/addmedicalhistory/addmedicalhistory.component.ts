import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  FormArray,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { DiagnosisService } from '../../../services/system-configuration/diagnosis.service';
import { MedicalhistoryService } from '../../../services/partient/medicalhistory.service';
import { ReasonsService } from '../../../services/system-configuration/reasons.service';

@Component({
  selector: 'app-addmedicalhistory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    MatRadioModule,
  ],
  templateUrl: './addmedicalhistory.component.html',
  styleUrls: ['./addmedicalhistory.component.scss'],
})
export class AddmedicalhistoryComponent implements OnInit, OnDestroy {
  medicalForm!: FormGroup;
  loading = false;
  backendErrors: any = {};
  reasonList: any[] = [];
  selectedFile: File | null = null;
  diagnosesList: any[] = [];
  filteredDiagnoses: any[] = [];
  diagnosisSearch = '';
  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private diagnosisService: DiagnosisService,
    private reasonServices: ReasonsService,
    private medicalHistoryService: MedicalhistoryService,
    public dialogRef: MatDialogRef<AddmedicalhistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log('Dialog received data:', this.data);

    const patient = this.data;
    console.log('Patient Name:', patient.name);
    console.log('Patient Matibabu Card:', patient.matibabu_card);
    console.log('Patient Phone:', patient.phone);
    console.log('Patient Gender:', patient.gender);
    console.log('Patient Location:', patient.location);

    const filePatientId = patient.patient_id;
    console.log('Patient ID from file:', filePatientId);

    this.buildForm(patient);
    this.loadDiagnoses();
    this.loadReasons();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  buildForm(patient?: any) {
    this.medicalForm = this.fb.group({
      patient_id: [patient.patient_id || '', Validators.required],
      referring_doctor: ['', Validators.required],
      file_number: ['', Validators.required],
      referring_date: ['', ],
      history_of_presenting_illness: ['', Validators.required],
      physical_findings: ['', Validators.required],
      investigations: ['', Validators.required],
      management_done: ['', Validators.required],
      board_comments: ['',Validators.required],
      reason_id: ['', Validators.required],
      diagnosis_ids: ['',Validators.required],
      history_file: [null,Validators.required],
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
    this.diagnosisService.getAllDiagnosis().subscribe({
      next: (res: any) => {
        this.diagnosesList = res.data || [];
        this.filteredDiagnoses = [...this.diagnosesList];
      },
      error: (err) => console.error('Failed to load diagnoses', err),
    });
  }

  onDiagnosesSelected(event: any) {
    const selectedIds = event.value;
    const formArray = this.medicalForm.get('diagnosis_ids') as FormArray;
    formArray.clear();

    selectedIds.forEach((id: number) => formArray.push(this.fb.control(id)));
    console.log('Selected diagnosis_ids:', this.medicalForm.value.diagnosis_ids);
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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.medicalForm.patchValue({ history_file: file });
      this.medicalForm.get('history_file')?.updateValueAndValidity();
    }
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

  for (const key of [
    'patient_id',
    'referring_doctor',
    'file_number',
    'referring_date',
    'board_comments',
    'reason_id',
    'history_of_presenting_illness',
    'physical_findings',
    'investigations',
    'management_done'
  ]) {
    formData.append(key, formValue[key]);
  }

  if (Array.isArray(formValue.diagnosis_ids)) {
    formValue.diagnosis_ids.forEach((id: number) => {
      formData.append('diagnosis_ids[]', id.toString());
    });
  }

  if (this.selectedFile) {
    formData.append('history_file', this.selectedFile, this.selectedFile.name);
  }

  this.medicalHistoryService.addMedical(formData).subscribe({
    next: (res) => {
      console.log('Response:', res);
      Swal.fire('Success', 'Medical history saved successfully', 'success');
      this.loading = false;
      this.dialogRef.close(true);
    },
    error: (err) => {
      console.error('Backend error:', err.error);
      this.backendErrors = err.error.errors || {};
      Swal.fire('Error', 'Failed to save medical history', 'error');
      this.loading = false; // ✅ Stop loading even on error
    },
  });
}

}
