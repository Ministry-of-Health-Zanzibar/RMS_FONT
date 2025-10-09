import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatAnchor,
  MatButton,
  MatIconButton,
  MatMiniFabButton,
} from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { EmrSegmentedModule, VDividerComponent } from '@elementar/components';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from '../../../services/authentication/permission.service';
import { PartientService } from '../../../services/partient/partient.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { AddbodylistComponent } from '../addbodylist/addbodylist.component';
import { InsuranceComponent } from '../insurance/insurance.component';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-bodyform-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIcon,
    VDividerComponent,
    MatTooltip,
    MatSlideToggleModule,
    FormsModule,
    MatButton,
    EmrSegmentedModule,
  ],
  templateUrl: './bodyform-list.component.html',
  styleUrl: './bodyform-list.component.scss',
})
export class BodyformListComponent {
  public documentUrl = environment.fileUrl;
  private readonly onDestroy = new Subject<void>();
  loading: boolean = false;

  constructor(
    public permission: PermissionService,
    private userService: PartientService,
    private dialog: MatDialog,

    private router: Router
  ) {}

  displayedColumns: string[] = ['id', 'title', 'pdf', 'action', 'action2'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.userPetient();
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
  }
  renew() {
    this.userPetient();
  }

  userPetient() {
    this.loading = true;
    this.userService
      .getAllBodyList()
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (response: any) => {
          this.loading = false;
          if (response.data) {
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          } else {
            console.log('permission response errors');
          }
        },
        (error) => {
          this.loading = false;
          console.log('permission getAway api fail to load');
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

  viewPDF(element: any) {
    if (element?.patient_list_file) {
      const url = this.documentUrl + element.patient_list_file;
      window.open(url, '_blank');
    }
  }

  addPatient() {
    let config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    // config.width = '95vw';
    // config.maxWidth = '100vw';
    // config.maxHeight = '100vh';
    // config.panelClass = 'wide-modal';

    const dialogRef = this.dialog.open(AddbodylistComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      this.userPetient();
    });
  }

  updatePatient(data: any) {
    let config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    // config.maxWidth = '100vw';
    // config.maxHeight = '100vh';
    // config.height = '600px';
    // config.width = '850px';
    // config.panelClass = 'full-screen-modal';
    config.data = { data: data };

    const dialogRef = this.dialog.open(AddbodylistComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      this.userPetient();
    });
  }

  // confirmBlock(data: any) {
  //   var message;
  //   if (data.deleted_at) {
  //     message = 'Are you sure you want to unblock';
  //   } else {
  //     message = 'Are you sure you want to block';
  //   }
  //   Swal.fire({
  //     title: 'Confirm',
  //     html: message + ' <b> ' + data.name + ' </b> ',
  //     icon: 'warning',
  //     confirmButtonColor: '#4690eb',
  //     confirmButtonText: 'Confirm',
  //     cancelButtonColor: '#D5D8DC',
  //     cancelButtonText: 'Cancel',
  //     showCancelButton: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.blockPatient(data, data.deleted_at);
  //     } else {
  //       this.userPetient();
  //     }
  //   });
  // }

  // blockPatient(data: any, deleted: any): void {
  //   if (deleted) {
  //     this.userService
  //       .unblockPatient(data, data?.patient_list_id)
  //       .subscribe((response) => {
  //         if (response.statusCode == 200) {
  //           Swal.fire({
  //             title: 'Success',
  //             text: response.message,
  //             icon: 'success',
  //             confirmButtonColor: '#4690eb',
  //             confirmButtonText: 'Continue',
  //           });
  //           this.userPetient();
  //         } else {
  //           Swal.fire({
  //             title: 'Error',
  //             text: response.message,
  //             icon: 'error',
  //             confirmButtonColor: '#4690eb',
  //             confirmButtonText: 'Continue',
  //           });
  //         }
  //       });
  //   } else {
  //     this.userService
  //       .deletePatient(data?.patient_list_id)
  //       .subscribe((response) => {
  //         if (response.statusCode == 200) {
  //           Swal.fire({
  //             title: 'Success',
  //             text: response.message,
  //             icon: 'success',
  //             confirmButtonColor: '#4690eb',
  //             confirmButtonText: 'Continue',
  //           });
  //           this.userPetient();
  //         } else {
  //           Swal.fire({
  //             title: 'Error',
  //             text: response.message,
  //             icon: 'error',
  //             confirmButtonColor: '#4690eb',
  //             confirmButtonText: 'Continue',
  //           });
  //         }
  //       });
  //   }
  // }

  // Call this from the template on toggle
  confirmBlock(patient: any) {
    const isDeleted = !!patient.deleted_at;
    const action = isDeleted ? 'Unblock' : 'Delete';

    Swal.fire({
      title: `Are you sure you want to ${action.toLowerCase()} this patient?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action.toLowerCase()} it!`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.blockPatient(patient, isDeleted);
      }
    });
  }

  blockPatient(data: any, deleted: any): void {
    if (deleted) {
      this.userService
        .unblockPatient(data?.patient_list_id)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Success',
              text: response.message,
              icon: 'success',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            });
            this.userPetient();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            });
          }
        });
    } else {
      this.userService
        .deletePatient(data?.patient_list_id)
        .subscribe((response) => {
          if (response.statusCode == 200) {
            Swal.fire({
              title: 'Success',
              text: response.message,
              icon: 'success',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            });
            this.userPetient();
          } else {
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error',
              confirmButtonColor: '#4690eb',
              confirmButtonText: 'Continue',
            });
          }
        });
    }
  }

  getPatient(id: any) {
    console.log('hiiii', id);
    let config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '100vh';
    config.width = '850px';
    config.panelClass = 'full-screen-modal';
    config.data = { id: id };

    const dialogRef = this.dialog.open(InsuranceComponent, config);

    dialogRef.afterClosed().subscribe((result) => {
      this.userPetient();
    });
  }

  displayMoreData(data: any) {
    const id = data.patient_list_id;
    this.router.navigate(['/pages/patient/bodylist', id]);
  }
}
