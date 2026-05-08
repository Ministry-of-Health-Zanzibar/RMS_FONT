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
import { ConversationModalComponent } from '../conversation-modal/conversation-modal.component';

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
  diagnoses: any[] = [];
  userRole: string | null;
  public documentUrl = environment.fileUrl;
  history = this.referral?.patient?.patient_histories?.[0];
  hospitalDiagnoses = this.history?.diagnoses || [];
  boardDiagnoses = this.history?.board_diagnoses || [];
  hospitalReason = this.history?.reason;
  boardReason = this.history?.board_reason;
  boardMembers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    public referralsService: ReferralService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.referralID = this.route.snapshot.paramMap.get('id');
    if (this.referralID) {
      this.getMoreData();
    }
  }

  public getMoreData() {
    if (!this.referralID) return;

    this.referralsService.getReferralById(this.referralID).subscribe(
      (response) => {
        this.referral = response.data;

        // Patient histories
        this.patientHistories = response.data.patient?.patient_histories || [];

        // Take FIRST history (as per your scenario)
        this.history = this.patientHistories.length
          ? this.patientHistories[0]
          : null;

        // ✅ Hospital diagnoses (Doctor)
        this.hospitalDiagnoses = this.history?.diagnoses || [];

        // ✅ Board diagnoses (Medical Board)
        this.boardDiagnoses = this.history?.board_diagnoses || [];

        // ✅ Reasons
        this.hospitalReason = this.history?.reason || null;
        this.boardReason = this.history?.board_reason || null;

        this.boardMembers =
          response.data.patient?.patient_list?.[0]?.board_members || [];
      },
      (error) => {
        console.error('Failed to load patient data', error);
      }
    );
  }

  // updateStatusPopup() {
  //   const dialogRef = this.dialog.open(ReferralStatusDialogComponent, {
  //     width: '700px',
  //     data: { data: this.referral },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.getMoreData();
  //     }
  //   });
  // }
  updateStatusPopup() {
    // ✅ Try to get from referral (normal case)
    let historyId =
      this.referral?.patient?.patient_histories?.[0]?.patient_histories_id;
  
    // ✅ Fallback (recommendation-only case)
    if (!historyId && this.patientHistories?.length) {
      historyId = this.patientHistories[0]?.patient_histories_id;
    }
  
    // 🚨 If still missing → stop early (avoid backend error)
    if (!historyId) {
      console.warn('No patient_histories_id found');
      return;
    }
  
    const dialogRef = this.dialog.open(ReferralStatusDialogComponent, {
      width: '700px',
      data: {
        referral: this.referral, // may be null
        patient_histories_id: historyId, // ✅ ALWAYS PASS THIS
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMoreData();
      }
    });
  }

  isPrintDisabled(referral: any): boolean {
    const blockedStatuses = [
      'Pending',
      'Cancelled',
      'Closed'
    ];
  
    // ❗ BoardedOut is ALLOWED for printing
    return blockedStatuses.includes(referral?.status);
  }

  referralsLetterPopup(data: any): void {
    const dialogRef = this.dialog.open(ReferralsLetterComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: data,
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  viewPatientListPDF(filePath: string) {
    if (!filePath) {
      console.error('No file path provided');
      return;
    }

    const url = this.documentUrl + filePath;
    window.open(url, '_blank');
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

  openConversationModal(referral: any) {
    const patientHistoryId = referral.patient.patient_histories[0].patient_histories_id;

    this.dialog.open(ConversationModalComponent, {
      width: '700px',
      data: { patientHistoryId }
    });
  }
}