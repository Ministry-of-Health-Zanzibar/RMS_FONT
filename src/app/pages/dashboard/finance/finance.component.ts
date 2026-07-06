
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StatisticalService } from '../../../services/report/statistical.service';
import { GraphreportService } from './../../../services/accountants/graphreport.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexMarkers,
} from 'ng-apexcharts';

export type ApexChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
  stroke?: any;
  markers?: ApexMarkers;
  colors: string[];
};

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
  styleUrls: ['./finance.component.scss'],
})
export class FinanceComponent implements OnInit {
  referral: any = {};
  dashboardData: any = {};

  // =========================
  // OTHER DIAGNOSES POPUP
  // =========================
  showOthersModal = false;
  othersData: any[] = [];

  constructor(
    private dashboardService: StatisticalService,
    private reportService: GraphreportService,
  ) {}

  ngOnInit(): void {
    this.getReferralSummary();
    this.getReferralSummaryByReason();
    this.fetchReferralByMonth();
    this.fetchReferralTrends();
    this.fetchData();
    this.loadDashboardStatistics();
  }

  // =========================
  // OPEN / CLOSE MODAL
  // =========================
  openOthersDiagnoses(): void {
    this.reportService.getOtherDiagnosesList().subscribe(
      (res: any) => {
        this.othersData = res?.data || [];
        this.showOthersModal = true;
      },
      (err) => console.error('Error fetching other diagnoses:', err),
    );
  }

  closeModal(): void {
    this.showOthersModal = false;
  }

  loadDashboardStatistics() {
  this.dashboardService.getWorkFlowCount().subscribe({
    next: (response: any) => {
      this.dashboardData = response.data;
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  // =========================
  // REFERRAL TRENDS
  // =========================
  fetchReferralTrends(): void {
    this.reportService.getAnalyticalReferalTrend().subscribe(
      (response) => {
        if (!response?.data) return;

        const categories: string[] = response.dates || [];
        const dataObj = response.data;

        const series = Object.keys(dataObj).map((key) => ({
          name: key,
          data: categories.map((month: string) => {
            const entry = dataObj[key].find(
              (i: any) => i.date === month,
            );
            return entry ? entry.total : 0;
          }),
        }));

        this.lineChartOptions = {
          ...this.lineChartOptions,
          series,
          xaxis: {
            ...this.lineChartOptions.xaxis,
            categories: categories.map((m) => this.formatMonth(m)),
          },
        };
      },
      (error) => {
        console.error('Error fetching referral trend:', error);
      },
    );
  }

  private formatMonth(month: string): string {
    const [year, m] = month.split('-');

    const names = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec',
    ];

    return `${names[+m - 1]} ${year}`;
  }

  // =========================
  // DASHBOARD DATA
  // =========================
  fetchData(): void {
    this.reportService.getCount().subscribe(
      (response) => {
        this.referral = response;
      },
      (error) => console.error(error),
    );
  }

  fetchReferralByMonth(): void {
    this.reportService.getMonthRefferalByGender().subscribe(
      (response) => {
        const chartData = response?.data || [];
  
        const monthYearLabels = chartData.map((item: any) =>
          this.formatMonth(item.month)
        );
  
        const maleReferrals = chartData.map(
          (item: any) => item.male_referrals || 0
        );
  
        const femaleReferrals = chartData.map(
          (item: any) => item.female_referrals || 0
        );
  
        this.barChartOptions = {
          ...this.barChartOptions,
          series: [
            { name: 'Male', data: maleReferrals },
            { name: 'Female', data: femaleReferrals },
          ],
          xaxis: {
            ...this.barChartOptions.xaxis,
            categories: monthYearLabels,
          },
        };
      },
      (error) => console.error(error),
    );
  }

  // =========================
  // PIE CHARTS
  // =========================
  pieColors: string[] = [
    '#1E88E5',
    '#43A047',
    '#FB8C00',
    '#E53935',
    '#8E24AA',
    '#3949AB',
    '#00897B',
    '#F4511E',
  ];

  pieSeries: ApexNonAxisChartSeries = [];
  pieLabels: string[] = [];
  pieChart: ApexChart = { type: 'pie', height: 350, width: 600 };
  pieTitle: ApexTitleSubtitle = { text: 'Referrals by Hospitals' };
  pieLegend: ApexLegend = { position: 'right' };

  pieResponsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: { chart: { width: '100%' }, legend: { position: 'bottom' } },
    },
  ];

  getReferralSummary(): void {
    this.reportService.getReportreferralByHospital().subscribe(
      (data) => {
        if (!data) return;

        const hospitalMap: any = {
          totalReferralsByLumumba: 'Lumumba Regional Hospital',
          totalReferralsByMuhimbiliOrthopaedicInstitute: 'Muhimbili Orthopaedic Institute',
          totalReferralsByJakayaKikweteCardiacInstitute: 'Jakaya Kikwete Cardiac Institute',
          totalReferralsByMuhimbiliNationalHospital: 'Muhimbili National Hospital',
          totalReferralsByOceanRoadCancerInstitute: 'Ocean Road Cancer Institute',
          totalReferralsByKilimanjaroChristianMedicalCentre: 'KCMC',
          totalReferralsByMadrasInstituteOfOrthopaedicsAndTraumatology: 'MIOT',
        };

        this.pieLabels = Object.values(hospitalMap);
        this.pieSeries = Object.keys(hospitalMap).map((k) => data[k] || 0);
      },
      (error) => console.error(error),
    );
  }

  // =========================
  // GENDER PIE
  // =========================
  reasonSeries: ApexNonAxisChartSeries = [];
  reasonLabels: string[] = [];
  reasonChart: ApexChart = { type: 'pie', height: 350 };
  reasonTitle: ApexTitleSubtitle = { text: 'Referrals by Gender' };
  reasonLegend: ApexLegend = { position: 'right' };

  reasonResponsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: { chart: { width: 300 }, legend: { position: 'bottom' } },
    },
  ];

  getReferralSummaryByReason(): void {
    this.reportService.getReportreferralreferralsByReason().subscribe(
      (data) => {
        this.reasonLabels = ['Male', 'Female'];
        this.reasonSeries = [data.Male || 0, data.Female || 0];
      },
      (error) =>
        console.error('Error fetching referral summary by reason', error),
    );
  }

  // =========================
  // LINE CHART
  // =========================
  lineChartOptions: any = {
    series: [],
    chart: {
      type: 'line',
      height: 400,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: [] },
    yaxis: { title: { text: 'Referrals' } },
    colors: [
      '#008FFB','#FEB019','#00E396','#FF4560','#060312ff',
      '#7a6054ff','#2664a6ff','#D10CE8','#69d3ebff','#1E88E5',
    ],
    tooltip: { shared: true, intersect: false },
  };

  // =========================
  // BAR CHART
  // =========================
  barChartOptions: any = {
    series: [],
    chart: { type: 'bar', stacked: true, height: 350 },
    xaxis: { categories: [] },
  };
}