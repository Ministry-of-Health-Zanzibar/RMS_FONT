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
import { BillService } from '../../../../services/system-configuration/bill.service';

@Component({
  selector: 'app-addbill',
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
  templateUrl: './addbill.component.html',
  styleUrl: './addbill.component.scss'
})
export class AddbillComponent {

  readonly data = inject<any>(MAT_DIALOG_DATA);
  private readonly onDestroy = new Subject<void>()
  public sidebarVisible:boolean = true

  billForm: FormGroup;
  parent: any;
  uploadProgress: number = 0;
  uploading: boolean = false;
  errorMessage: string | null = null;
  id: any;

  constructor(private formBuilder:FormBuilder,
    private billService: BillService,
    private dialogRef: MatDialogRef<AddbillComponent>) {
  }

  ngOnInit(): void {
    this.configForm();
    if(this.data){
      this.id = this.data.id;
     // this.getHospital(this.id);
    }
  }

  getHospital(id: any){
    this.billService.getBillById(id).subscribe(response=>{
      this.billForm.patchValue(response.data[0])
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next()
  }
  onClose() {
    this.dialogRef.close(false)
  }

  configForm(){
    this.billForm = new FormGroup({
      referral_id: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.nameRegexOnly)]),
      amount: new FormControl(null, Validators.required),
      notes:  new FormControl(null, Validators.required),
      sent_to:new FormControl(null, Validators.required),
      bill_file:new FormControl(null, Validators.required),
    });
  }

  // getParent() {
  //   this.departmentService.getAllDepartment().pipe(takeUntil(this.onDestroy)).subscribe((response: any) => {
  //     this.parent = response.data;
  //   });
  // }

  saveBill(){
    if(this.billForm.valid){
      this.billService.addBill(this.billForm.value).subscribe(response=>{
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

  updateBill(){
    if(this.billForm.valid){
      this.billService.updateBill(this.billForm.value, this.id).subscribe(response=>{
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
}
