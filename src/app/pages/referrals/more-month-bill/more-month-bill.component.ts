import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-more-month-bill',
  standalone: true,
  imports: [
    
  ],
  templateUrl: './more-month-bill.component.html',
  styleUrl: './more-month-bill.component.scss'
})
export class MoreMonthBillComponent implements OnInit {
  hospitalId!: number;

  hospital: any;   // will hold hospital details
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'bill_date',
    'current_amount',
    'audit_amount',
    'file'
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.hospitalId = Number(this.route.snapshot.paramMap.get('id'));

    this.http.get<any>(`http://127.0.0.1:8000/api/getHospitalBills/${this.hospitalId}`)
      .subscribe(res => {
        // ✅ unwrap the response
        this.hospital = res.data.hospital;
        this.dataSource.data = res.data.all_bills;
      });
  }
}
