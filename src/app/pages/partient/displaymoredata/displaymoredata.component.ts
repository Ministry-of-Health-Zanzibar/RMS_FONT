import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { PartientService } from '../../../services/partient/partient.service';

@Component({
  selector: 'app-displaymoredata',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIcon,
    MatDialogModule
  ],
  templateUrl: './displaymoredata.component.html',
  styleUrl: './displaymoredata.component.scss'
})
export class DisplaymoredataComponent implements OnInit{
  public displayRoleForm!: FormGroup;
  patientID: string | null = null;
  patient: any = null;
  insurance: any = null;
  userRole: string | null;

  constructor(private route: ActivatedRoute,
    public displayServices:PartientService,
    private dialog: MatDialog

  ) {}

  // ngOnInit(): void {
  //   this.getFeedbackById()

  // }

  ngOnInit() {
    this.patientID = this.route.snapshot.paramMap.get('id');
    console.log("inafika value",this.patientID) // Get complaint ID from URL
    if (this.patientID) {
      this.getMoreData();
      //this.getFeedbackById();


    }
  }


  // getMoreData() {
  //    if (!this.patient_id) return;

  //   this.displayServices.getPatientInsurances(this.patient_id)
  //     .subscribe(response => {
  //       console.log("Full API Response:", response);
  //       this.patient = response.data; // assuming your API returns { data: {...} }
  //     }, error => {
  //       console.error('Error fetching patient details:', error);
  //     });
  // }
  // getFeedbackById() {

  //   this.displayServices.getPatientInsurances(this.patientID)
  //     .subscribe(response => {
  //       console.log("Full API Response:", response);

  //       // Make sure you're correctly accessing the "data" array
  //       const responseData = (response as any).data;
  //       if (responseData && responseData.length > 0) {
  //         this.patient = responseData[0]; // Get the first complaint object
  //       }
  //     }, error => {
  //       console.error('Error fetching complaint details:', error);
  //     });
  // }
  public getMoreData() {
    if (!this.patientID) return;

    this.displayServices.getPatientInsurances(this.patientID).subscribe(
      response => {
        console.log('Full API Response:', response);
        this.patient = response.data; // Assuming API returns { data: {...} }
      },
      error => {
        console.error('Failed to load patient data', error);
      }
    );
  }





}