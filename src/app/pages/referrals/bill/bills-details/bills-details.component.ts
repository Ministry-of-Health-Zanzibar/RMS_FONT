import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BillService } from '../../../../services/system-configuration/bill.service';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDivider } from '@angular/material/divider';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-bills-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDivider,
    MatProgressSpinner,
    MatListModule,
    MatChipsModule,
  ],
  templateUrl: './bills-details.component.html',
  styleUrls: ['./bills-details.component.scss'],
  providers: [DatePipe],
})
export class BillsDetailsComponent implements OnInit {
  public loading = false;
  public billId: string | null = null;
  public billData: any = null;

  constructor(
    private route: ActivatedRoute,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.billId = this.route.snapshot.paramMap.get('id');
    if (this.billId) {
      this.fetchBillDetails(this.billId);
    }
  }

  fetchBillDetails(id: string) {
    this.loading = true;
    this.billService.getBillById(id).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (!res?.data) {
          Swal.fire('Info', 'No bill found', 'info');
          return;
        }
        this.billData = res.data;
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        Swal.fire('Error', 'Failed to fetch bill details', 'error');
      },
    });
  }
}
