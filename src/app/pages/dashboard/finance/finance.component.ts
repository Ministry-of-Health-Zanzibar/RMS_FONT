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
  stroke?: ApexStroke;
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

  lineChartOptions: ApexChartOptions = {
    series: [], // Will be filled dynamically from API
    chart: {
      type: 'line',
      height: 400,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    title: {
      text: 'Referral Trends',
      align: 'center',
      style: { fontSize: '20px', fontWeight: 'bold' },
    },
    xaxis: {
      categories: [],
      title: { text: 'Date' },
      labels: { rotate: -45 },
    },
    yaxis: {
      title: { text: 'Referrals' },
    },
    legend: {
      position: 'right',
      fontSize: '13px',
    },
    colors: [
      '#008FFB',
      '#FEB019',
      '#00E396',
      '#FF4560',
      '#775DD0',
      '#546E7A',
      '#26A69A',
      '#D10CE8',
      '#8D6E63',
      '#1E88E5',
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
    fill: {
      type: 'solid',
      opacity: 0.8,
    },
    plotOptions: {
      bar: { horizontal: false },
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
    this.fetchReferralTrends();
    this.fetchData();
  }

  fetchReferralTrends(): void {
    this.reportService.getAnalyticalReferalTrend().subscribe(
      (response) => {
        console.log('Raw response:', response);

        if (!response || !response.data) return;

        const categories: string[] = response.dates || [];
        const dataObj: Record<string, { date: string; total: number }[]> =
          response.data;

        const series = Object.keys(dataObj).map((key) => ({
          name: key,
          data: categories.map((date: string) => {
            const entry = dataObj[key].find((item) => item.date === date);
            return entry ? entry.total : 0;
          }),
        }));

        console.log('Processed Series:', series);
        console.log('Categories:', categories);

        this.lineChartOptions = {
          ...this.lineChartOptions,
          series,
          xaxis: { ...this.lineChartOptions.xaxis, categories },
          stroke: { curve: 'smooth', width: 3 },
          markers: { size: 6 },
          colors: ['#00E396', '#FEB019', '#FF4560', '#775DD0', '#008FFB'],
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              type: 'horizontal',
              shadeIntensity: 0.5,
              opacityFrom: 0.8,
              opacityTo: 0.3,
              stops: [0, 100],
            },
          },
          tooltip: { shared: true, intersect: false },
        };
      },
      (error) => {
        console.error('Error fetching referral trend:', error);
      }
    );
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

  // fetchReferralByMonth(): void {
  //   this.reportService.getMonthRefferalByGender().subscribe(
  //     (response) => {
  //       const chartData = response?.data || [];

  //       const monthNames = [
  //         'January',
  //         'February',
  //         'March',
  //         'April',
  //         'May',
  //         'June',
  //         'July',
  //         'August',
  //         'September',
  //         'October',
  //         'November',
  //         'December',
  //       ];

  //       const months = chartData.map((item: any) => {
  //         const [year, month] = item.month.split('-');
  //         return monthNames[parseInt(month) - 1];
  //       });

  //       const maleReferrals = chartData.map(
  //         (item: any) => item.male_referrals || 0
  //       );
  //       const femaleReferrals = chartData.map(
  //         (item: any) => item.female_referrals || 0
  //       );

  //       this.barChartOptions = {
  //         ...this.barChartOptions,
  //         series: [
  //           { name: 'Male', data: maleReferrals },
  //           { name: 'Female', data: femaleReferrals },
  //         ],
  //         xaxis: {
  //           ...this.barChartOptions.xaxis,
  //           categories: months,
  //         },
  //       };
  //     },
  //     (error) => console.error('Error fetching referral data:', error)
  //   );
  // }

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

        // Create "Month Year" labels
        const monthYearLabels = chartData.map((item: any) => {
          const [year, month] = item.month.split('-');
          const monthName = monthNames[parseInt(month, 10) - 1];
          return `${monthName} ${year}`; // e.g. "January 2025"
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
            categories: monthYearLabels,
            title: { text: 'Month & Year' },
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
