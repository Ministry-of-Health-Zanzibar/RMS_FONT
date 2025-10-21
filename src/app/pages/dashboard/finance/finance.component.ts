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
} from 'ng-apexcharts';

// ✅ Define chart options interface
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

  barChartOptions: ApexChartOptions = {
    series: [
      { name: 'Male', data: [] },
      { name: 'Female', data: [] },
    ],
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [],
      title: { text: 'Month' },
      labels: { style: { fontSize: '12px' } },
    },
    yaxis: {
      title: { text: 'Patients' },
      labels: { style: { fontSize: '12px' } },
    },
    fill: { opacity: 1 },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '14px',
    },
    tooltip: {
      y: {
        formatter: (val: number, opts?: any) => {
          const gender = opts?.seriesIndex === 0 ? 'Male' : 'Female';
          const month = opts?.w.globals.labels[opts.dataPointIndex];
          return `${month} - ${gender}: ${val}`;
        },
      },
    },
    colors: ['#4FD1C5', '#9AE6B4'],
    title: {
      text: 'Monthly Referrals by Gender',
      align: 'center',
      style: { fontSize: '18px', fontWeight: 'bold', color: '#333' },
    },
  };

  constructor(
    private dashboardService: StatisticalService,
    private reportService: GraphreportService
  ) {}

  ngOnInit(): void {
    this.getReferralSummary();
    this.getReferralSummaryByReason();
    this.fetchReferralByMonth();
    this.fetchData();
  }

  fetchData(): void {
    this.reportService.getCount().subscribe(
      (response) => {
        this.referral = response;
        console.log('Data fetched successfully:', this.referral);
      },
      (error) => console.error('Error fetching data:', error)
    );
  }

  fetchReferralByMonth(): void {
    this.reportService.getMonthRefferalByGender().subscribe(
      (response) => {
        const chartData = response?.data || [];

        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];

        const months = chartData.map((item: any) => {
          const [year, month] = item.month.split('-');
          return monthNames[parseInt(month) - 1];
        });

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
            categories: months,
          },
        };
      },
      (error) => console.error('Error fetching referral data:', error)
    );
  }

  pieSeries: ApexNonAxisChartSeries = [];
  pieLabels: string[] = [];
  pieChart: ApexChart = { type: 'pie', height: 350, width: 600 };
  pieTitle: ApexTitleSubtitle = { text: 'Referrals by Hospitals' };
  pieLegend: ApexLegend = { position: 'right' };
  pieResponsive: ApexResponsive[] = [
    {
      breakpoint: 480,
      options: { chart: { width: 300 }, legend: { position: 'bottom' } },
    },
  ];

  getReferralSummary(): void {
    this.reportService.getReportreferralByHospital().subscribe(
      (data) => {
        if (!data) return;
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
        this.pieLabels = Object.keys(hospitalMap).map(
          (key) => hospitalMap[key]
        );
        this.pieSeries = Object.keys(hospitalMap).map((key) => data[key] || 0);
      },
      (error) => console.error('Error fetching referral summary', error)
    );
  }

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
        if (!data) return;
        const reasonMap: { [key: string]: string } = {
          Male: 'Male',
          Female: 'Female',
        };
        this.reasonLabels = Object.keys(reasonMap).map((key) => reasonMap[key]);
        this.reasonSeries = Object.keys(reasonMap).map((key) => data[key] || 0);
      },
      (error) =>
        console.error('Error fetching referral summary by reason', error)
    );
  }
}
