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
import { LocationService } from '../../../services/system-configuration/location.service';

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

    MatError,
    ReactiveFormsModule,

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
   locations: any;
   options: any[] = [];
  myControl = new FormControl('');
  filteredOptions: Observable<any[]>;
  selectedAttachement: File | null = null;



  constructor(

    private insurance:PartientService,
    private locationService: LocationService,
    private dialogRef: MatDialogRef<InsuranceComponent>)
    {

  }

  ngOnInit(): void {
    this.configForm();
    if(this.data){
      this.id = this.data.id;
   // console.log("partient   here  ",this.id);
    }
    this.getLocation();
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
           location: new FormControl(null, ),
          //  location: new FormControl(null, Validators.required),
           phone: new FormControl(null, Validators.required),
           job: new FormControl(null,),
           position: new FormControl(null,),
           date_of_birth: new FormControl(null, Validators.required),
           patient_file: new FormControl(null, Validators.required),


    });
  }

   onAttachmentSelected(event: any): void {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.patientForm.patchValue({ patient_file: file.name });
      this.selectedAttachement = file;
    }
  }

   getLocation() {
    this.locationService.getLocation().subscribe(response => {
      this.locations = response.data;

      this.options = response.data;
      this.filteredOptions = this.patientForm.get('location_id')!.valueChanges.pipe(
        startWith(''),
        map((value: any) => typeof value === 'string' ? this._filter(value) : this.options.slice())
      );
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().includes(filterValue));
  }

  displayFn(option: any): string {
    return option ? option.label : '';
  }

  trackById(index: number, option: any): any {
    return option.location_id;
  }

saveClient() {
  if (this.patientForm.valid) {
    const formData = new FormData();

    // append normal form values except patient_file
    Object.keys(this.patientForm.value).forEach(key => {
      if (key !== 'patient_file') {
        formData.append(key, this.patientForm.value[key]);
      }
    });

    // ✅ append the actual file
    if (this.selectedAttachement) {
      formData.append('patient_file', this.selectedAttachement, this.selectedAttachement.name);
    }

    // append patient_list_id explicitly
    formData.append('patient_list_id', this.id);

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



  // saveClient() {
  //   if (this.patientForm.valid) {
  //     const formData = {
  //       ...this.patientForm.value,
  //       patient_list_id: this.id  // override in case it was not set in form
  //     };

  //     this.insurance.addPatientfromBodyList(formData).subscribe(response => {
  //       if (response.statusCode === 201) {
  //         Swal.fire({
  //           title: "Success",
  //           text: response.message,
  //           icon: "success",
  //           confirmButtonColor: "#4690eb",
  //           confirmButtonText: "Continue"
  //         });
  //       } else {
  //         Swal.fire({
  //           title: "Error",
  //           text: response.message,
  //           icon: "error",
  //           confirmButtonColor: "#4690eb",
  //           confirmButtonText: "Close"
  //         });
  //       }
  //     });
  //   }
  // }






}
