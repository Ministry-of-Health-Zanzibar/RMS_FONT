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
import { ReasonsService } from '../../../../services/system-configuration/reasons.service';


@Component({
  selector: 'app-addreason',
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
  templateUrl: './addreason.component.html',
  styleUrl: './addreason.component.scss'
})
export class AddreasonComponent {
 readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly onDestroy = new Subject<void>()
  public sidebarVisible:boolean = true

  reasonForm: FormGroup;
  parent: any;
  uploadProgress: number = 0;
  uploading: boolean = false;
  errorMessage: string | null = null;
  id: any;

  constructor(private formBuilder:FormBuilder,
    private  reasonService:ReasonsService,
    private dialogRef: MatDialogRef<AddreasonComponent>) {
  }

  ngOnInit(): void {
    this.configForm();
    if(this.data){
      this.id = this.data.id;
     // this.getHospital(this.id);
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
    this.reasonForm = new FormGroup({
      referral_reason_name: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.nameRegexOnly)]),
      reason_descriptions: new FormControl(null, Validators.required),
      // hospital_address:  new FormControl(null, Validators.required),
      // hospital_email:new FormControl(null, Validators.required),
      // contact_number:new FormControl(null, Validators.required),
    });
  }

  // getParent() {
  //   this.departmentService.getAllDepartment().pipe(takeUntil(this.onDestroy)).subscribe((response: any) => {
  //     this.parent = response.data;
  //   });
  // }

  saveReason(){
    if(this.reasonForm.valid){
      this.reasonService.addReasons(this.reasonForm.value).subscribe(response=>{
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

  // updateDepartment(){
  //   if(this.departmentForm.valid){
  //     this.departmentService.updateDepartment(this.departmentForm.value, this.id).subscribe(response=>{
  //       if(response.statusCode == 201){
  //         Swal.fire({
  //           title: "Success",
  //           text: "Data saved successfull",
  //           icon: "success",
  //           confirmButtonColor: "#4690eb",
  //           confirmButtonText: "Continue"
  //         });
  //       }else{
  //         Swal.fire({
  //           title: "Error",
  //           text: response.message,
  //           icon: "error",
  //           confirmButtonColor: "#4690eb",
  //           confirmButtonText: "Continue"
  //         });
  //       }
  //     }

  //   );
  //   }else{

  //   }
  // }
}