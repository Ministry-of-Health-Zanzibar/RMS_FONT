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
import { HospitalService } from '../../../../services/system-configuration/hospital.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addhospital',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInput,
    MatFormField,
    MatLabel,
    MatDialogModule,
    MatError,
    ReactiveFormsModule
],
  templateUrl: './addhospital.component.html',
  styleUrl: './addhospital.component.scss'
})
export class AddhospitalComponent {
readonly data = inject<any>(MAT_DIALOG_DATA);
    private readonly onDestroy = new Subject<void>()
    public sidebarVisible:boolean = true
  
    hospitalForm: FormGroup;
    parent: any;
    uploadProgress: number = 0;
    uploading: boolean = false;
    errorMessage: string | null = null;
    hospitalData: any;
  
    constructor(private formBuilder:FormBuilder,
      private hospitalService:HospitalService,
      private dialogRef: MatDialogRef<AddhospitalComponent>) {
    }


    ngOnInit(): void {
        if(this.data){
          this.hospitalData = this.data.data;
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
        this.hospitalForm = new FormGroup({
          hospital_name: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.nameRegexOnly)]),
          hospital_address: new FormControl(null, Validators.required),
          hospital_email: new FormControl(null, Validators.required),
          contact_number: new FormControl(null, Validators.required),
        });
        if(this.hospitalData){
          this.hospitalForm.patchValue(this.hospitalData);
        }
      }
    
      // getParent() {
      //   this.departmentService.getAllDepartment().pipe(takeUntil(this.onDestroy)).subscribe((response: any) => {
      //     this.parent = response.data;
      //   });
      // }
    
      saveHospital(){
        if(this.hospitalForm.valid){
          this.hospitalService.addHospital(this.hospitalForm.value).subscribe(response=>{
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
    
      updateHospital(){
        if(this.hospitalForm.valid){
          this.hospitalService.updateHospital(this.hospitalForm.value, this.hospitalData.hospital_id).subscribe(response=>{
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

