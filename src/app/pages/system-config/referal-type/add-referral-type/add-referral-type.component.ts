import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { HDividerComponent } from '@elementar/components';
import { Subject, takeUntil } from 'rxjs';
import { GlobalConstants } from '@shared/global-constants';
import Swal from 'sweetalert2';
import { ReferalTypeService } from '../../../../services/system-configuration/referal-type.service';

@Component({
  selector: 'app-add-referral-type',
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
  templateUrl: './add-referral-type.component.html',
  styleUrl: './add-referral-type.component.scss'
})
export class AddReferralTypeComponent {

  readonly data = inject<any>(MAT_DIALOG_DATA);
    private readonly onDestroy = new Subject<void>()
    public sidebarVisible:boolean = true
  
    referralTypeForm: FormGroup;
    parent: any;
    uploadProgress: number = 0;
    uploading: boolean = false;
    errorMessage: string | null = null;
    referralData: any;
  
    constructor(private formBuilder:FormBuilder,
      private referralService:ReferalTypeService,
      private dialogRef: MatDialogRef<AddReferralTypeComponent>) {
    }


    ngOnInit(): void {
        if(this.data){
          this.referralData = this.data.data;
         // this.getHospital(this.id);
        }
        this.configForm();
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
        this.referralTypeForm = new FormGroup({
          referral_type_name: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.nameRegexOnly)]),
          // referral_type_code: new FormControl(null, Validators.required),
            
        });
        if(this.referralData){
          this.referralTypeForm.patchValue(this.referralData);
        }
      }
    
      // getParent() {
      //   this.departmentService.getAllDepartment().pipe(takeUntil(this.onDestroy)).subscribe((response: any) => {
      //     this.parent = response.data;
      //   });
      // }
    
        saveReferralType(){
               if(this.referralTypeForm.valid){
                 this.referralService.addReferalType(this.referralTypeForm.value).subscribe(response=>{
                   if(response.statusCode == 201){
                     Swal.fire({
                       title: "Success",
                       text: "Data saved successfull",
                       icon: "success",
                       confirmButtonColor: "#4690eb",
                       confirmButtonText: "Continue"
                     });
                   }else{
                     Swal.fire({
                       title: "Error",
                       text: response.message,
                       icon: "error",
                       confirmButtonColor: "#4690eb",
                       confirmButtonText: "Continue"
                     });
                   }
                 }
           
               );
               }else{
           
               }
             }
    
      updateReferralType(){
        if(this.referralTypeForm.valid){
          this.referralService.updateReferalType(this.referralTypeForm.value, this.referralData.referral_type_id).subscribe(response=>{
            if(response.statusCode == 200){
              Swal.fire({
                title: "Success",
                text: "Data saved successfull",
                icon: "success",
                confirmButtonColor: "#4690eb",
                confirmButtonText: "Continue"
              });
            }else{
              Swal.fire({
                title: "Error",
                text: response.message,
                icon: "error",
                confirmButtonColor: "#4690eb",
                confirmButtonText: "Continue"
              });
            }
          }
    
        );
        }else{
    
        }
      }
    

}
