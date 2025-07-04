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
  selector: 'app-billwithpayment',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatIcon
  ],
  templateUrl: './billwithpayment.component.html',
  styleUrl: './billwithpayment.component.scss'
})
export class BillwithpaymentComponent {

 private readonly onDestroy = new Subject<void>()
   readonly data = inject<any>(MAT_DIALOG_DATA);
   public sidebarVisible:boolean = true

   clientForm: FormGroup;
   user: any;
   id: any;
   bill: any = null;
    totalPayments: number = 0;
    difference: number = 0;

   constructor(

     private billServices:BillService,
     private dialogRef: MatDialogRef<BillwithpaymentComponent>)
     {

   }

   ngOnInit(): void {

     if(this.data){
       this.id = this.data.id;
     console.log("bill with payment ID   here  ",this.id);
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


 getBillByIds() {
    this.billServices.getBillwithPayment(this.id).subscribe((response: any) => {
      if (response.statusCode === 200 && response.data) {
        this.bill = response.data;

        // Sum all payments
        this.totalPayments = this.bill.payments
          .map((p: { amount_paid: any; }) => Number(p.amount_paid))
          .reduce((sum: any, val: any) => sum + val, 0);

        // Subtract bill amount to get the difference
        this.difference = this.totalPayments - Number(this.bill.bill_amount);
      }
    }, error => {
      console.error('Error fetching bill:', error);
    });
  }




 }

