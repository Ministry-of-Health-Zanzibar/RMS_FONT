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
import { MonthBillService } from '../../../services/Referral/month-bill.service';
import { RolePermissionService } from '../../../services/users/role-permission.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-monthbill',
  standalone: true,
  imports: [
     CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,

        MatDatepickerModule,

        MatDatepickerModule,
        MatIcon
  ],
  templateUrl: './add-monthbill.component.html',
  styleUrl: './add-monthbill.component.scss'
})
export class AddMonthbillComponent implements OnInit, OnDestroy {

  private readonly onDestroy = new Subject<void>();
  readonly data = inject<any>(MAT_DIALOG_DATA);

  patientForm: FormGroup;
  selectedAttachement: File | null = null;
  patientData: any;

  constructor(
    private monthService: MonthBillService,
    private roleService: RolePermissionService,
    private dialogRef: MatDialogRef<AddMonthbillComponent>
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

      current_monthly_bill_amount: new FormControl(null, Validators.required),
      after_audit_monthly_bill_amount: new FormControl(null,Validators.required ),

    });
  }



  saveMonth() {
    if (this.patientForm.invalid) return;

  const formValue: any = { ...this.patientForm.value };
    const formData = new FormData();


    this.monthService.addMonthBill(formData).subscribe(response => {
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

  updateMonth() {
    if (this.patientForm.invalid) return;

    this.monthService.updateMonth(this.patientForm.value, this.patientData.monthly_bill_id).subscribe(response => {
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
