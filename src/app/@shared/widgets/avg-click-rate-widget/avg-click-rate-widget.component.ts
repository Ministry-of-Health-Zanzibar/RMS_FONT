import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { StatisticalService } from '../../../services/report/statistical.service';

@Component({
  selector: 'app-avg-click-rate-widget',
  standalone: true,
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './avg-click-rate-widget.component.html',
  styleUrl: './avg-click-rate-widget.component.scss'
})
export class AvgClickRateWidgetComponent {

complain: any = {}; // To store the response object

  constructor(private dashboardService: StatisticalService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.dashboardService.getCount().subscribe(
      (response) => {
        this.complain = response;
        console.log('Data fetched successfully:', this.complain);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }


}
