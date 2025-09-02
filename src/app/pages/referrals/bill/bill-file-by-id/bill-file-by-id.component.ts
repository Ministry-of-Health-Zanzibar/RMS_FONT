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
  public loading: boolean = false;
  public isLoading: boolean = false;
  public bill_id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    public permission: PermissionService,
    private billService: BillService,
    private billFileService: BillFileService,
    private referralService:ReferralService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.bill_id = this.route.snapshot.paramMap.get('id');
    if (this.bill_id) {
      this.getBillFiles();
      this.getBillsByFileId();
    }
  }

  getBillFiles() {
    this.loading = true;
    this.billFileService.getbillFilesById(this.bill_id).subscribe(
      (response: any) => {
        this.loading = false;
        this.bills = response?.data ? [response.data] : [];
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching bill file:', error);
        Swal.fire('Error', 'Failed to fetch bill file', 'error');
      }
    );
  }

  getBillsByFileId(): void {
    if (!this.bill_id) return;

    this.isLoading = true;
    this.billsList = [];

    this.billService.getBillById(this.bill_id).subscribe({
      next: (res: any) => {
        const responseData = res?.data;
        if (responseData && Array.isArray(responseData)) {
          console.log(" hii", responseData)
          this.billsList = responseData.map((bill: any) => ({
          
            id: bill.bill_id,
            referralId: bill.referral_id,
            totalAmount: bill.total_amount,
            billPeriodStart: bill.bill_period_start,
            billPeriodEnd: bill.bill_period_end,
            sentDate: bill.sent_date,
            billFile: bill.bill_file,
            createdBy: bill.created_by,
            createdAt: bill.created_at,
            updatedAt: bill.updated_at,
            deletedAt: bill.deleted_at,
          }));
        } else {
          this.billsList = [];
        }
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching bills:', err);
        this.isLoading = false;
      },
    });
  }

  /** ✅ Open Add Patient to Bill Dialog */
  addPatientToBill(billFileId: number) {
    const dialogData: AddBillDialogData = {
      billFileId,
      billTitle: this.bills[0]?.bill_file_title || 'Bill',
      referralOptions: [], // TODO: populate actual referrals
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

  /** ✅ Create new Bill */
  private createBill(billData: any) {
    this.loading = true;
    this.billService.addBill(billData).subscribe(
      (response: any) => {
        this.loading = false;
        if (response.data) {
          this.billsList.push(response.data);
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
              (bill) => bill.id !== billId
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

  /** ✅ Extract filename from file URL */
  extractFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}
