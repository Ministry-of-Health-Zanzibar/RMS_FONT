import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../../../services/authentication/permission.service';
import { BillFileService } from '../../../../services/Bills/bill-file.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router'; // ✅ fixed (was express import)
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-bill-fill-by-hospital',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './bill-fill-by-hospital.component.html',
  styleUrls: ['./bill-fill-by-hospital.component.scss'],
})
export class BillFillByHospitalComponent {
  private readonly onDestroy = new Subject<void>();

  loading: boolean = false;

  displayedColumns: string[] = [
    'hospital_id',
    'hospital_name',
    'total_bill_file_amount',
    'total_allocated_amount',
    'total_balance',
    'status',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  totals: any = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public permission: PermissionService,
    private billService: BillFileService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBillsByHospital();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
  loadBillsByHospital() {
    this.loading = true;
    this.billService
      .getAllBillFilesByHospital()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response: any) => {
          this.loading = false;
          if (response.data) {
            this.dataSource = new MatTableDataSource(
              response.data.hospitals || []
            );

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this.totals = response.data.totals;
          }
        },
        (error) => {
          this.loading = false;
          console.error('Failed to load bill files', error);
        }
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
