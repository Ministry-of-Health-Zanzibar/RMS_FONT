import { CommonModule } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { HDividerComponent } from '@elementar/components';
import { GlobalConstants } from '@shared/global-constants';
import { Subject, takeUntil } from 'rxjs';
import { DiagnosisService } from '../../../../services/system-configuration/diagnosis.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-diagnosis',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatDialogModule,
    MatCheckbox,
    MatError,
    ReactiveFormsModule,
    HDividerComponent
  ],
  templateUrl: './add-diagnosis.component.html',
  styleUrl: './add-diagnosis.component.scss'
})
export class AddDiagnosisComponent implements OnInit,OnDestroy {

  private readonly onDestroy = new Subject<void>()
  public sidebarVisible:boolean = true

  diagnosisForm: FormGroup;
  parent: any;
  uploadProgress: number = 0;
  uploading: boolean = false;
  errorMessage: string | null = null;

  constructor(private formBuilder:FormBuilder,
    private diagnosesService: DiagnosisService,
    private dialogRef: MatDialogRef<AddDiagnosisComponent>) {

  }

  ngOnInit(): void {
    this.configForm();
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
  }
  onClose() {
    this.dialogRef.close(false)
  }

  configForm(){
    this.diagnosisForm = new FormGroup({
      diagnosis_name: new FormControl(null, [Validators.required]),

      diagnosis_code: new FormControl(null,Validators.required)
    });
  }


   saveDiagnosis() {
  if (this.diagnosisForm.valid) {
    this.diagnosesService.addDiagnoses(this.diagnosisForm.value).subscribe({
      next: (response) => {
        if (response.statusCode === 201) {
          Swal.fire({
            title: 'Success ✅',
            text: 'Diagnosis saved successfully.',
            icon: 'success',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Continue',
          });
          this.diagnosisForm.reset();
        } else {
          // Handle custom backend message (duplicate or error)
          Swal.fire({
            title: 'Error ❌',
            text: response.message || 'Failed to save diagnosis.',
            icon: 'error',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'Try Again',
          });
        }
      },
      error: (error) => {
        // If backend sends a duplicate entry message or 409 conflict
        if (
          error.status === 409 ||
          (error.error && error.error.message && error.error.message.includes('already exists'))
        ) {
          Swal.fire({
            title: 'Duplicate Diagnosis ⚠️',
            text: 'This diagnosis name already exists. Please enter a unique name.',
            icon: 'warning',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Server Error ❌',
            text: 'Something went wrong.(Code Already Exit) Please try again later.',
            icon: 'error',
            confirmButtonColor: '#4690eb',
            confirmButtonText: 'OK',
          });
        }
      },
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Form ⚠️',
      text: 'Please complete all required fields before saving.',
      confirmButtonText: 'OK',
    });
  }
}



}
