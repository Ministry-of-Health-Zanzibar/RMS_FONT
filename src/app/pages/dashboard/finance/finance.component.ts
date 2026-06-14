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

  // =====================
  // POPUP STATE (OTHERS)
  // =====================
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
  }

  // =========================
  // OPEN OTHERS POPUP
  // =========================
  openOthersDiagnoses(): void {
    this.reportService.getOtherDiagnosesList().subscribe(
      (res:any) => {
        this.othersData = res?.data || [];
        this.showOthersModal = true;
      },
      (err) => console.error(err)
    );
  }

  closeModal(): void {
    this.showOthersModal = false;
  }

  // =========================
  // REFERRAL TREND (NO OTHERS HERE)
  // =========================
  fetchReferralTrends(): void {
    this.reportService.getAnalyticalReferalTrend().subscribe(
      (response) => {

        if (!response?.data) return;

        const categories: string[] = response.dates || [];
        const dataObj = response.data;

        const series = Object.keys(dataObj).map((key, index) => ({
          name: key,
          data: categories.map((month: string) => {
            const entry = dataObj[key].find((i: any) => i.date === month);
            return entry ? entry.total : 0;
          }),
          // ensure unique color per series
          color: this.getUniqueColor(index)
        }));

        this.lineChartOptions = {
          ...this.lineChartOptions,
          series,
          xaxis: {
            ...this.lineChartOptions.xaxis,
            categories: categories.map(m => this.formatMonth(m)),
          },
        };
      },
      (error) => console.error(error),
    );
  }

  // =========================
  // UNIQUE COLORS (NO REPEAT)
  // =========================
  private colors: string[] = [
    '#00E396', '#FEB019', '#FF4560', '#775DD0', '#008FFB',
    '#00B8D9', '#FF6D00', '#2E7D32', '#D500F9', '#FF1744'
  ];

  private getUniqueColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  private formatMonth(month: string): string {
    const [year, m] = month.split('-');

    const names = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    return `${names[+m - 1]} ${year}`;
  }

  // =========================
  // DATA
  // =========================
  fetchData(): void {
    this.reportService.getCount().subscribe(
      (res) => this.referral = res,
      (err) => console.error(err),
    );
  }

  fetchReferralByMonth(): void {
    this.reportService.getMonthRefferalByGender().subscribe(
      (response) => {

        const chartData = response?.data || [];

        const monthNames = [
          'January','February','March','April','May','June',
          'July','August','September','October','November','December'
        ];

        const labels = chartData.map((item: any) => {
          const [year, month] = item.month.split('-');
          return `${monthNames[+month - 1]} ${year}`;
        });

        this.barChartOptions = {
          ...this.barChartOptions,
          series: [
            { name: 'Male', data: chartData.map((i: any) => i.male_referrals || 0) },
            { name: 'Female', data: chartData.map((i: any) => i.female_referrals || 0) },
          ],
          xaxis: {
            ...this.barChartOptions.xaxis,
            categories: labels,
          },
        };
      }
    );
  }

  // =========================
  // PIE CHARTS
  // =========================
  pieSeries: any[] = [];
  pieLabels: string[] = [];

  getReferralSummary(): void {
    this.reportService.getReportreferralByHospital().subscribe(
      (data) => {

        const hospitalMap: any = {
          totalReferralsByLumumba: 'Lumumba Regional Hospital',
          totalReferralsByMuhimbiliOrthopaedicInstitute: 'Muhimbili Orthopaedic Institute',
          totalReferralsByJakayaKikweteCardiacInstitute: 'JKCI',
          totalReferralsByMuhimbiliNationalHospital: 'MNH',
        };

        this.pieLabels = Object.values(hospitalMap);
        this.pieSeries = Object.keys(hospitalMap).map(k => data[k] || 0);
      }
    );
  }

  reasonSeries: any[] = [];
  reasonLabels: string[] = [];

  getReferralSummaryByReason(): void {
    this.reportService.getReportreferralreferralsByReason().subscribe(
      (data) => {
        this.reasonLabels = ['Male', 'Female'];
        this.reasonSeries = [data.Male || 0, data.Female || 0];
      }
    );
  }

  // =========================
  // CHART OPTIONS
  // =========================
  lineChartOptions: any = {
    series: [],
    chart: {
      type: 'line',
      height: 400,
      zoom: { enabled: true }
    },
    xaxis: { categories: [] },
    stroke: { curve: 'smooth', width: 3 },
    colors: this.colors,
    tooltip: { shared: true, intersect: false }
  };

  barChartOptions: any = {
    series: [],
    chart: { type: 'bar', stacked: true, height: 350 },
    xaxis: { categories: [] },
  };
}