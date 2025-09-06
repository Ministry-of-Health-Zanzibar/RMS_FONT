import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

import { BillItermService } from '../../../../services/Bills/bill-iterm.service';
import { BillItermFormComponent } from '../bill-iterm-form/bill-iterm-form.component';
import { Console } from 'console';

interface BillItem {
  bill_item_id: number;
  bill_id: number;
  description: string;
  amount: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bill: any;
}

@Component({
  selector: 'app-bill-iterm-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './bill-iterm-details.component.html',
  styleUrls: ['./bill-iterm-details.component.scss'],
  providers: [DatePipe],
})
export class BillItermDetailsComponent implements OnInit, AfterViewInit {
  public loading = false;
  public bill_id: string | null = null;

  displayedColumns: string[] = [
    'bill_item_id',
    'description',
    'amount',
    'created_at',
    'updated_at',
    'actions',
  ];
  dataSource: MatTableDataSource<BillItem> = new MatTableDataSource<BillItem>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private billService: BillItermService,
    private router: Router,
    private datePipe: DatePipe,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.bill_id = this.route.snapshot.paramMap.get('id');
    if (this.bill_id) {
      this.getBillItemsByBillId(this.bill_id);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private getBillItemsByBillId(billId: string) {
    this.loading = true;
    this.billService.getbillItermByBillId(billId).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.data) {
          this.dataSource.data = response.data;
        } else {
          console.log("data hamna")
          // Swal.fire('Not Found', 'No bill items found', 'warning');
          // this.dataSource.data = [];
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching bill items:', error);
        // Swal.fire('Error', 'Failed to fetch bill items', 'error');
      },
    });
  }

  backToBills() {
    this.router.navigate(['/pages/config/referrals/more-bill-file']);
  }

  addBillIterm(billId: number) {
    const dialogRef = this.dialog.open(BillItermFormComponent, {
      width: '600px',
      data: { billId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const payload = {
          bill_id: billId,
          description: result.description,
          amount: result.amount,
        };

        this.createBillItem(payload);
      }
    });
  }

  private createBillItem(payload: {
    bill_id: number;
    description: string;
    amount: number;
  }) {
    this.billService.addbillIterms(payload).subscribe({
      next: (response) => {
        Swal.fire('Success', 'Bill item added successfully', 'success');

        // Refresh table from backend to ensure consistency
        if (payload.bill_id) {
          this.getBillItemsByBillId(payload.bill_id.toString());
        }
      },
      error: (error) => {
        console.error('Error creating bill item:', error);
        Swal.fire('Error', 'Failed to add bill item', 'error');
      },
    });
  }
}
