

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
  // REFERRAL TREND (12 MONTH FIXED)
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
            const entry = dataObj[key].find((i: any) => i.date === month);
            return entry ? entry.total : 0;
          }),
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

  private formatMonth(month: string): string {
    const [year, m] = month.split('-');

    const names = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];

    return `${names[+m - 1]} ${year}`;
  }

  // =========================
  // OTHER FUNCTIONS (UNCHANGED LOGIC)
  // =========================
  fetchData(): void {
    this.reportService.getCount().subscribe(
      (response) => this.referral = response,
      (error) => console.error(error),
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
      },
      (error) => console.error(error),
    );
  }

  // =========================
  // PIE / SUMMARY (UNCHANGED)
  // =========================
  pieSeries: any[] = [];
  pieLabels: string[] = [];

  getReferralSummary(): void {
    this.reportService.getReportreferralByHospital().subscribe(
      (data) => {
        if (!data) return;

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
  // CHART OPTIONS (UNCHANGED STRUCTURE)
  // =========================
  lineChartOptions: any = {
    series: [],
    chart: { type: 'line', height: 400, zoom: { enabled: true } },
    xaxis: { categories: [] },
    stroke: { curve: 'smooth', width: 3 },
    colors: ['#00E396', '#FEB019', '#FF4560'],
    tooltip: {
      shared: true,
      intersect: false,
      custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
    
        const category = w.globals.labels[dataPointIndex];
    
        let html = `<div style="
          padding:10px;
          background:white;
          border:1px solid #ddd;
          border-radius:8px;
          font-size:13px;
        ">`;
    
        html += `<strong>${category}</strong><br/><br/>`;
    
        w.config.series.forEach((s: any, i: number) => {
          const value = series[i][dataPointIndex];
    
          html += `
            <div style="margin-bottom:4px;">
              <span style="color:${w.globals.colors[i]};">●</span>
              ${s.name}: <b>${value}</b>
            </div>
          `;
        });
    
        // 🔥 SPECIAL HANDLING FOR "Others"
        const othersSeries = w.config.series.find((s: any) => s.name === 'Others');
    
        if (othersSeries) {
          const othersIndex = w.config.series.findIndex((s: any) => s.name === 'Others');
          const othersValue = series[othersIndex][dataPointIndex];
    
          const breakdown = w.config.series[othersIndex]?.breakdown?.[dataPointIndex];
    
          if (breakdown?.length) {
            html += `<hr style="margin:8px 0"/>`;
            html += `<strong>Other Diagnoses</strong><br/>`;
    
            breakdown.forEach((b: any) => {
              html += `
                <div style="margin-left:10px;">
                  - ${b.name}: <b>${b.count}</b>
                </div>
              `;
            });
          }
        }
    
        html += `</div>`;
        return html;
      }
    }
  };

  barChartOptions: any = {
    series: [],
    chart: { type: 'bar', stacked: true, height: 350 },
    xaxis: { categories: [] },
  };
}
