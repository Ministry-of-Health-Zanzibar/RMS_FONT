import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { PaymentsService } from '../../../services/payments.service';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, DatePipe],
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
  paymentData: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.paymentsService.getPaymentById(id).subscribe({
        next: (res) => {
          this.paymentData = res.data || res; 
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching payment', err);
          this.loading = false;
        }
      });
    }
  }
}
