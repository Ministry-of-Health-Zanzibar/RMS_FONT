import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { ReferralService } from '../../../services/Referral/referral.service';
import { ReferralStatusDialogComponent } from '../referral-status-dialog/referral-status-dialog.component';
import Swal from 'sweetalert2';

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
  ],
  templateUrl: './referral-details.component.html',
  styleUrl: './referral-details.component.scss',
})
export class ReferralDetailsComponent {
  public displayRoleForm!: FormGroup;
  referralID: string | null = null;
  referral: any = null;
  insurance: any = null;
  userRole: string | null;

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
        this.referral.status = result.status;
      }
    });
  }
}
