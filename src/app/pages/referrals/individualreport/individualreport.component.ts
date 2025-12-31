import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReferralService } from '../../../services/Referral/referral.service';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-individualreport',
  standalone: true,
  imports: [
    CommonModule,          // ✅ REQUIRED for *ngIf, *ngFor
    MatProgressBarModule,  // mat-progress-bar
    MatCardModule,
    MatIcon
  ],
  templateUrl: './individualreport.component.html',
  styleUrl: './individualreport.component.scss'
})
export class IndividualreportComponent implements OnInit {

  referral: any;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private referralService: ReferralService
  ) {}

  ngOnInit(): void {
    const referralId = this.route.snapshot.paramMap.get('id');
    console.log("naipata hapa    ....",referralId)
    this.getReferralDetails(referralId);
  }

  getReferralDetails(id: any) {
    this.referralService.getReportById(id).subscribe({
      next: (res: any) => {
        this.referral = res.data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

 printReport() {
  window.print();
}

downloadReport() {
  const element = document.getElementById('print-area');

  if (!element) {
    return;
  }

 const options = {
  margin: 0.5,
  filename: `Referral_Report_${this.referral?.referral_number}.pdf`,
  image: {
    type: 'jpeg',
    quality: 0.98
  },
  html2canvas: {
    scale: 2,
    useCORS: true
  },
  jsPDF: {
    unit: 'in',
    format: 'a4',
    orientation: 'portrait'
  }
} as const;

html2pdf().from(element).set(options).save();

}

}