import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { ActivatedRoute, Router } from '@angular/router';
import { PartientService } from '../../../services/partient/partient.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AddmedicalhistoryComponent } from '../addmedicalhistory/addmedicalhistory.component';

// Angular Material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-history-table',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatPaginator,
  ],
  templateUrl: './patient-history-table.component.html',
  styleUrl: './patient-history-table.component.scss',
})
export class PatientHistoryTableComponent implements OnInit {
  public documentUrl = environment.fileUrl;
  public loading = false;

  dataSource = new MatTableDataSource<any>([]);
  patient: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private patientService: PartientService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.fetchPatientHistory(+id);
      } else {
        Swal.fire('Error', 'No patient history ID provided', 'error');
      }
    });
  }

 private fetchPatientHistory(id: number) {
  this.loading = true;

  this.patientService.getPartientHistoryListById(id).subscribe({
    next: (response: any) => {
      this.loading = false;

      if (response.statusCode === 200 || response.statusCode === 201) {
        this.patient = response.data.patient;

        const history = this.patient.patient_histories || [];

        this.dataSource = new MatTableDataSource(history);
        this.dataSource.paginator = this.paginator;
      }
    },
    error: () => {
      this.loading = false;
      Swal.fire('Error', 'Failed to fetch patient history', 'error');
    }
  });
}



  // private fetchPatientHistory(id: number) {
  //   this.loading = true;
  //   this.patientService.getPartientHistoryListById(id).subscribe({
  //     next: (response: any) => {
  //       this.loading = false;
  //       if (response?.statusCode === 200 || response?.statusCode === 201) {
  //         this.patient = response.data.patient;
  //         const history = this.patient?.patient_histories || [];
  //         this.dataSource = new MatTableDataSource(history);
  //         this.dataSource.paginator = this.paginator;
  //       } else {
  //         Swal.fire('Error', 'No medical history found', 'error');
  //       }
  //     },
  //     error: (error) => {
  //       this.loading = false;
  //       console.error('Error fetching history:', error);
  //       Swal.fire('Error', 'Failed to fetch patient history', 'error');
  //     },
  //   });
  // }

  viewPDF(filePath: string) {
    if (filePath) {
      const url = this.documentUrl + filePath;
      window.open(url, '_blank');
    }
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
        icon: 'success'
      });

      // 🔥 Reload updated history without refreshing whole page
      this.fetchPatientHistory(patient.patient_id);
    }
  });
}


  displayMoreData(data: any) {
    const id = data.patient_histories_id;
    this.router.navigate(['/pages/patient/patient', id]);
  }
}
