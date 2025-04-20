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

  // getUser(patientData: any) {
  //   this.patientService.getPartientById(patientData).subscribe(response=>{
  //     if(response.statusCode == 200){
  //       this.user = response.data[0];
  //       this.patientForm.patchValue(this.user);

  //     }
  //     else{
  //       Swal.fire({
  //         title: "error",
  //         text: response.message,
  //         icon: "error",
  //         confirmButtonColor: "#4690eb",
  //         confirmButtonText: "Close"
  //       });
  //     }
  //   })
  // }

  // savePartient(){
  //   if(this.patientForm.valid){
  //     this.patientService.addPartient(this.patientForm.value).subscribe(response=>{
  //       if(response.statusCode == 201){
  //         var message;
  //         Swal.fire({
  //           title: "Success",

  //           text: response.message,

  //           icon: "success",
  //           confirmButtonColor: "#4690eb",
  //           confirmButtonText: "Close"
  //         });
  //       }
  //       else{
  //         Swal.fire({
  //           title: "Error",
  //           text: response.message,
  //           icon: "error",
  //           confirmButtonColor: "#4690eb",
  //           confirmButtonText: "Close"
  //         });
  //       }
  //     })
  //   }
  // }



  // onAttachementSelected(event: Event) {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     this.selectedAttachement = file;
  //     console.log("Selected file:", file.name);
  //   }
  // }



  onAttachementSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAttachement = input.files[0];
      this.patientForm.get('referral_letter_file')?.setValue(this.selectedAttachement.name);
      this.patientForm.get('referral_letter_file')?.updateValueAndValidity();
    }
  }


  // public addAnnouncement(): void {
  //   const formData = new FormData();
  //   formData.append('announcement_title', this.name.get('announcementTitle')?.value);
  //   formData.append('announcement_content', this.announcementForm.get('announcementContent')?.value);

  //   const files = this.announcementForm.get('document')?.value;
  //   if (files && files.length > 0) {
  //     for (let i = 0; i < files.length; i++) {
  //       formData.append('announcement_document[]', files[i], files[i].name); // Append each file
  //     }
  //   }

  //   this.announcementService.createAnnouncement(formData).subscribe(
  //     (response: any) => {
  //       this.dialogRef.close();
  //       this.onAddAnnouncementEventEmitter.emit();
  //       if (response.statusCode === 201) {
  //         this.toastService.toastSuccess(response.message);
  //       } else {
  //         this.toastService.toastError(response.message);
  //       }
  //     },
  //     (errorResponse: HttpErrorResponse) => {
  //       this.toastService.toastError(errorResponse.error.message);
  //     }
  //   );
  // }


  savePatient() {
    if (this.patientForm.valid) {
      const patientData = new this.patientData();

      Object.keys(this.patientForm.controls).forEach(key => {
        if (key === 'referral_letter_file') {
          if (this.selectedAttachement) {
            patientData.append('referral_letter_file', this.selectedAttachement);
          }
        } else {
          const value = this.patientForm.get(key)?.value;
          patientData.append(key, value ?? '');
        }
      });

      this.patientService.addPartient(patientData).subscribe(response => {
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
