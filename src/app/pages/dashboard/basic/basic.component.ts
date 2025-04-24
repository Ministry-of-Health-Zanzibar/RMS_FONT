import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  TotalSubscribersWidgetComponent
} from '@shared/widgets/total-subscribers-widget/total-subscribers-widget.component';
import { AvgOpenRateWidgetComponent } from '@shared/widgets/avg-open-rate-widget/avg-open-rate-widget.component';
import { AvgClickRateWidgetComponent } from '@shared/widgets/avg-click-rate-widget/avg-click-rate-widget.component';
import { UniqueVisitorsWidgetComponent } from '@shared/widgets/unique-visitors-widget/unique-visitors-widget.component';
import { ExchangeWidgetComponent } from "../../../@shared/widgets/exchange-widget/exchange-widget.component";
import { MyInvestmentsComponent } from "../../../@shared/widgets/my-investments/my-investments.component";
import { PaymentInformationWidgetComponent } from "../../../@shared/widgets/payment-information-widget/payment-information-widget.component";
import { PurchasesByChannelsWidgetComponent } from "../../../@shared/widgets/purchases-by-channels-widget/purchases-by-channels-widget.component";
import { SiteVisitorsWidgetComponent } from "../../../@shared/widgets/site-visitors-widget/site-visitors-widget.component";
import { EventsWidgetComponent } from '@shared/widgets/events-widget/events-widget.component';
import { TeamWidgetComponent } from '@shared/widgets/team-widget/team-widget.component';
import { TasksInProgressWidgetComponent } from '@shared/widgets/tasks-in-progress-widget/tasks-in-progress-widget.component';
import { CustomerSatisfactionWidgetComponent } from '@shared/widgets/customer-satisfaction-widget/customer-satisfaction-widget.component';
import { StatisticalService } from '../../../services/report/statistical.service';
import { Chart } from 'chart.js';




@Component({
  standalone: true,
  imports: [

    TotalSubscribersWidgetComponent,
    AvgOpenRateWidgetComponent,
    AvgClickRateWidgetComponent,
    UniqueVisitorsWidgetComponent,
    CommonModule, // Required for Angular standalone components
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    TotalSubscribersWidgetComponent,
    AvgOpenRateWidgetComponent,
    UniqueVisitorsWidgetComponent,
    EventsWidgetComponent,
    TeamWidgetComponent,
    TasksInProgressWidgetComponent,
    CustomerSatisfactionWidgetComponent,
    ExchangeWidgetComponent,
    MyInvestmentsComponent,
    PaymentInformationWidgetComponent,
    PurchasesByChannelsWidgetComponent,
    SiteVisitorsWidgetComponent,

  ],
  templateUrl: './basic.component.html',
  styleUrl: './basic.component.scss'
})
export class BasicComponent implements OnInit {
  complain: any = {};
  totalMaleComplain: any;

  constructor(private dashboardService: StatisticalService) {}


  ngOnInit(): void {

    this.dashboardService.getClientReport().subscribe((data) => {
      // this.createChart(
      //   'complainsPerWeekChart',
      //   data.complains_per_week,
      //   'Complains Per Week'
      // );
      this.createChart(
        'referralPerMonthChart',
        data.referral_per_month,
        'Referral Per Month'
      );
      // this.createChart(
      //   'complainsPerYearChart',
      //   data.complains_per_year,
      //   'Complains Per Year'
      // );
      // this.createChart(
      //   'complainsByStatusChart',
      //   data.complains_by_status,
      //   'Complains by Status'
      // );
    });
   this.getReferralPerMonthReport();
  }

  public getReferralPerMonthReport(): void {
    this.dashboardService
    .getReferralPerMonthReport()
      .subscribe((data) => {
        if (!data.referral_per_month) {
          console.error('No complains_per_month data found');
          return;
        }


        const labels = data.referral_per_month.map((item: any) => {
          const [year, month] = item.month.split('-'); // Split "2025-02" into ["2025", "02"]
          const date = new Date(Number(year), Number(month) - 1); // Create a Date object
          return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric',
          }).format(date);
        });

        const complainData = data.referral_per_month.map(
          (item: any) => item.total
        );



        this.renderChart(
          'referralPerMonthChart',
          labels,
          complainData,
          'bar',
          'Referral Per Month'
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
