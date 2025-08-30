import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';
import { PartientService } from '../../../services/partient/partient.service';
import { InsuranceComponent } from '../insurance/insurance.component';
import { PermissionService } from '../../../services/authentication/permission.service';

@Component({
  selector: 'app-body-list-more',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule,   // ✅ Fixed
    MatDialogModule
  ],
  templateUrl: './body-list-more.component.html',
  styleUrls: ['./body-list-more.component.scss']   // ✅ Fixed
})
export class BodyListMoreComponent implements OnInit {
  public displayRoleForm!: FormGroup;
  loading: boolean = false;
  bodyListId: string | null = null;
  patients: any = null;
  feedback: any = null;
  userRole: string | null = null;
  patientListInfo: any = null;   // ✅ to hold title + file

  constructor(
    private route: ActivatedRoute,
     public permission: PermissionService,
    private userService: PartientService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.bodyListId = this.route.snapshot.paramMap.get('id'); // Get patient list ID from URL
    if (this.bodyListId) {
      this.getFeedbackById();
      this.userRole = localStorage.getItem('roles');
      console.log('ROLE: ', this.userRole);
    }
  }

  public getUserRole(): any {
    return localStorage.getItem('roles');
  }

  public get isStaff(): boolean {
    return this.getUserRole() === 'ROLE STAFF';
  }

  getFeedbackById() {
    this.loading = true;

    this.userService.getBodyListById(this.bodyListId).subscribe(
      (response: any) => {
        this.loading = false;

        const responseData = response?.data;
        if (responseData && responseData.length > 0) {
          this.patients = { data: responseData };

          // ✅ Extract patient_list_title & file from the first record
          this.patientListInfo = {
            id: responseData[0].patient_list_id,
            title: responseData[0].patient_list_title,
            file: responseData[0].patient_list_file
          };
        } else {
          this.patients = { data: [] };
          this.patientListInfo = null;
        }
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching patients details:', error);
      }
    );
  }

    getPatient(id:any){
       console.log("hiiii",id);
      let config = new MatDialogConfig()
      config.disableClose = false
      config.role = 'dialog'
      config.maxWidth ='100vw'
      config.maxHeight = '100vh'
      config.width = '850px'
      config.panelClass = 'full-screen-modal'
      config.data = {id: id}

      const dialogRef = this.dialog.open(InsuranceComponent,config);

      dialogRef.afterClosed().subscribe(result => {
        this.getFeedbackById();
      });
    }

  extractFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}
