import { CommonModule } from '@angular/common';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionService } from '../../../services/authentication/permission.service';
import { BillFileService } from '../../../services/Bills/bill-file.service';
import { ReferralpaymentComponent } from '../referralpayment/referralpayment.component';
import { EmrSegmentedModule } from '@elementar/components';
import {MatDividerModule} from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-billpayment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    EmrSegmentedModule,
    MatCardModule
  ],
  templateUrl: './billpayment.component.html',
  styleUrls: ['./billpayment.component.scss'],
})
export class BillpaymentComponent implements OnInit, OnDestroy {
  private readonly onDestroy = new Subject<void>();
  loading = false;

  displayedColumns: string[] = [
    'id',
    'title',
    'hospital_name',
    'pdf',
    'amount',
    'paid_amount',
    'balance',
    'status',
    'action',
  ];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  hospital_id: number | null;
  payment: any[];
  totals: any;
  hospital_name: any;

  constructor(
    public permission: PermissionService,
    private billFileService: BillFileService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hospital_id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.hospital_id) {
      this.getAllPaymentByHospital(this.hospital_id);
    }
  }

  public getAllPaymentByHospital(hospital_id: number) {
    this.loading = true;
    this.billFileService.getAllBillFilesForPaymentById(hospital_id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.data) {
          this.hospital_id = response.data.hospital_id;
          this.hospital_name = response.data.hospital_name;

          this.dataSource.data = response.data.bill_files || [];

          this.totals = response.data.totals || {};
        } else {
          this.dataSource.data = [];
          this.totals = {};
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching bill files:', error);
        Swal.fire('Error', 'Failed to fetch bill files', 'error');
      },
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // loadBillPayments() {
  //   this.loading = true;
  //   this.billFileService
  //     .getAllBillFilesForPayment()
  //     .pipe(takeUntil(this.onDestroy))
  //     .subscribe({
  //       next: (res: any) => {
  //         this.loading = false;
  //         if (res.statusCode === 200) {
  //           this.dataSource = new MatTableDataSource(res.data);
  //           this.dataSource.paginator = this.paginator;
  //           this.dataSource.sort = this.sort;
  //         }
  //       },
  //       error: (err) => {
  //         this.loading = false;
  //         console.error(err);
  //       },
  //     });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  viewPDF(element: any) {
    const url = 'http://127.0.0.1:8000/storage/' + element.bill_file;
    window.open(url, '_blank');
  }

  // addPayment(id: number) {
  //   const config = new MatDialogConfig();
  //   config.data = { id };
  //   config.width = '950px';
  //   config.height = '1000px';
  //   this.dialog.open(ReferralpaymentComponent, config).afterClosed().subscribe(() => this.loadBillPayments());
  // }

  addPayment(bill: any) {
    const config = new MatDialogConfig();
    console.log('Element sent to dialog:', bill);
    config.data = bill;
    config.width = '950px';
    config.height = '1000px';

    this.dialog
      .open(ReferralpaymentComponent, config)
      .afterClosed()
      // .subscribe(() => this.getAllPaymentByHospital());
  }

  displayMoreData(element: any) {
    const id = element.bill_file_id;
    this.router.navigate(['/pages/config/referrals/more-bill-file', id]);
  }

  confirmDelete(element: any) {
    Swal.fire({
      title: 'Confirm',
      text: `Are you sure you want to delete "${element.bill_file_title}"?`,
      icon: 'warning',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBill(element.bill_file_id);
      }
    });
  }

  deleteBill(id: number) {
    this.billFileService.deletebillFiles(id).subscribe((res) => {
      if (res.statusCode === 200) {
        Swal.fire('Deleted!', res.message, 'success');
        this.getAllPaymentByHospital(id);
      } else {
        Swal.fire('Error', res.message, 'error');
      }
    });
  }
}
