import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserService } from '../../../services/users/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-user-hospital',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './assign-user-hospital.component.html',
  styleUrls: ['./assign-user-hospital.component.scss']
})
export class AssignUserHospitalComponent implements OnInit {

  assignForm!: FormGroup;
  hospitals: any[] = [];
  roles: string[] = [
    'hospital_admin',
    'hospital_doctor',
    'hospital_nurse',
    'hospital_pharmacist',
    'hospital_lab_technician',
    'hospital_data_clerk',
    'district_health_officer',
    'district_data_manager',
    'regional_health_officer',
    'ministry_admin',
    'ministry_analyst'
  ];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<AssignUserHospitalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.assignForm = this.fb.group({
      hospital_id: ['', Validators.required], // Use hospital_id instead of name
      role: ['', Validators.required]
    });

    this.loadHospitals();
  }

  loadHospitals(): void {
    this.loading = true;
    this.userService.getHospitals().subscribe({
      next: (res) => {
        this.hospitals = res.data; 
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load hospitals', err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load hospitals',
          icon: 'error',
          confirmButtonColor: '#4690eb'
        });
        this.loading = false;
      }
    });
  }

  submit(): void {
    if (this.assignForm.invalid) return;

    const payload = {
      hospital_id: this.assignForm.value.hospital_id, 
      role: this.assignForm.value.role
    };

    this.loading = true;

    this.userService.assignHospitalToUser(this.data.userId, payload).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success',
          text: res.message || 'Hospital assigned successfully',
          icon: 'success',
          confirmButtonColor: '#4690eb'
        });
        this.loading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.error?.message || 'Failed to assign hospital',
          icon: 'error',
          confirmButtonColor: '#4690eb'
        });
        this.loading = false;
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
