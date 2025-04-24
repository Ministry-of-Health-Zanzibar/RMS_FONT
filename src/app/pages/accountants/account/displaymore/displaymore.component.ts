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
import { DocumentsService } from '../../../../services/accountants/documents.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-displaymore',
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
  templateUrl: './displaymore.component.html',
  styleUrl: './displaymore.component.scss'
})
export class DisplaymoreComponent implements OnInit{
  public displayRoleForm!: FormGroup;
  docuID: string | null = null;
  patient: any = null;
  insurance: any = null;
  userRole: string | null;
  documentForm: any;

  constructor(private route: ActivatedRoute,
    public documentServices:DocumentsService,
    private dialog: MatDialog

  ) {}

  // ngOnInit(): void {
  //   this.getFeedbackById()

  // }

  ngOnInit() {
    this.docuID = this.route.snapshot.paramMap.get('id');
    console.log("inafika value",this.docuID) // Get complaint ID from URL
    if (this.docuID) {
      this.documentServices.getDocumentById(this.docuID).subscribe(
        (response: any) => {
          console.log('response: ', response.data);
          this.documentForm = response.data;
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse.error.message);
        }
      );
     // this.getMoreData();
      //this.getFeedbackById();


    }
  }


  // public getMoreData() {
  //   if (!this.docuID) return;

  //   this.displayServices.getDocumentById(this.docuID).subscribe(
  //     response => {
  //       console.log('Full API Response:', response);
  //       this.patient = response;


  //     },
  //     error => {
  //       console.error('Failed to load patient data', error);
  //     }
  //   );
  // }





}