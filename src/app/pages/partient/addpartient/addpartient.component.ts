import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HDividerComponent } from '@elementar/components';
import { map, Observable, startWith, Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { UserService } from './../../../services/users/user.service';
import { RolePermissionService } from '../../../services/users/role-permission.service';
import { PartientService } from '../../../services/partient/partient.service';
import { GlobalConstants } from '@shared/global-constants';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-addpartient',
  standalone: true,
  imports: [
  CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    MatDatepickerModule,
  ],
  templateUrl: './addpartient.component.html',
  styleUrl: './addpartient.component.scss'
})
export class AddpartientComponent implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();
  readonly data = inject<any>(MAT_DIALOG_DATA);

  patientForm: FormGroup;
  selectedAttachement: File | null = null;
  patientData: any;

  constructor(
    private patientService: PartientService,
    private roleService: RolePermissionService,
    private dialogRef: MatDialogRef<AddpartientComponent>
  ) {}

  ngOnInit(): void {
    this.configForm();
    if (this.data?.data) {
      this.patientData = this.data.data;
      this.patientForm.patchValue(this.patientData);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  configForm() {
    this.patientForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.nameRegexOnly)]),
      gender: new FormControl(null, Validators.required),
      location_id: new FormControl(null, Validators.required),
      phone: new FormControl(null, Validators.required),
      job: new FormControl(null, Validators.required),
      position: new FormControl(null, Validators.required),
      date_of_birth: new FormControl(null, Validators.required),
      referral_letter_file: new FormControl(null, Validators.required),
    });
  }

  onAttachmentSelected(event: any): void {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.patientForm.patchValue({ referral_letter_file: file.name });
      this.selectedAttachement = file;
    }
  }

  savePatient() {
    if (this.patientForm.invalid) return;

  const formValue: any = { ...this.patientForm.value };



    const formData = new FormData();
    Object.keys(this.patientForm.controls).forEach(key => {
      if (key === 'referral_letter_file') {
        if (this.selectedAttachement) {
          formData.append('referral_letter_file', this.selectedAttachement);
        }
      } else {
        const value = this.patientForm.get(key)?.value;
        formData.append(key, value ?? '');
      }
    });

    this.patientService.addPartient(formData).subscribe(response => {
      if (response.statusCode === 201) {
        Swal.fire({
          title: "Success",
          text: response.message,
          icon: "success",
          confirmButtonColor: "#4690eb",
          confirmButtonText: "Close"
        });
        this.dialogRef.close(true);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonColor: "#4690eb",
          confirmButtonText: "Close"
        });
      }
    });
  }

  updatePatient() {
    if (this.patientForm.invalid) return;

    this.patientService.updatePartient(this.patientForm.value, this.patientData.patient_id).subscribe(response => {
      if (response.statusCode === 200) {
        Swal.fire({
          title: "Success",
          text: response.message,
          icon: "success",
          confirmButtonColor: "#4690eb",
          confirmButtonText: "Close"
        });
        this.dialogRef.close(true);
      } else {
        Swal.fire({
          title: "Error",
          text: response.message,
          icon: "error",
          confirmButtonColor: "#4690eb",
          confirmButtonText: "Close"
        });
      }
    });
  }
}
