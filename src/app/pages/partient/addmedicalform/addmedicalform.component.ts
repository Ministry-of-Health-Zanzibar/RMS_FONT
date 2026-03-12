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
  mode: 'add' | 'edit' = 'add';
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

  const patient = this.data.patient;

  this.mode = this.data.mode;

  this.buildForm(patient);

  this.loadDiagnoses();
  this.loadReasons();

  if (this.mode === 'edit') {
    this.patchMedicalData(patient);
  }
}

patchMedicalData(patient: any) {

  const history = patient.latest_history;

  this.medicalForm.patchValue({
    board_comments: history.board_comments,
    board_reason_id: history.board_reason_id,
    board_diagnosis_ids: history.board_diagnoses?.map((d: any) => d.diagnosis_id) || []
  });

}

onFileSelected(event: any) {
  const file = event.target.files[0];

  if (file) {
    const maxSize = 1 * 1024 * 1024; // 1 MB

    if (file.size > maxSize) {
      Swal.fire('Error', 'File must be 1MB or less', 'error');
      // Reset selected file
      this.selectedFile = null;
      event.target.value = ''; // Clear input
      return;
    }

    this.selectedFile = file;
  }
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
normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' '); // remove extra spaces
}


filterDiagnoses() {
  const terms = this.normalize(this.diagnosisSearch).split(' ');

  this.filteredDiagnoses = this.diagnosesList.filter(d => {
    const name = this.normalize(d.diagnosis_name);
    return terms.every(t => name.includes(t));
  });
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

  if (this.selectedFile) {
    formData.append('patient_file', this.selectedFile);
  }

  const patientHistoryId = this.data.patientHistoryId;

  // EDIT
  if (this.mode === 'edit') {

    this.medicalHistoryService
      .updateMedicalHistory(patientHistoryId, formData)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Success', 'Medical history updated successfully', 'success');
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.backendErrors = err.error.errors || {};
          this.loading = false;
        },
      });

  }

  // ADD
  else {

    this.medicalHistoryService
      .addMedicalHistory(patientHistoryId, formData)
      .subscribe({
        next: (res: any) => {
          Swal.fire('Success', 'Medical history added successfully', 'success');
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.backendErrors = err.error.errors || {};
          this.loading = false;
        },
      });

  }

}

// onSubmit() {
//   if (this.medicalForm.invalid) {
//     this.medicalForm.markAllAsTouched();
//     return;
//   }

//   this.loading = true;

//   const formValue = this.medicalForm.value;

//   // Prepare JSON payload
//   const payload = {
//     board_comments: formValue.board_comments,
//     board_reason_id: formValue.board_reason_id,
//     board_diagnosis_ids: formValue.board_diagnosis_ids,
//   };

//   // If you have a file, you need a separate endpoint or use FormData + multipart
//   // For now, sending JSON only

//   const patientHistoryId = this.data.patientHistoryId;

//   console.log('Payload:', payload);

//   this.medicalHistoryService.updateMedicals(patientHistoryId, payload).subscribe({
//     next: (res) => {
//       Swal.fire('Success', 'Medical history updated successfully', 'success');
//       this.loading = false;
//       this.dialogRef.close({ success: true, data: res });
//     },
//     error: (err) => {
//       console.log('Validation Errors:', err.error.errors);
//       this.backendErrors = err.error.errors || {};
//       Swal.fire('Error', 'Failed to update medical history', 'error');
//       this.loading = false;
//     }
//   });
// }



}
