import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatError,
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { HDividerComponent } from '@elementar/components';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { ReferralService } from '../../../services/Referral/referral.service';
import { HospitalService } from '../../../services/system-configuration/hospital.service';
import { PartientService } from '../../../services/partient/partient.service';
import { ReferalTypeService } from '../../../services/system-configuration/referal-type.service';
import { MatSelectModule } from '@angular/material/select';
import { ReasonsService } from '../../../services/system-configuration/reasons.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-referrals',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormField,
    MatLabel,
    MatCheckbox,
    MatError,
    ReactiveFormsModule,
    HDividerComponent,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './add-referrals.component.html',
  styleUrls: ['./add-referrals.component.scss'],
})
export class AddReferralsComponent implements OnInit, OnDestroy {
  readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly onDestroy = new Subject<void>();

  referralsForm!: FormGroup;
  id: number | null = null;
  patients: any[] = [];
  hospital: any[] = [];
  referralTypes: any[] = [];
  reason: any[] = [];

  constructor(
    private referralsService: ReferralService,
    private hostpitalService: HospitalService,
    private patientService: PartientService,
    private referralsTypeService: ReferalTypeService,
    private reasonService: ReasonsService,
    private dialogRef: MatDialogRef<AddReferralsComponent>
  ) {}

  ngOnInit(): void {
    this.configForm();
    this.getHospital();
    this.getPatient();
    this.getReferralType();
    this.getReason();

    if (this.data?.id != null) {
      this.id = this.data.id;
      // this.getReferralDetails(this.id);
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
    this.referralsForm = new FormGroup({
      patient_id: new FormControl(null, Validators.required),
      reason_id: new FormControl(null, Validators.required),
    });
  }

  saveReferrals() {
    if (this.referralsForm.valid) {
      this.referralsService.addReferral(this.referralsForm.value).subscribe(
        (response) => {
          if (response.statusCode === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Data saved successfully',
              icon: 'success',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            }).then(() => this.dialogRef.close(true));
          } else {
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            });
          }
        }
      );
    } else {
      Swal.fire({
        title: 'Form Invalid',
        text: 'Please fill all required fields correctly.',
        icon: 'warning',
        confirmButtonColor: '#4690eb',
        confirmButtonText: 'Okay',
      });
    }
  }

  updateReferrals() {
    if (this.referralsForm.valid && this.id != null) {
      this.referralsService
        .updateReferral(this.referralsForm.value, this.id)
        .subscribe((response) => {
          if (response.statusCode === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Referral updated successfully',
              icon: 'success',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            }).then(() => this.dialogRef.close(true));
          } else {
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            });
          }
        });
    }
  }

  getPatient() {
    this.patientService.getAllPartientforReferral().subscribe((response) => {
      this.patients = response.data || [];
    });
  }

  getHospital() {
    this.hostpitalService.getAllHospital().subscribe((response) => {
      this.hospital = response.data || [];
    });
  }

  getReferralType() {
    this.referralsTypeService.getAllReferalType().subscribe((response) => {
      this.referralTypes = response.data || [];
    });
  }

  getReason() {
    this.reasonService.getAllReasons().subscribe((response) => {
      this.reason = response.data || [];
    });
  }

  getReferralDetails(id: number) {
    this.referralsService.getReferralById(id).subscribe((response) => {
      console.log('Referral API response:', response.data); // debug log
      if (response.statusCode === 200 && response.data) {
        const referral = response.data;

        // Map API response to form controls
        this.referralsForm.patchValue({
          patient_id:
            referral.patient_id ?? referral.patient?.patient_id ?? null,
          reason_id: referral.reason_id ?? referral.reason?.reason_id ?? null,
        });
      }
    });
  }
}
