import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PartientService } from '../../../services/partient/partient.service';
import { environment } from '../../../../environments/environment.prod';
import { AddmedicalhistoryComponent } from '../addmedicalhistory/addmedicalhistory.component';

@Component({
  selector: 'app-viewpatientfromhospitalbyid',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './viewpatientfromhospitalbyid.component.html',
  styleUrl: './viewpatientfromhospitalbyid.component.scss'
})
export class ViewpatientfromhospitalbyidComponent implements OnInit {
  public documentUrl = environment.fileUrl;
  public loading = false;
  medicalHistory: any = null;

  constructor(
    private route: ActivatedRoute,
    private patientService: PartientService,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe((params) => {
  const id = params.get('id');
  console.log('Route ID:', id);
  if (id) {
    this.fetchPatientHistory(+id);
  }
});

  }

  private fetchPatientHistory(id: number) {
    this.loading = true;
    this.patientService.getPartientById(id).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response?.data) {
          this.medicalHistory = response.data;
        } else {
          Swal.fire('Error', 'No medical history found', 'error');
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error fetching history:', error);
        Swal.fire('Error', 'Failed to fetch patient history', 'error');
      },
    });
  }

  viewPDF(filePath: string) {
    if (filePath) {
      const url = this.documentUrl + filePath;
      window.open(url, '_blank');
    }
  }

forwardStatus() {
  if (!this.medicalHistory) {
    Swal.fire('Error', 'Patient record not loaded yet.', 'error');
    return;
  }

  const id =
    this.medicalHistory.patient_histories_id ||
    this.medicalHistory.id ||
    this.medicalHistory.medical_id ||
    this.medicalHistory.patient_id;

  if (!id) {
    Swal.fire('Error', 'Record ID not found. Please reload the page.', 'error');
    return;
  }

  if (this.medicalHistory.status !== 'pending') {
    Swal.fire(
      'Info',
      `Status is already "${this.medicalHistory.status}".`,
      'info'
    );
    return;
  }

  this.loading = true;
  const payload = { status: 'reviewed' };

  this.patientService.updateStatus(id, payload).subscribe({
    next: (res: any) => {
      this.loading = false;

      // ✅ FIXED: Check "success"
      if (res.success === true) {
        Swal.fire({
          title: 'Forwarded Successfully',
          text: res.message || 'Status updated.',
          icon: 'success',
          confirmButtonColor: '#4690eb',
        });

        this.fetchPatientHistory(id); // refresh
      } else {
        Swal.fire({
          title: 'Error',
          text: res.message || 'Failed to update record.',
          icon: 'error',
          confirmButtonColor: '#4690eb',
        });
      }
    },
    error: (err) => {
      this.loading = false;
      console.error('Error forwarding status:', err);
      Swal.fire(
        'Error',
        err.error?.message || 'Something went wrong.',
        'error'
      );
    },
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
