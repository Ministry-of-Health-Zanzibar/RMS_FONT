import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { PartientService } from '../../../services/partient/partient.service';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardSubtitle,
} from '@angular/material/card';
import { LocationService } from '../../../services/system-configuration/location.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';

export interface AddMultiplePatientDialogData {
  patientFileId: number;

  referralOptions: any[];
}
@Component({
  selector: 'app-addmultiplepatient',
  standalone: true,
  imports: [
     CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatDialogModule,
    MatCardSubtitle,
    MatAutocomplete,
    MatRadioModule,
  ],
  templateUrl: './addmultiplepatient.component.html',
  styleUrl: './addmultiplepatient.component.scss'
})
export class AddmultiplepatientComponent implements OnInit, OnDestroy {
  patientForm: FormGroup;
  loading = false;
  selectedFile: File | null = null;
  patient: any;

  locations: any[] = [];
  options: any[] = [];
  filteredOptions!: Observable<any[]>;

  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private patientService: PartientService,
    private locationService: LocationService,
    public dialogRef: MatDialogRef<AddmultiplepatientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddMultiplePatientDialogData
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],

      patient_list_id: [this.data.patientFileId, Validators.required],

    });
  }

  ngOnInit(): void {
    if (this.data.patientFileId) {
      this.ViewPatient(this.data.patientFileId);
    }

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private ViewPatient(patientFileId: number) {
    this.patientService
      .getBodyListById(patientFileId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (res) => {
          if (res?.data) {
            this.patient = res.data;
          } else {
            this.patient = [];
            Swal.fire('Error', res.message || 'No patient found', 'error');
          }
        },
        error: () => {
          this.patient = [];
          Swal.fire('Error', 'Failed to load referrals', 'error');
        },
      });
  }







  onCancel() {
    this.dialogRef.close();
  }


  onSubmit() {
    if (this.patientForm.valid) {
      this.loading = true;
      const formValue = this.patientForm.value;
      const formData = new FormData();

      formData.append('name', formValue.name);
      formData.append('patient_list_id', formValue.patient_list_id);



      if (this.selectedFile) {
        formData.append(
          'patient_file',
          this.selectedFile,
          this.selectedFile.name
        );
      }

      this.patientService.addPartient(formData).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire('Success', 'Patient saved successfully', 'success');
          this.dialogRef.close(res);
        },
        error: (err) => {
          this.loading = false;
          Swal.fire(
            'Error',
            err.error?.message || 'Failed to save patient',
            'error'
          );
        },
      });
    }
  }
}
