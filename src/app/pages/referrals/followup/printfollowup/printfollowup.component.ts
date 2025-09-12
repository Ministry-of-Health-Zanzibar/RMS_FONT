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
  styleUrl: './printfollowup.component.scss'
})
export class PrintfollowupComponent implements OnInit {
  referralID: string | null = null;
  referral: any = null;

  constructor(
    private printService: FollowsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  email = 'info@mohz.go.tz'
  dg = 'dg@mohz.go.tz'

  ngOnInit(): void {
  console.log("Injected dialog data:", this.data);
  this.referral = this.data;
  }

  getReferralData(): void {
    this.printService.getFollowListById(this.referralID!).subscribe(
      (response: any) => {
        this.referral = response.data ? response.data : response;
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
      window.location.reload(); // Optional: to restore Angular functionality
    }
  }

}
