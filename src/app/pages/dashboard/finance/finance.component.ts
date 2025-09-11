import { GraphreportService } from './../../../services/accountants/graphreport.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TotalSubscribersWidgetComponent } from '@shared/widgets/total-subscribers-widget/total-subscribers-widget.component';
import { AvgOpenRateWidgetComponent } from '@shared/widgets/avg-open-rate-widget/avg-open-rate-widget.component';
import { AvgClickRateWidgetComponent } from '@shared/widgets/avg-click-rate-widget/avg-click-rate-widget.component';
import { UniqueVisitorsWidgetComponent } from '@shared/widgets/unique-visitors-widget/unique-visitors-widget.component';
import { ExchangeWidgetComponent } from '../../../@shared/widgets/exchange-widget/exchange-widget.component';
import { MyInvestmentsComponent } from '../../../@shared/widgets/my-investments/my-investments.component';
import { PaymentInformationWidgetComponent } from '../../../@shared/widgets/payment-information-widget/payment-information-widget.component';
import { PurchasesByChannelsWidgetComponent } from '../../../@shared/widgets/purchases-by-channels-widget/purchases-by-channels-widget.component';
import { SiteVisitorsWidgetComponent } from '../../../@shared/widgets/site-visitors-widget/site-visitors-widget.component';
import { EventsWidgetComponent } from '@shared/widgets/events-widget/events-widget.component';
import { TeamWidgetComponent } from '@shared/widgets/team-widget/team-widget.component';
import { TasksInProgressWidgetComponent } from '@shared/widgets/tasks-in-progress-widget/tasks-in-progress-widget.component';
import { CustomerSatisfactionWidgetComponent } from '@shared/widgets/customer-satisfaction-widget/customer-satisfaction-widget.component';
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
  complain: any = {};
  totalMaleComplain: any;

  constructor(
    private dashboardService: StatisticalService,
    private reportService: GraphreportService
  ) {}

  ngOnInit(): void {
    this.getSourceSummaryReport();
    this.getDocumentTypeSummaryReport();
    this.getReferralSummary();
    this.getReferralSummaryByReason();
  }

  getReferralSummary(): void {
    this.reportService.getReportreferralByHospital().subscribe(
      (data) => {
        if (!data) {
          console.error('No referral data found');
          return;
        }
        const hospitalMap: { [key: string]: string } = {
          totalReferralsByLumumba: 'Lumumba',
          totalReferralsByMuhimbiliOrthopaedicInstitute:
            'Muhimbili Orthopaedic Institute',
          totalReferralsByJakayaKikweteCardiacInstitute:
            'Jakaya Kikwete Cardiac Institute',
          totalReferralsBySIMS: 'SIMS',
          totalReferralsByMuhimbiliNationalHospital:
            'Muhimbili National Hospital',
          totalReferralsByOceanRoadCancerInstitute:
            'Ocean Road Cancer Institute',
          totalReferralsByKilimanjaroChristianMedicalCentre:
            'Kilimanjaro Christian Medical Centre',
          totalReferralsByMadrasInstituteOfOrthopaedicsAndTraumatology:
            'Madras Institute Of Orthopaedics And Traumatology',
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
    width: 700,
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
  reasonTitle: ApexTitleSubtitle = { text: 'Referrals by Reason' };
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
          totalReferralsByKufanyiwaUchunguzi: 'Kufanyiwa Uchunguzi',
          totalReferralsByKupatiwaMatibabu: 'Kupatiwa Matibabu',
          totalReferralsByUchunguziNaMatibabuZaidi:
            'Uchunguzi Na Matibabu Zaidi',
          totalReferralsByUchunguziNaMatibabu: 'Uchunguzi Na Matibabu',
          totalReferralsByParsPlanaVitrotomy: 'Pars Plana Vitrotomy',
        };

        this.reasonLabels = Object.keys(reasonMap).map((key) => reasonMap[key]);
        this.reasonSeries = Object.keys(reasonMap).map((key) => data[key] || 0);
      },
      (error) => {
        console.error('Error fetching referral summary by reason', error);
      }
    );
  }

  public getSourceSummaryReport(): void {
    this.dashboardService.getTypeCount().subscribe((data) => {
      if (!data.sourceSummary) {
        console.error('No sourceSummary data found');
        return;
      }

      const labels = data.sourceSummary.map((item: any) => item.source_name);
      const totals = data.sourceSummary.map((item: any) => item.total);

      this.renderChart(
        'sourcePieChart',
        labels,
        totals,
        'pie',
        'Documents by Source'
      );
    });
  }

  public getDocumentTypeSummaryReport(): void {
    this.reportService.getDocumentTypeReport().subscribe((data) => {
      if (!data.documentTypeSummary) {
        console.error('No documentTypeSummary data found');
        return;
      }

      const labels = data.documentTypeSummary.map(
        (item: any) => item.document_type_name
      );
      const totals = data.documentTypeSummary.map((item: any) => item.total);

      this.renderChart(
        'documentTypeChart',
        labels,
        totals,
        'pie',
        'Documents by Type'
      );
    });
  }

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
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            // borderColor: 'rgba(75, 192, 192, 1)',
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
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
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
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
