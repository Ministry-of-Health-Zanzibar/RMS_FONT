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
import { BillFileService } from '../../../../services/Bills/bill-file.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

export interface BillData {
  referral_id: number;
  total_amount: number;
  bill_period_start: string;
  bill_period_end: string;
  bill_file_id: number;
}

export interface AddBillDialogData {
  billFileId: number;
  billTitle: string;
  referralOptions: any[];
}

@Component({
  selector: 'app-add-bills',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-bills.component.html',
  styleUrls: ['./add-bills.component.scss'],
})
export class AddBillsComponent implements OnInit, OnDestroy {
  billForm: FormGroup;
  loading = false;
  minDate: Date;
  maxDate: Date;
  referrals: any[] = [];
  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private hospitalService: BillFileService,
    public dialogRef: MatDialogRef<AddBillsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddBillDialogData
  ) {
    // Set date constraints (current year only)
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear, 0, 1);
    this.maxDate = new Date(currentYear, 11, 31);

    this.billForm = this.fb.group({
      referral_id: ['', Validators.required],
      total_amount: ['', [Validators.required, Validators.min(0)]],
      bill_period_start: ['', Validators.required],
      bill_period_end: ['', Validators.required],
      bill_file_id: [data.billFileId, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data.billFileId) {
      this.loadReferrals(this.data.billFileId);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private loadReferrals(hospitalId: number) {
    this.hospitalService
      .getReferralsByHospital(hospitalId)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (res) => {
          this.referrals = res.data || [];
        },
        error: () => {
          this.referrals = [];
          Swal.fire('Error', 'Failed to load referrals', 'error');
        },
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.billForm.valid) {
      this.loading = true;

      // Format dates to YYYY-MM-DD
      const formValue = {
        ...this.billForm.value,
        bill_period_start: this.formatDate(
          this.billForm.value.bill_period_start
        ),
        bill_period_end: this.formatDate(this.billForm.value.bill_period_end),
      };

      // Simulate API call
      setTimeout(() => {
        this.loading = false;
        this.dialogRef.close(formValue);
      }, 1500);
    }
  }

  private formatDate(date: Date): string {
    if (!date) return '';

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Helper method to ensure end date is not before start date
  onStartDateChange(): void {
    const startDate = this.billForm.get('bill_period_start')?.value;
    const endDate = this.billForm.get('bill_period_end')?.value;

    if (startDate && endDate && startDate > endDate) {
      this.billForm.get('bill_period_end')?.setValue(null);
    }
  }
}
