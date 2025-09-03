import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { PermissionService } from '../../../../services/authentication/permission.service';
import { BillFileService } from '../../../../services/Bills/bill-file.service';
import { BillService } from '../../../../services/system-configuration/bill.service';
import {
  AddBillDialogData,
  AddBillsComponent,
} from '../add-bills/add-bills.component';
import { ReferralService } from '../../../../services/Referral/referral.service';

@Component({
  selector: 'app-bill-file-by-id',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bill-file-by-id.component.html',
  styleUrls: ['./bill-file-by-id.component.scss'],
  providers: [DatePipe],
})
export class BillFileByIdComponent implements OnInit {
  public bills: any[] = [];
  public billsList: any[] = [];
  public loading = false;
  public bill_id: string | null = null;
  public bill_file_id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    public permission: PermissionService,
    private billService: BillService,
    private billFileService: BillFileService,
    private referralService: ReferralService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.bill_id = this.route.snapshot.paramMap.get('id');
    if (this.bill_id) {
      this.getBillFileAndBills(this.bill_id);
    }
  }

  private getBillFileAndBills(billId: string) {
    this.loading = true;

    this.billFileService.getbillFilesById(billId).subscribe({
      next: (response: any) => {
        this.loading = false;

        if (response?.data) {
          this.bills = [response.data];
          this.bill_file_id = response.data.bill_file_id;

          if (this.bill_file_id) {
            this.loadBillsByBillFileId(this.bill_file_id);
          }
        } else {
          this.bills = [];
          this.billsList = [];
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching bill file:', error);
        Swal.fire('Error', 'Failed to fetch bill file', 'error');
      },
    });
  }

  private loadBillsByBillFileId(bill_file_id: number) {
    this.loading = true;
    this.billsList = [];

    this.billFileService.getbillsBybillFile(bill_file_id).subscribe({
      next: (res: any) => {
        this.loading = false;

        const responseData = res?.data;
        if (responseData) {
          this.billsList = Array.isArray(responseData)
            ? responseData.map((bill: any) => this.formatBill(bill))
            : [this.formatBill(responseData)];
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Error fetching bills by file id:', err);
        Swal.fire('Error', 'Failed to fetch bills', 'error');
      },
    });
  }

  private formatBill(bill: any) {
    return {
      bill_id: bill.bill_id,
      referral_id: bill.referral_id,
      total_amount: bill.total_amount,
      bill_period_start: bill.bill_period_start,
      bill_period_end: bill.bill_period_end,
      bill_status: bill.bill_status,
      bill_file: bill.bill_file,
      created_by: bill.created_by,
      created_at: bill.created_at,
      updated_at: bill.updated_at,
      deleted_at: bill.deleted_at,
    };
  }

  addPatientToBill(billFileId: number) {
    const dialogData: AddBillDialogData = {
      billFileId,
      hospitalId: this.bills[0]?.hospital_id,
      billTitle: this.bills[0]?.bill_file_title || 'Bill',
      referralOptions: [],
    };

    const dialogRef = this.dialog.open(AddBillsComponent, {
      width: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.createBill(result);
      }
    });
  }

  private createBill(billData: any) {
    this.loading = true;
    this.billService.addBill(billData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.data) {
          this.billsList.push(this.formatBill(response.data));
        }

        Swal.fire({
          title: 'Success!',
          text: response.message || 'Bill created successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        this.loading = false;
        console.error('Error creating bill:', error);
        Swal.fire('Error', 'Failed to create bill', 'error');
      }
    );
  }

  /** ✅ Delete Bill */
  deleteBill(billId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this.billService.deleteBill(billId).subscribe(
          () => {
            this.billsList = this.billsList.filter(
              (bill) => bill.bill_id !== billId
            );
            this.loading = false;
            Swal.fire('Deleted!', 'The bill has been deleted.', 'success');
          },
          (error) => {
            this.loading = false;
            console.error('Error deleting bill:', error);
            Swal.fire('Error', 'Failed to delete bill', 'error');
          }
        );
      }
    });
  }

  extractFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}
