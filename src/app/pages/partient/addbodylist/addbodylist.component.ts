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
import { PartientService } from '../../../services/partient/partient.service';
import { GlobalConstants } from '@shared/global-constants';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RolePermissionService } from '../../../services/users/role-permission.service';

@Component({
  selector: 'app-addbodylist',
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
  templateUrl: './addbodylist.component.html',
  styleUrl: './addbodylist.component.scss'
})
export class AddbodylistComponent implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();
  readonly data = inject<any>(MAT_DIALOG_DATA);

  patientForm: FormGroup;
  selectedAttachement: File | null = null;
  patientData: any;

  constructor(
    private patientService: PartientService,
    private roleService: RolePermissionService,
    private dialogRef: MatDialogRef<AddbodylistComponent>
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
      patient_list_title: new FormControl(null, [Validators.required]),
      patient_list_file: new FormControl(null, Validators.required),
    });
  }

  onAttachmentSelected(event: any): void {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.patientForm.patchValue({ patient_list_file: file.name });
      this.selectedAttachement = file;
    }
  }

  savePatient() {
    if (this.patientForm.invalid) return;

  const formValue: any = { ...this.patientForm.value };



    const formData = new FormData();
    Object.keys(this.patientForm.controls).forEach(key => {
      if (key === 'patient_list_file') {
        if (this.selectedAttachement) {
          formData.append('patient_list_file', this.selectedAttachement);
        }
      } else {
        const value = this.patientForm.get(key)?.value;
        formData.append(key, value ?? '');
      }
    });

    this.patientService.addBodyList(formData).subscribe(response => {
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

  updatePatient() {
    if (this.patientForm.invalid) return;

    this.patientService.updatePartientList(this.patientForm.value, this.patientData.patient_list_id).subscribe(response => {
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
