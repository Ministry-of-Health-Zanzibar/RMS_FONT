import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { HDividerComponent } from '@elementar/components';
import { Subject, takeUntil } from 'rxjs';
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
    MatInput,
    MatFormField,
    MatLabel,
    MatDialogModule,
    MatCheckbox,
    MatError,
    ReactiveFormsModule,
    HDividerComponent,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
  templateUrl: './add-referrals.component.html',
  styleUrl: './add-referrals.component.scss'
})
export class AddReferralsComponent {


  readonly data = inject<any>(MAT_DIALOG_DATA);
      private readonly onDestroy = new Subject<void>()
      public sidebarVisible:boolean = true

      referralsForm: FormGroup;
      parent: any;
      uploadProgress: number = 0;
      uploading: boolean = false;
      errorMessage: string | null = null;
      id: any;
     patients: any;
     hospital: any;
  referralTypes: any;
  reason: any;

      constructor(private formBuilder:FormBuilder,
        private referralsService:ReferralService,
        private hostpitalService:HospitalService,
        private patientService: PartientService,
        private referralsTypeService:ReferalTypeService,
        private reasonService:ReasonsService,
        private dialogRef: MatDialogRef<AddReferralsComponent>) {
      }


      ngOnInit(): void {
        this.getHospital();
        this.getPatient();
        this.getReferralType();
        this.getReason();
          this.configForm();
          if(this.data){
            this.id = this.data.id;
           // this.getHospital(this.id);
          }

          if (this.data?.id) {
            this.id = this.data.id;
            this.getReferralDetails(this.id);
          }

        }

        // getDepartm(id: any){
        //   this.departmentService.getAllDepartmentById(id).subscribe(response=>{
        //     this.departmentForm.patchValue(response.data[0])
        //   })
        // }

        ngOnDestroy(): void {
          this.onDestroy.next()
        }
        onClose() {
          this.dialogRef.close(false)
        }

        configForm(){
          this.referralsForm = new FormGroup({
            patient_id: new FormControl(null, Validators.required),
            hospital_id: new FormControl(null, Validators.required),
            referral_type_id: new FormControl(null, Validators.required),
            reason_id: new FormControl(null, Validators.required),
            start_date: new FormControl(null, Validators.required),
            end_date: new FormControl(null, Validators.required),
          });
        }

        // getParent() {
        //   this.departmentService.getAllDepartment().pipe(takeUntil(this.onDestroy)).subscribe((response: any) => {
        //     this.parent = response.data;
        //   });
        // }

        saveReferrals(){
          if(this.referralsForm.valid){
            this.referralsService.addReferral(this.referralsForm.value).subscribe(response => {
              if(response.statusCode == 201){
                Swal.fire({
                  title: "Success",
                  text: "Data saved successfully",
                  icon: "success",
                  confirmButtonColor: "#4690eb",
                  confirmButtonText: "Continue"
                }).then(() => {
                  this.dialogRef.close(true);
                });
              } else {
                Swal.fire({
                  title: "Error",
                  text: response.message,
                  icon: "error",
                  confirmButtonColor: "#4690eb",
                  confirmButtonText: "Continue"
                });
              }
            });
          } else {
            Swal.fire({
              title: "Form Invalid",
              text: "Please fill all required fields correctly.",
              icon: "warning",
              confirmButtonColor: "#4690eb",
              confirmButtonText: "Okay"
            });
          }
        }

        getPatient() {
          this.patientService.getAllPartients().subscribe(response => {
            this.patients = response.data;
          });
        }


        getHospital() {
          this.hostpitalService.getAllHospital().subscribe(response => {
            this.hospital = response.data;
          });
        }

        getReferralType() {
          this.referralsTypeService.getAllReferalType().subscribe(response => {
            this.referralTypes = response.data;
          });
        }


        getReason() {
          this.reasonService.getAllReasons().subscribe(response => {
            this.reason = response.data;
          });
        }

        getReferralDetails(id: number) {
          this.referralsService.getReferralById(id).subscribe(response => {
            if (response.statusCode === 200) {
              this.referralsForm.patchValue(response.data);
            }
          });
        }


        updateReferrals() {
          if (this.referralsForm.valid) {
            this.referralsService.updateReferral(this.referralsForm.value, this.id).subscribe(response => {
              if (response.statusCode === 201) {
                Swal.fire({
                  title: 'Success',
                  text: 'Referral updated successfully',
                  icon: 'success',
                  confirmButtonColor: '#4690eb',
                  confirmButtonText: 'Continue',
                });
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




}
