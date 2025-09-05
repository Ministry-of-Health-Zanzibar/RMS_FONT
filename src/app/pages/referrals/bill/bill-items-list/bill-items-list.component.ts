import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BillItermService } from '../../../../services/Bills/bill-iterm.service';
import { BillItermFormComponent } from '../bill-iterm-form/bill-iterm-form.component';

export interface BillItem {
  bill_id?: number;
  description: string;
  amount: number;
}

@Component({
  selector: 'app-bill-items-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './bill-items-list.component.html',
  styleUrls: ['./bill-items-list.component.scss']
})
export class BillItemsListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['bill_id', 'description', 'amount'];
  dataSource = new MatTableDataSource<BillItem>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private billService: BillItermService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadBillItems();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadBillItems(): void {
    this.loading = true;
    this.billService.getAllBillIterm().subscribe({
      next: (data) => {
        // If API wraps data, use: data.billItems
        this.dataSource.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching bill items:', err);
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(BillItermFormComponent, {
      width: '400px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.loadBillItems();
      }
    });
  }
}
