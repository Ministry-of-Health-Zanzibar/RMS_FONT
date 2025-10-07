import { Component, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { Subject, takeUntil } from 'rxjs';
import { PartientService } from '../../../services/partient/partient.service';
import { PermissionService } from '../../../services/authentication/permission.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PartientFormComponent } from '../partient-form/partient-form.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-patiant',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    MatSlideToggle,
  ],
  templateUrl: './patiant.component.html',
  styleUrls: ['./patiant.component.scss'],
})
export class PatiantComponent {
  public documentUrl = environment.fileUrl;
  private readonly onDestroy = new Subject<void>();
  loading: boolean = false;

  displayedColumns: string[] = [
    'id',
    'name',
    'matibabu_card',
    'date_of_birth',
    'gender',
    'phone',
    'patient_file',
    'action',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public permission: PermissionService,
    private userService: PartientService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  renew() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.userService
      .getAllPartients()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response: any) => {
          this.loading = false;
          if (response.data) {
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            console.log('No patient data found');
          }
        },
        (error) => {
          this.loading = false;
          console.log('Failed to load patient data', error);
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

viewPDF(file: any) {
  if (file?.file_path) {
    const url = this.documentUrl + file.file_path;
    window.open(url, '_blank');
  }
}


  addPatient() {
    const config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '98vh';
    // config.width = '950px';
    config.panelClass = 'full-screen-modal';

    const dialogRef = this.dialog.open(PartientFormComponent, config);
    dialogRef.afterClosed().subscribe(() => {
      this.loadPatients();
    });
  }

  updatePatient(data: any) {
    const config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '98vh';
    config.width = '850px';
    config.panelClass = 'full-screen-modal';
    config.data = { data };

    const dialogRef = this.dialog.open(PartientFormComponent, config);
    dialogRef.afterClosed().subscribe(() => {
      this.loadPatients();
    });
  }

  confirmBlock(data: any) {
    const message = data.deleted_at
      ? 'Are you sure you want to unblock'
      : 'Are you sure you want to block';
    Swal.fire({
      title: 'Confirm',
      html: `${message} <b>${data.name}</b>?`,
      icon: 'warning',
      confirmButtonColor: '#4690eb',
      confirmButtonText: 'Confirm',
      cancelButtonColor: '#D5D8DC',
      cancelButtonText: 'Cancel',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.blockPatient(data, data.deleted_at);
      }
    });
  }

  blockPatient(data: any, deleted: any) {
  if (deleted) {
    this.userService.unblockPatients(data, data?.patient_id).subscribe(
      (res: any) => {
        Swal.fire('Success', res.message, 'success');
        this.loadPatients();
      },
      (err) => {
        Swal.fire('Error', 'Failed to unblock patient', 'error');
      }
    );
  } else {
    this.userService.deletePatients(data?.patient_id).subscribe(
      (res: any) => {
        Swal.fire('Success', res.message, 'success');
        this.loadPatients();
      },
      (err) => {
        Swal.fire('Error', 'Failed to delete patient', 'error');
      }
    );
  }
}

  displayMoreData(data: any) {
    const id = data.patient_list_id;
    this.router.navigate(['/pages/patient/bodylist', id]);
  }
}
