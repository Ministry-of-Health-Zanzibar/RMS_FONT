import { UserService } from './../../../services/users/user.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { HDividerComponent } from '@elementar/components';
import { map, Observable, startWith, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { RolePermissionService } from '../../../services/users/role-permission.service';

import { PartientService } from '../../../services/partient/partient.service';
import { GlobalConstants } from '@shared/global-constants';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';

@Component({
  selector: 'app-addpartient',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatLabel,
    MatDialogModule,
    MatError,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatSelect,
    MatDatepickerModule
  ],
  templateUrl: './addpartient.component.html',
  styleUrl: './addpartient.component.scss'
})
export class AddpartientComponent {

  private readonly onDestroy = new Subject<void>()
  readonly data = inject<any>(MAT_DIALOG_DATA);
  public sidebarVisible:boolean = true

  patientForm: FormGroup;
  user: any;
  patientData: any;
  locations: any;
  workStation: any;
  roles: any;
  options: any[] = [];
  myControl = new FormControl('');
  filteredOptions: Observable<any[]>;
 // selectedAttachement: File = null!;
  selectedAttachement: File | null = null;

  constructor(
    private patientService:PartientService,
    private roleService: RolePermissionService,
    private dialogRef: MatDialogRef<AddpartientComponent>) {

  }

  ngOnInit(): void {
    if(this.data){
      this.patientData = this.data.data;
     // this.getHospital(this.id);
    }
    this.configForm();
  }

  // getDepartm(id: any){
  //   this.departmentService.getAllDepartmentById(id).subscribe(response=>{
  //     this.departmentForm.patchValue(response.data[0])
  //   })
  // }

  ngOnDestroy(): void {
    this.onDestroy.next()
  }
  onClose() {
    this.dialogRef.close(false)
  }


  configForm(){
         this.patientForm = new FormGroup({
           name: new FormControl(null, [Validators.required, Validators.pattern(GlobalConstants.nameRegexOnly)]),
           gender: new FormControl(null, Validators.required),
           location: new FormControl(null, Validators.required),
           phone: new FormControl(null, Validators.required),
           job: new FormControl(null, Validators.required),
           position: new FormControl(null, Validators.required),
           date_of_birth: new FormControl(null, Validators.required),
           referral_letter_file: new FormControl(null, Validators.required),
         });
         if(this.patientData){
           this.patientForm.patchValue(this.patientData);
         }
       }





  onAttachementSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAttachement = input.files[0];
      this.patientForm.get('referral_letter_file')?.setValue(this.selectedAttachement.name);
      this.patientForm.get('referral_letter_file')?.updateValueAndValidity();
    }
  }



  savePatient() {
    if (this.patientForm.valid) {
      const formData = this.patientForm.value;

      // Ensure you're extracting the correct IDs
      const requestData = {
        name: formData.name,
        gender: formData.gender ,
        location:formData.location,
        phone:formData.phone,
        job:formData.job,
        position:formData.position,
        date_of_birth:formData.date_of_birth,
        referral_letter_file:formData.referral_letter_file
      };

      // Object.keys(this.patientForm.controls).forEach(key => {
      //   if (key === 'referral_letter_file') {
      //     if (this.selectedAttachement) {
      //       patientData.append('referral_letter_file', this.selectedAttachement);
      //     }
      //   } else {
      //     const value = this.patientForm.get(key)?.value;
      //     patientData.append(key, value ?? '');
      //   }
      // });

      this.patientService.addPartient(formData).subscribe(response => {
        if (response.statusCode === 201) {
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonColor: "#4690eb",
            confirmButtonText: "Close"
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.message,
            icon: "error",
            confirmButtonColor: "#4690eb",
            confirmButtonText: "Close"
          });
        }
      });
    }
  }
  updatePatient(){
    if(this.patientForm.valid){
      this.patientService.updatePartient(this.patientForm.value, this.patientData.patient_id).subscribe(response=>{
        if(response.statusCode == 200){
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonColor: "#4690eb",
            confirmButtonText: "Close"
          });
        }
        else{
          Swal.fire({
            title: "Error",
            text: response.message,
            icon: "error",
            confirmButtonColor: "#4690eb",
            confirmButtonText: "Close"
          });
        }
      })
    }
  }



  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Handle the file (e.g., store it, upload it, etc.)
      console.log(file.name);
    }
  }

}
