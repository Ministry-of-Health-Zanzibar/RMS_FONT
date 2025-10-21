import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferralService } from '../../../services/Referral/referral.service';
import { ReferralStatusDialogComponent } from '../referral-status-dialog/referral-status-dialog.component';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { ReferralsLetterComponent } from '../referrals-letter/referrals-letter.component';
import { environment } from '../../../../environments/environment.prod';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-referral-details',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIcon,
    MatDialogModule,
    MatCardModule,
     MatExpansionModule,
    MatIconModule,
    MatTooltipModule,

  ],
  templateUrl: './referral-details.component.html',
  styleUrl: './referral-details.component.scss',
})
export class ReferralDetailsComponent {
  public displayRoleForm!: FormGroup;
  referralID: string | null = null;
  referral: any = null;
  patientHistories:any = null;
  insurance: any = null;
  userRole: string | null;
  public documentUrl = environment.fileUrl;

  constructor(
    private route: ActivatedRoute,
    public referralsService: ReferralService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.referralID = this.route.snapshot.paramMap.get('id');
    console.log('inafika value', this.referralID);
    if (this.referralID) {
      this.getMoreData();
    }
  }

  //   getMoreData() {

  //   this.referralsService.getReferralById(this.referralID)
  //     .subscribe(response => {

  //       const responseData = (response as any).data;
  //       if (responseData && responseData.length > 0) {
  //        this.referral = responseData.data
  //       }
  //     }, error => {
  //       console.error('Error fetching complaint details:', error);
  //     });
  // }

  public getMoreData() {
    if (!this.referralID) return;

    this.referralsService.getReferralById(this.referralID).subscribe(
      (response) => {
        this.referral = response.data;
         // If you need direct access to patient or histories

    this.patientHistories = response.data.patient.patient_histories;
      },
      (error) => {
        console.error('Failed to load patient data', error);
      }
    );
  }

  updateStatusPopup() {
    const dialogRef = this.dialog.open(ReferralStatusDialogComponent, {
      width: '700px',
      data: { data: this.referral },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMoreData();
      }
    });
  }

  referralsLetterPopup(data: any): void {
    const dialogRef = this.dialog.open(ReferralsLetterComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  viewPatientListPDF(referral: any) {
  if (referral?.patient?.patient_list?.patient_list_file) {
    const url = this.documentUrl + referral.patient.patient_list.patient_list_file;
    window.open(url, '_blank');
  }
}

viewFile(file: any) {
  if (file?.file_path) {
    const url = this.documentUrl + file.file_path;
    window.open(url, '_blank');
  }
}

viewFiles(file: any) {
  if (file?.history_file) {
    const url = this.documentUrl + file.history_file;
    window.open(url, '_blank');
  }
}
}
