import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-referral-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './referral-status-dialog.component.html',
  styleUrl: './referral-status-dialog.component.scss'
})
export class ReferralStatusDialogComponent {

  statusForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReferralStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.statusForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      // status: ['', Validators.required]
    });
  }


  onSubmit() {
    if (this.statusForm.valid) {
      this.dialogRef.close(this.statusForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
