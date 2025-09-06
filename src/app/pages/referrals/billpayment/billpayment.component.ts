import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PaymentsService } from '../../../services/payments.service';
import { ReferralpaymentComponent } from '../referralpayment/referralpayment.component';
import { BillComponent } from '../bill/bill.component';
import { PermissionService } from '../../../services/authentication/permission.service';
import { BillFileService } from '../../../services/Bills/bill-file.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-billpayment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule, 
    MatChipsModule,
  ],
  templateUrl: './billpayment.component.html',
  styleUrls: ['./billpayment.component.scss'],
})
export class BillpaymentComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly onDestroy = new Subject<void>();
  loading = false;

 displayedColumns: string[] = [
  'bill_file_id',
  'hospital_name',
  'bill_file_title',
  'pdf',
  'bill_file_amount',
  'paid_amount',
  'balance',
  'status',
  'actions',
];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paymentsService: PaymentsService,
    private billiiFileService:BillFileService,
    private router: Router,
    private dialog: MatDialog,
    public permission: PermissionService
  ) {}

  ngOnInit(): void {
    this.getPayments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  renew() {
    this.getPayments();
  }

  getPayments() {
    this.loading = true;
    this.billiiFileService
      .getAllBillFilesForPayment()
      .pipe(takeUntil(this.onDestroy))
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.statusCode === 200) {
            this.dataSource.data = res.data;
          } else if (res.statusCode === 401) {
            this.router.navigateByUrl('/');
          }
        },
        error: (err) => {
          this.loading = false;
          console.error(err);
        },
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

   viewPDF(element: any) {
    const url = 'http://127.0.0.1:8000/storage/' + element.bill_file;
    window.open(url, '_blank');
  }


  
  getPayment(id: number) {
    const config = new MatDialogConfig();
    config.data = { id }; 
    config.width = '950px';
    config.height = '1000px';
    config.disableClose = false;
    this.dialog
      .open(ReferralpaymentComponent, config)
      .afterClosed()
      .subscribe(() => this.getPayments());
  }

  
  getBills(id: number) {
    const config = new MatDialogConfig();
    config.data = { id }; 
    config.width = '850px';
    config.disableClose = false;
    this.dialog.open(BillComponent, config).afterClosed().subscribe(() => this.getPayments());
  }

   displayMoreData(data: any) {
    const id = data.bill_file_id;
    this.router.navigate(['/pages/config/referrals/payment-details', id]);
  }
}
