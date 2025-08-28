import { PartientService } from './../../../services/partient/partient.service';
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

@Component({
  selector: 'app-insurance',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatLabel,
    MatDialogModule,
    MatCheckbox,
    MatError,
    ReactiveFormsModule,
    HDividerComponent,
    MatAutocompleteModule,
    MatSelect,
    MatDatepickerModule,
  ],
  templateUrl: './insurance.component.html',
  styleUrl: './insurance.component.scss'
})
export class InsuranceComponent {

  private readonly onDestroy = new Subject<void>()
  readonly data = inject<any>(MAT_DIALOG_DATA);
  public sidebarVisible:boolean = true

  patientForm: FormGroup;
  user: any;
  id: any;

  constructor(

    private insurance:PartientService,
    private dialogRef: MatDialogRef<InsuranceComponent>)
    {

  }

  ngOnInit(): void {
    this.configForm();
    if(this.data){
      this.id = this.data.id;
   // console.log("partient   here  ",this.id);
    }
   // this.viewUser();

  }



  ngOnDestroy(): void {
    this.onDestroy.next()
  }

  onClose() {
    this.dialogRef.close(false)
  }

  configForm(){
    this.patientForm = new FormGroup({
          patient_list_id: new FormControl(this.id),

          name: new FormControl(null, [Validators.required]),
           gender: new FormControl(null, Validators.required),
           location: new FormControl(null, Validators.required),
           phone: new FormControl(null, Validators.required),
           job: new FormControl(null, Validators.required),
           position: new FormControl(null, Validators.required),
           date_of_birth: new FormControl(null, Validators.required),


    });
  }


  saveClient() {
    if (this.patientForm.valid) {
      const formData = {
        ...this.patientForm.value,
        patient_list_id: this.id  // override in case it was not set in form
      };

      this.insurance.addPatientfromBodyList(formData).subscribe(response => {
        if (response.statusCode === 201) {
          Swal.fire({
            title: "Success",
            text: response.message,
            icon: "success",
            confirmButtonColor: "#4690eb",
            confirmButtonText: "Continue"
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






}
