import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject, takeUntil } from 'rxjs';
import { ReferralService } from '../../../services/Referral/referral.service';
import Swal from 'sweetalert2';
import { HospitalService } from '../../../services/system-configuration/hospital.service';

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
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './referral-status-dialog.component.html',
  styleUrl: './referral-status-dialog.component.scss',
})
export class ReferralStatusDialogComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  readonly data = inject<any>(MAT_DIALOG_DATA);
  public sidebarVisible: boolean = true;
  statusForm: FormGroup;
  id: number;
  hospitals: any[] = [];

  constructor(
    public referralsService: ReferralService,
    public hospitalService: HospitalService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReferralStatusDialogComponent>
  ) {}

  ngOnInit(): void {
    this.configForm();
    if (this.data) {
      this.id = this.data.data.referral_id;
    }
    this.getHospital();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  onClose() {
    this.dialogRef.close(false);
  }

  configForm() {
    this.statusForm = new FormGroup({
      referral_id: new FormControl(this.id || 0),
       hospital_id: new FormControl<number>(0),
      letter_text: new FormControl(null, [Validators.required]),
      status: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null, ),
      end_date: new FormControl(null,),
    });
  }

    // Filter function to disable invalid end dates
  endDateFilter = (d: Date | null): boolean => {
    const startDate = this.statusForm.get('start_date')?.value;
    if (!d || !startDate) return true;
    // Allow only dates after or equal to start date
    return d >= new Date(startDate);
  };

  saveReferralLetter() {
    if (this.statusForm.valid) {
      const formData = {
        referral_id: this.id,
        hospital_id: this.statusForm.value.hospital_id,
        letter_text: this.statusForm.value.letter_text,
        status: this.statusForm.value.status,
        start_date: new Date(this.statusForm.value.start_date)
          .toISOString()
          .split('T')[0],
        end_date: new Date(this.statusForm.value.end_date)
          .toISOString()
          .split('T')[0],
      };

      this.referralsService
        .addReferralLetter(formData)
        .subscribe((response) => {
          if (response.statusCode === 201) {
            Swal.fire({
              title: 'Success',
              text: response.message,
              icon: 'success',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            }).then(() => {
              this.dialogRef.close(true);
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Close',
            });
          }
        });
    }
  }

  getHospital() {
    this.hospitalService.getAllHospital().subscribe({
      next: (response: any) => {
        this.hospitals = response.data;
        console.log('Hospitals fetched:', this.hospitals);
      },
      error: (err) => {
        console.error('Error fetching hospitals:', err);
      },
    });
  }
}
