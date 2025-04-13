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

  userForm: FormGroup;
  user: any;
  id: any;
  locations: any;
  workStation: any;
  roles: any;
  options: any[] = [];
  myControl = new FormControl('');
  filteredOptions: Observable<any[]>;
  selectedAttachement: File = null!;

  constructor(
    private UserService:PartientService,
    private roleService: RolePermissionService,
    private dialogRef: MatDialogRef<AddpartientComponent>) {

  }

  ngOnInit(): void {
    this.configForm();
    if(this.data){
      this.id = this.data.id;
      this.getUser(this.id);
    }

  }

  ngOnDestroy(): void {
    this.onDestroy.next()
  }

  onClose() {
    this.dialogRef.close(false)
  }

  configForm(){
    this.userForm = new FormGroup({
      name: new FormControl(null, Validators.required ),
      gender: new FormControl(null, Validators.required),
      location: new FormControl(null, Validators.required),
      phone: new FormControl(null, [
        Validators.required,
        // Validators.pattern(/^\+255\d{9}$/) // Regex to validate +255 followed by 9 digits
      ]),

      position: new FormControl(null, Validators.required),
      job: new FormControl(null, Validators.required),

      referral_letter_file: new FormControl(null, [Validators.required,]),

      date_of_birth: new FormControl(null, Validators.required),

    });
  }






  getUser(id: any) {
    this.UserService.getPartientById(id).subscribe(response=>{
      if(response.statusCode == 200){
        this.user = response.data[0];
        this.userForm.patchValue(this.user);

      }
      else{
        Swal.fire({
          title: "error",
          text: response.message,
          icon: "error",
          confirmButtonColor: "#4690eb",
          confirmButtonText: "Close"
        });
      }
    })
  }

  // saveUser(){


  //   if(this.userForm.valid){
  //     this.UserService.addPartient(this.userForm.value).subscribe(response=>{
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

  updateUser(){
    if(this.userForm.valid){

      this.UserService.updatePartient(this.userForm.value,this.id).subscribe(response=>{
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

  onAttachementSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedAttachement = input.files[0];
      this.userForm.get('referral_letter_file')?.setValue(this.selectedAttachement.name);
      this.userForm.get('referral_letter_file')?.updateValueAndValidity();
    }
  }


  saveUser() {
    if (this.userForm.valid) {
      const formData = new FormData();

      // Append all fields from the form to FormData
      Object.keys(this.userForm.controls).forEach(key => {
        if (key === 'referral_letter_file') {
          formData.append(key, this.selectedAttachement); // append actual file
        } else {
          formData.append(key, this.userForm.get(key)?.value);
        }
      });

      this.UserService.addPartient(formData).subscribe(response => {
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



  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Handle the file (e.g., store it, upload it, etc.)
      console.log(file.name);
    }
  }

}
