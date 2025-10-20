import { GraphreportService } from './../../../services/accountants/graphreport.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { StatisticalService } from '../../../services/report/statistical.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
} from 'ng-apexcharts';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    NgApexchartsModule,
  ],
  templateUrl: './finance.component.html',
  styleUrl: './finance.component.scss',
})
export class FinanceComponent implements OnInit {
  referral: any = {};

  totalMaleComplain: any;

  constructor(
    private dashboardService: StatisticalService,
    private reportService: GraphreportService
  ) {}

  ngOnInit(): void {
    // this.getSourceSummaryReport();
    // this.getDocumentTypeSummaryReport();
    this.getReferralSummary();
    this.getReferralSummaryByReason();
    this.fetchData();
  }
  fetchData(): void {
    this.reportService.getCount().subscribe(
      (response) => {
        this.referral = response;
        console.log('Data fetched successfully:', this.referral);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  getReferralSummary(): void {
    this.reportService.getReportreferralByHospital().subscribe(
      (data) => {
        if (!data) {
          console.error('No referral data found');
          return;
        }
        const hospitalMap: { [key: string]: string } = {

          totalReferralsByMuhimbiliOrthopaedicInstitute:
            'Muhimbili Orthopaedic Institute',
          totalReferralsByJakayaKikweteCardiacInstitute:
            'Jakaya Kikwete Cardiac Institute',
          totalReferralsByMuhimbiliNationalHospital:
            'Muhimbili National Hospital',
          totalReferralsByOceanRoadCancerInstitute:
            'Ocean Road Cancer Institute',
          totalReferralsByKilimanjaroChristianMedicalCentre:
            'Kilimanjaro Christian Medical Centre',

        };
        this.pieLabels = Object.keys(hospitalMap);
        this.pieLabels = this.pieLabels.map((key) => hospitalMap[key]);

        this.pieSeries = Object.keys(hospitalMap).map((key) => data[key] || 0);
      },
      (error) => {
        console.error('Error fetching referral summary', error);
      }
    );
  }

  pieSeries: ApexNonAxisChartSeries = [];
  pieLabels: string[] = [];

  pieChart: ApexChart = {
    type: 'pie',
    height: 350,
    width: 600,
  };

  pieTitle: ApexTitleSubtitle = { text: 'Referrals by Hospitals' };
  pieLegend: ApexLegend = { position: 'right' };

  pieResponsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: 'bottom' },
      },
    },
  ];

  reasonSeries: ApexNonAxisChartSeries = [];
  reasonLabels: string[] = [];
  reasonChart: ApexChart = { type: 'pie', height: 350 };
  reasonTitle: ApexTitleSubtitle = { text: 'Referrals by Gender' };
  reasonLegend: ApexLegend = { position: 'right' };
  reasonResponsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: {
        chart: { width: 300 },
        legend: { position: 'bottom' },
      },
    },
  ];

  getReferralSummaryByReason(): void {
    this.reportService.getReportreferralreferralsByReason().subscribe(
      (data) => {
        if (!data) {
          console.error('No referral data found');
          return;
        }

        const reasonMap: { [key: string]: string } = {
          Male: 'Male',
          Female: 'Female',

        };

        this.reasonLabels = Object.keys(reasonMap).map((key) => reasonMap[key]);
        this.reasonSeries = Object.keys(reasonMap).map((key) => data[key] || 0);
      },
      (error) => {
        console.error('Error fetching referral summary by reason', error);
      }
    );
  }

  // public getSourceSummaryReport(): void {
  //   this.dashboardService.getTypeCount().subscribe((data) => {
  //     if (!data.sourceSummary) {
  //       console.error('No sourceSummary data found');
  //       return;
  //     }

  //     const labels = data.sourceSummary.map((item: any) => item.source_name);
  //     const totals = data.sourceSummary.map((item: any) => item.total);

  //     this.renderChart(
  //       'sourcePieChart',
  //       labels,
  //       totals,
  //       'pie',
  //       'Documents by Source'
  //     );
  //   });
  // }

  // public getDocumentTypeSummaryReport(): void {
  //   this.reportService.getDocumentTypeReport().subscribe((data) => {
  //     if (!data.documentTypeSummary) {
  //       console.error('No documentTypeSummary data found');
  //       return;
  //     }

  //     const labels = data.documentTypeSummary.map(
  //       (item: any) => item.document_type_name
  //     );
  //     const totals = data.documentTypeSummary.map((item: any) => item.total);

  //     this.renderChart(
  //       'documentTypeChart',
  //       labels,
  //       totals,
  //       'pie',
  //       'Documents by Type'
  //     );
  //   });
  // }

  // With Months
  renderChart(
    canvasId: string,
    labels: string[],
    complailData: number[],
    chartType: any,
    chartName: string
  ): void {
    new Chart(canvasId, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [
          {
            label: chartName,
            data: complailData,
            // backgroundColor: 'rgba(75, 192, 192, 0.2)',
           backgroundColor: [
                  'rgba(255, 182, 193, 0.5)',
                  'rgba(255, 200, 120, 0.5)',
                  'rgba(255, 236, 153, 0.5)',
                  'rgba(144, 238, 144, 0.5)',
                  'rgba(173, 216, 230, 0.5)',
                  'rgba(221, 160, 221, 0.5)',
                  'rgba(224, 224, 224, 0.5)',
                ],

            // borderColor: 'rgba(75, 192, 192, 1)',
          borderColor: [
              'rgb(255, 182, 193)', // Light Pink
              'rgb(255, 200, 120)', // Light Orange
              'rgb(255, 236, 153)', // Soft Yellow
              'rgb(144, 238, 144)', // Light Green
              'rgb(173, 216, 230)', // Light Blue
              'rgb(221, 160, 221)', // Light Purple
              'rgb(224, 224, 224)', // Soft Gray
            ],

            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  createChart(canvasId: string, data: any[], label: string) {
    new Chart(canvasId, {
      type: 'line',
      data: {
        labels: data.map((d) => d.day || d.month || d.year || d.status),
        datasets: [
          {
            label: label,
            data: data.map((d) => d.total),
             backgroundColor: [
                  'rgba(255, 182, 193, 0.5)',
                  'rgba(255, 200, 120, 0.5)',
                  'rgba(255, 236, 153, 0.5)',
                  'rgba(144, 238, 144, 0.5)',
                  'rgba(173, 216, 230, 0.5)',
                  'rgba(221, 160, 221, 0.5)',
                  'rgba(224, 224, 224, 0.5)',
                ],
             borderColor: [
              'rgb(255, 182, 193)', // Light Pink
              'rgb(255, 200, 120)', // Light Orange
              'rgb(255, 236, 153)', // Soft Yellow
              'rgb(144, 238, 144)', // Light Green
              'rgb(173, 216, 230)', // Light Blue
              'rgb(221, 160, 221)', // Light Purple
              'rgb(224, 224, 224)', // Soft Gray
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }
}
