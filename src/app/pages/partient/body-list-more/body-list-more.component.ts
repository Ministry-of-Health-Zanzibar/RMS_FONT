import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import Swal from 'sweetalert2';

import { PartientService } from '../../../services/partient/partient.service';
import { PermissionService } from '../../../services/authentication/permission.service';
import { AddPatientDialogData, AddpartientComponent } from '../addpartient/addpartient.component';
import { environment } from '../../../../environments/environment.prod';

interface BodyList {
  patient_list_id: number;
  patient_list_title: string;
  patient_list_file?: string;
}

interface Patient {
  matibabu_card: number;
  name?: string;
  gender?: string;
  phone?: string;
  location?: string;
   files?: {
    file_id: number;
    file_name: string;
    file_path: string;
    file_type: string;
  }[];
}

@Component({
  selector: 'app-body-list-more',
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
    ReactiveFormsModule,
    MatMenuModule,
  ],
  templateUrl: './body-list-more.component.html',
  styleUrls: ['./body-list-more.component.scss'],
  providers: [DatePipe],
})
export class BodyListMoreComponent implements OnInit, AfterViewInit {
   public documentUrl = environment.fileUrl;
  public bodyList: BodyList[] = [];
  public loading = false;
  public patient_id: string | null = null;
  public patient_list_id: number | null = null;

  displayedBodyListColumns: string[] = ['patient_list_title', 'patient_list_file', 'actions'];
  bodyListDataSource: MatTableDataSource<BodyList> = new MatTableDataSource<BodyList>();

  displayedPatientColumns: string[] = ['matibabu_card', 'name', 'gender', 'phone', 'location','files'];
  patientDataSource: MatTableDataSource<Patient> = new MatTableDataSource<Patient>();

  @ViewChild('bodyListPaginator') bodyListPaginator!: MatPaginator;
  @ViewChild('bodyListSort') bodyListSort!: MatSort;
  @ViewChild('patientPaginator') patientPaginator!: MatPaginator;
  @ViewChild('patientSort') patientSort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    public permission: PermissionService,
    private userService: PartientService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.patient_id = this.route.snapshot.paramMap.get('id');
    if (this.patient_id) {
      this.getBodyListFileAndPatient(this.patient_id);
    }
  }

  ngAfterViewInit(): void {
    this.bodyListDataSource.paginator = this.bodyListPaginator;
    this.bodyListDataSource.sort = this.bodyListSort;

    this.patientDataSource.paginator = this.patientPaginator;
    this.patientDataSource.sort = this.patientSort;
  }

  applyBodyListFileFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.bodyListDataSource.filter = filterValue.trim().toLowerCase();
  }

  applyPatientFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.patientDataSource.filter = filterValue.trim().toLowerCase();
  }

  private getBodyListFileAndPatient(bodyListId: string) {
    this.loading = true;
    this.userService.getBodyListById(bodyListId).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.data) {
          this.bodyList = [response.data];
          this.bodyListDataSource.data = this.bodyList;
          this.patient_list_id = response.data.patient_list_id;

          // Load patients from the response
          this.patientDataSource.data = response.data.patients
            ? response.data.patients.map((p: any) => this.formatPatient(p))
            : [];
        } else {
          this.bodyList = [];
          this.bodyListDataSource.data = [];
          this.patientDataSource.data = [];
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching body list:', error);
        Swal.fire('Error', 'Failed to fetch body list', 'error');
      },
    });
  }

  private formatPatient(patien: any): Patient {
    return {
      matibabu_card: patien?.matibabu_card,
      name: patien?.name || 'N/A',
      phone: patien?.phone || 'N/A',
      gender: patien?.gender || 'N/A',
      location: patien.geographical_location?.label || 'N/A',
       files: patien?.files || [] // you can map location name if needed
    };
  }

  addPatient(patientFileId: number) {
  const dialogData: AddPatientDialogData = { patientFileId, referralOptions: [] };

  const dialogRef = this.dialog.open(AddpartientComponent, {
    width: '1000px',
    data: dialogData,
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      // Optional: if API returns the updated body list with patients, use it
      this.refreshPatients(patientFileId);
    }
  });
}

// Refresh the patients from API
private refreshPatients(patientFileId: number) {
  this.loading = true;
  this.userService.getBodyListById(patientFileId).subscribe({
    next: (response: any) => {
      this.loading = false;
      if (response?.data?.patients) {
        this.patientDataSource.data = response.data.patients.map((p: any) => this.formatPatient(p));
      }
    },
    error: (error) => {
      this.loading = false;
      console.error('Error refreshing patients:', error);
      Swal.fire('Error', 'Failed to refresh patients', 'error');
    }
  });
}


  // addPatient(patientFileId: number) {
  //   const dialogData: AddPatientDialogData = { patientFileId, referralOptions: [] };
  //   this.dialog.open(AddpartientComponent, { width: '600px', data: dialogData });
  // }

  extractFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }

  viewPDF(element: any) {
    if (element?.patient_list_file) {
      const url = this.documentUrl + element.patient_list_file;
      window.open(url, '_blank');
    }
  }
}
