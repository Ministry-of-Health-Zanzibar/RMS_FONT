import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import {
  AddPatientDialogData,
  AddpartientComponent,
} from '../addpartient/addpartient.component';
import { environment } from '../../../../environments/environment.prod';
import { AddmedicalhistoryComponent } from '../addmedicalhistory/addmedicalhistory.component';
import { PartientFormComponent } from '../partient-form/partient-form.component';
import { AddmultiplepatientComponent, AddMultiplePatientDialogData } from '../addmultiplepatient/addmultiplepatient.component';
import { AddmedicalformComponent } from '../addmedicalform/addmedicalform.component';

interface BodyList {
  patient_list_id: number;
  patient_list_title: string;
  patient_list_file?: string;
  boards_type?: string;
  no_of_patients?: number;
}

interface Patient {
  patient_id: number; // include patient_id
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
  latest_history?: {
    patient_histories_id: number;
    referring_doctor?: string;
    file_number?: string;
    referring_date?: string | null;
    reason_id?: number;
    history_of_presenting_illness?: string;
    physical_findings?: string;
    investigations?: string;
    management_done?: string;
    board_comments?: string | null;
    history_file?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    status?: string;
    mkurugenzi_tiba_comments?: string | null;
    dg_comments?: string | null;
    mkurugenzi_tiba_id?: number | null;
    dg_id?: number | null;
    board_reason_id?: number | null;
    diagnoses?: {
      diagnosis_id: number;
      uuid?: string;
      diagnosis_code?: string;
      diagnosis_name?: string;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string | null;
    }[];
    reason?: {
      reason_id: number;
      referral_reason_name?: string;
      reason_descriptions?: string;
      created_by?: number;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string | null;
    };
    patient?: {
      patient_id: number;
      name?: string;
      matibabu_card?: string;
      date_of_birth?: string;
      gender?: string;
      phone?: string;
      location_id?: string;
      job?: string | null;
      position?: string | null;
      created_by?: number;
      created_at?: string;
      updated_at?: string;
      deleted_at?: string | null;
      zan_id?: string;
    };
  };
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
   public patient_histories_id: number | null = null;

  displayedBodyListColumns: string[] = [
    'patient_list_title',
    'patient_list_file',
    'boards_type',
    'no_of_patients',
    'actions',
  ];
  bodyListDataSource: MatTableDataSource<BodyList> =
    new MatTableDataSource<BodyList>();

  displayedPatientColumns: string[] = [
    'matibabu_card',
    'name',
    'gender',
    'phone',
    'location',
    'latest_history',
    'files',
  ];
  patientDataSource: MatTableDataSource<Patient> =
    new MatTableDataSource<Patient>();

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

      console.log("FULL RESPONSE:", response); // ⬅️ see everything

      if (response && response.data) {
        const bodyData = response.data;

        // store status code
        console.log("Status code:", response.statusCode);

        this.bodyList = [bodyData];
        this.bodyListDataSource.data = this.bodyList;

        this.patient_list_id = bodyData.patient_list_id;

        // Load patients
        if (bodyData.patients && Array.isArray(bodyData.patients)) {
          this.patientDataSource.data = bodyData.patients.map((p: any) =>
            this.formatPatient(p)
          );
        } else {
          this.patientDataSource.data = [];
        }
      }
    },
    error: (error) => {
      this.loading = false;
      console.error("Error fetching body list:", error);
      Swal.fire("Error", "Failed to fetch body list", "error");
    },
  });
}


 private formatPatient(patien: any): Patient {
  return {
    matibabu_card: patien?.matibabu_card,
    name: patien?.name || 'N/A',
    phone: patien?.phone || 'N/A',
    gender: patien?.gender || 'N/A',
    location: patien?.geographical_location?.label || 'N/A',
    files: patien?.files || [],

    // 🔥 IMPORTANT: Add latest_history
    latest_history: patien?.latest_history || null,

    // 🔥 Also include patient_id so dialog can use it
    patient_id: patien?.patient_id,
  };
}


  addPatient(patientFileId: number) {
    const dialogData: AddPatientDialogData = {
      patientFileId,
      referralOptions: [],
    };

    const dialogRef = this.dialog.open(AddpartientComponent, {
      // width: '1000px',
      width: '750px',
      maxWidth: '95vw',
      height: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshPatients(patientFileId);
      }
    });
  }


  addMultiple(patientFileId: number) {
    const dialogData: AddMultiplePatientDialogData = {
      patientFileId,
      referralOptions: [],
    };

    const dialogRef = this.dialog.open(AddmultiplepatientComponent, {
      // width: '1000px',
      width: '750px',
      maxWidth: '95vw',
      height: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
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
          this.patientDataSource.data = response.data.patients.map((p: any) =>
            this.formatPatient(p)
          );
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error refreshing patients:', error);
        Swal.fire('Error', 'Failed to refresh patients', 'error');
      },
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

// openAddMedicalHistory(patient: any) {
//   const config = new MatDialogConfig();
//   config.disableClose = false;
//   config.role = 'dialog';
//   config.maxWidth = '100vw';
//   config.maxHeight = '98vh';
//   config.panelClass = 'full-screen-modal';

//   // Safely extract latest history ID
//   const patientHistoryId = patient?.latest_history?.patient_histories_id || null;

//   console.log('➡️ Patient sent to dialog:', patient);
//   console.log('➡️ History ID sent to dialog:', patientHistoryId);

//   // Send both patient object and history ID
//   config.data = {
//     patient,
//     patientHistoryId
//   };

//   const dialogRef = this.dialog.open(AddmedicalformComponent, config);

//   dialogRef.afterClosed().subscribe((result) => {
//     if (result && result.success) {
//       console.log('✅ New medical history saved:', result.data);
//       Swal.fire({
//         title: 'Medical History Added',
//         text: 'The patient medical history was saved successfully!',
//         icon: 'success',
//         confirmButtonColor: '#4690eb',
//       });
//     } else {
//       console.log('Dialog closed without saving.');
//     }
//   });
// }




  //  openAddMedicalHistory(patient: any) {
  //     const config = new MatDialogConfig();
  //     console.log('Element sent to dialog:', patient);
  //     config.data = patient;
  //     config.width = '100vw';
  //     config.height = '98vh';

  //     this.dialog
  //       .open(AddmedicalhistoryComponent, config)
  //       .afterClosed()

  //   }

  openAddMedicalHistory(patient: any) {
  const config = new MatDialogConfig();
  config.disableClose = false;
  config.role = 'dialog';
  config.maxWidth = '100vw';
  config.maxHeight = '98vh';
  config.panelClass = 'full-screen-modal';

  const patientHistoryId = patient?.latest_history?.patient_histories_id || null;

  // Send both patient object and history ID
  config.data = {
    patient,
    patientHistoryId
  };

  const dialogRef = this.dialog.open(AddmedicalformComponent, config);

  // No success alert or console logs here
  dialogRef.afterClosed().subscribe((result) => {
    // You can handle refreshing data if needed without showing messages
    if (result && result.success) {
      this.refreshPatients(this.patient_list_id!); // optional: refresh patient table
    }
  });
}

}
