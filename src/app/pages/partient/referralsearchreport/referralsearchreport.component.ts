import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { Observable, Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatIcon } from '@angular/material/icon';

import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import { saveAs } from 'file-saver';



import autoTable from 'jspdf-autotable';



import { EmrSegmentedModule } from '@elementar/components';
import { PermissionService } from '../../../services/authentication/permission.service';
import { MatDialog } from '@angular/material/dialog';
import { ReferralreportService } from '../../../services/Referral/referralreport.service';
import { HospitalService } from '../../../services/system-configuration/hospital.service';
import { ReasonsService } from '../../../services/system-configuration/reasons.service';
import { ReferalTypeService } from '../../../services/system-configuration/referal-type.service';

@Component({
  selector: 'app-referralsearchreport',
  standalone: true,
  imports: [
     CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatInput,
    MatIcon,
    MatFormFieldModule,
    EmrSegmentedModule
  ],
  templateUrl: './referralsearchreport.component.html',
  styleUrl: './referralsearchreport.component.scss'
})
export class ReferralsearchreportComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  private readonly onDestroy = new Subject<void>();

  reportForm: FormGroup;
  displayedColumns: string[] = ['no', 'name', 'hospital_name', 'hospital_address', 'referral_type_name','referral_reason_name','insurance_provider_name'];
  dataSource = new MatTableDataSource<any>();

  documents: any[] = [];
  reasons:any;
  referralType:any;
  hospital:any;

  errorMessage = '';
  noResults = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public permission: PermissionService,
    private hospitalServices:HospitalService,
    private reasonServi:ReasonsService,
    private typeServices:ReferalTypeService,
    private reportService: ReferralreportService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}




  ngOnInit(): void {
    this.configForm();
    this.getReasons();
    this.getReferralType()
    this.getHospital();
  }

  renew(): void {
    this.searchReport();
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  configForm(): void {
    this.reportForm = new FormGroup({
      hospital_name: new FormControl(null),
      referral_reason_name: new FormControl(null),
      referral_type_name: new FormControl(null),
       patient_name: new FormControl(null),
      // category_name: new FormControl(null),

    });
  }

  getReasons(): void {
    this.reasonServi.getAllReasons().subscribe(response => {
      this.reasons = response.data;
    });
  }
  getReferralType(): void {
    this.typeServices.getAllReferalType().subscribe(response => {
      this.referralType = response.data;
    });
  }
  getHospital(): void {
    this.hospitalServices.getAllHospital().subscribe(response => {
      this.hospital = response.data;
      console.log("hospitali hiziii",response.data)
    });
  }

 searchReport(): void {
  this.loading = true;
  this.reportService.generateReport(this.reportForm.value).subscribe({
    next: response => {
      this.loading = false;
      this.dataSource.data = response.data;
      this.dataSource.paginator = this.paginator;
    },
    error: err => {
      this.loading = false;
      if (err.status === 404) {
        this.dataSource.data = [];  // Clear previous data
        this.noResults = true;
      } else {
        this.errorMessage = 'Error fetching reports';
      }
    }
  });
}


  // Fix: Improve search filter to work across all columns






  // Export Excel
  exportExcel(): void {
    const dataToExport = this.dataSource.data;
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook: XLSX.WorkBook = { Sheets: { 'Reports': worksheet }, SheetNames: ['Reports'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
   // this.saveAsExcelFile(excelBuffer, 'reports');
  }

  // private saveAsExcelFile(buffer: any, fileName: string): void {
  //   const data: Blob = new Blob(
  //     [buffer],
  //     { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' }
  //   );
  //   saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  // }

  // Export PDF
  exportPDF() {
    const doc = new jsPDF();
    doc.text('Report Data', 10, 10);

    autoTable(doc, {
      head: [['no', 'name', 'hospital_name', 'hospital_address', 'referral_type_name','referral_reason_name','insurance_provider_name']],
      body: this.dataSource.data.map((element, index) => [
        index + 1,
        element.patient_name,
        element.hospital_name,
        element.hospital_address,
        element.referral_type_name,
        element.referral_reason_name,
        element.insurance_provider_name,

      ]),
    });

    doc.save('report.pdf');
  }





}
