import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';
import { FollowsService } from '../../../../services/Referral/follows.service';
import { ReferralService } from '../../../../services/Referral/referral.service';

@Component({
  selector: 'app-printfollowup',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './printfollowup.component.html',
  styleUrls: ['./printfollowup.component.scss']
})
export class PrintfollowupComponent implements OnInit {
  referralID: string | null = null;
  referral: any = null;

  email = 'info@mohz.go.tz';
  dg = 'dg@mohz.go.tz';

  constructor(
    private printService: FollowsService,
    private referralsService: ReferralService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log('Injected dialog data:', this.data);

    // ✅ Get the referral ID from dialog data
    this.referralID = this.data?.referral_id || this.data?.id || null;

    if (this.referralID) {
      this.getReferralData();
    } else {
      console.warn('No referral ID provided in dialog data');
      this.referral = this.data; // fallback
    }
  }

  getReferralData(): void {
    this.referralsService.getReferralById(this.referralID!).subscribe(
      (response: any) => {
        console.log('Full API response:', response);

        // ✅ Adjust this depending on your API structure
        this.referral =
          response.data?.referral ||
          response.data ||
          response;

        console.log('Referral hospital:', this.referral?.hospital);
      },
      error => {
        console.error('Failed to load referral data:', error);
        Swal.fire('Error', 'Unable to fetch referral data', 'error');
      }
    );
  }

  print(): void {
    const printContents = document.getElementById('print-section')?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // Optional: restores Angular after print
    }
  }
}
