import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { HDividerComponent } from '@elementar/components';
import Swal from 'sweetalert2';
import { BillService } from '../../../services/system-configuration/bill.service';
import { Subject } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-referralpayment',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatLabel,
    MatCheckbox,
    ReactiveFormsModule,
    HDividerComponent,
    MatAutocompleteModule,
    MatSelect,
    MatDatepickerModule,
    MatIcon
  ],
  templateUrl: './referralpayment.component.html',
  styleUrl: './referralpayment.component.scss'
})
export class ReferralpaymentComponent  {
  private readonly onDestroy = new Subject<void>()
   readonly data = inject<any>(MAT_DIALOG_DATA);
   public sidebarVisible:boolean = true

   clientForm: FormGroup;
   user: any;
   id: any;
   bill: any = null;

   constructor(

     private billServices:BillService,
     private dialogRef: MatDialogRef<ReferralpaymentComponent>)
     {

   }

   ngOnInit(): void {
     this.configForm();
     if(this.data){
       this.id = this.data.id;
     console.log("bill ID   here  ",this.id);
    // console.log("bill amount   here  ",this.data);

     }
     this.getBillByIds()
    // this.viewUser();

   }



   ngOnDestroy(): void {
     this.onDestroy.next()
   }

   onClose() {
     this.dialogRef.close(false)
   }

   configForm(){
     this.clientForm = new FormGroup({
       bill_id: new FormControl(this.id),
       amount_paid: new FormControl(null, Validators.required),
       payment_method: new FormControl(null, [Validators.required, ]),
       bill_status: new FormControl(null, [Validators.required, ]),


     });
   }



getBillByIds() {
  this.billServices.getBillById(this.id).subscribe((response: any) => {
    if (response.statusCode === 200 && response.data) {
      this.bill = response.data;  // not an array – extract data directly
      console.log('Bill data:', this.bill);
    }
  }, error => {
    console.error('Error fetching bill:', error);
  });
}




   savePayment() {
     if (this.clientForm.valid) {
       const formData = {
         ...this.clientForm.value,
         bill_id: this.id  // override in case it was not set in form
       };

       this.billServices.addPayment(formData).subscribe(response => {
         if (response.statusCode === 201) {
           Swal.fire({
             title: "Success",
             text: response.message,
             icon: "success",
             confirmButtonColor: "#4690eb",
             confirmButtonText: "Continue"
           });
         } else {
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonColor: "#4690eb",
            confirmButtonText: "Continue"
           });
         }
       });
     }
   }






 }
