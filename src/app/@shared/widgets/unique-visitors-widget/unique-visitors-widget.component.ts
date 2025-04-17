import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { StatisticalService } from '../../../services/report/statistical.service';

@Component({
  selector: 'app-unique-visitors-widget',
  standalone: true,
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './unique-visitors-widget.component.html',
  styleUrl: './unique-visitors-widget.component.scss'
})
export class UniqueVisitorsWidgetComponent {

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
