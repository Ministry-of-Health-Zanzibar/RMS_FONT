import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';

import { environment } from '../../../../environments/environment.prod';
import { PartientService } from '../../../services/partient/partient.service';
import {
  AddpartientComponent,
  AddPatientDialogData,
} from '../addpartient/addpartient.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddmedicalhistoryComponent } from '../addmedicalhistory/addmedicalhistory.component';
import { ActivatedRoute } from '@angular/router';

interface PatientFile {
  file_id: number;
  file_name: string;
  file_path: string;
  file_type: string;
}

interface Patient {
  patient_id: number;
  matibabu_card: string | null;
  name: string;
  gender: string;
  phone: string;
  location: string;
  date_of_birth?: string;
  job?: string;
  position?: string;
  zan_id?: string;
  patient_list?: any;
  files?: PatientFile[];
}

interface PatientHistory {
  date: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
}

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
  ],
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss'],
})
export class PatientDetailsComponent implements OnInit, AfterViewInit {
  public documentUrl = environment.fileUrl;
  public loading = false;

  displayedPatientColumns: string[] = [
    'matibabu_card',
    'name',
    'gender',
    'phone',
    'location',
    'files',
  ];
  patientDataSource = new MatTableDataSource<Patient>();

  displayedHistoryColumns: string[] = [
    'date',
    'diagnosis',
    'treatment',
    'doctor',
  ];
  patientHistoryDataSource = new MatTableDataSource<PatientHistory>();

  public patient: Patient | null = null;

  @ViewChild('patientPaginator') patientPaginator!: MatPaginator;
  @ViewChild('patientSort') patientSort!: MatSort;

  constructor(
    private patientService: PartientService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchPatientById(+id); 
      } else {
        Swal.fire('Error', 'No patient ID provided in route', 'error');
      }
    });
  }

  ngAfterViewInit(): void {
    this.patientDataSource.paginator = this.patientPaginator;
    this.patientDataSource.sort = this.patientSort;
  }

  applyPatientFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.patientDataSource.filter = filterValue.trim().toLowerCase();
  }

  private fetchPatientById(id: number) {
    this.loading = true;
    this.patientService.getPartientById(id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.data?.length) {
          const p = response.data[0];
          this.patient = this.formatPatient(p);
          this.patientDataSource.data = [this.patient];
        } else {
          this.patient = null;
          this.patientDataSource.data = [];
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching patient:', error);
        Swal.fire('Error', 'Failed to fetch patient', 'error');
      },
    });
  }

  private formatPatient(p: any): Patient {
    return {
      patient_id: p.patient_id,
      matibabu_card: p.matibabu_card,
      name: p.name || 'N/A',
      gender: p.gender || 'N/A',
      phone: p.phone || 'N/A',
      location: p.geographical_location?.label || 'N/A',
      date_of_birth: p.date_of_birth,
      job: p.job,
      position: p.position,
      zan_id: p.zan_id,
      patient_list: p.patient_list,
      files: p.files || [],
    };
  }

  viewPDF(file: PatientFile) {
    if (file?.file_path) {
      const url = this.documentUrl + file.file_path;
      window.open(url, '_blank');
    }
  }

  addPatient(patientFileId: number) {
    const dialogData: AddPatientDialogData = {
      patientFileId,
      referralOptions: [],
    };

    const dialogRef = this.dialog.open(AddpartientComponent, {
      width: '750px',
      maxWidth: '95vw',
      height: '900px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  openAddMedicalHistory(patient: any) {
    const config = new MatDialogConfig();
    config.disableClose = false;
    config.role = 'dialog';
    config.maxWidth = '100vw';
    config.maxHeight = '98vh';
    config.panelClass = 'full-screen-modal';
    config.data = patient;

    const dialogRef = this.dialog.open(AddmedicalhistoryComponent, config);
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        Swal.fire({
          title: 'Medical History Added',
          text: 'The patient medical history was saved successfully!',
          icon: 'success',
          confirmButtonColor: '#4690eb',
        });
      }
    });
  }
}
