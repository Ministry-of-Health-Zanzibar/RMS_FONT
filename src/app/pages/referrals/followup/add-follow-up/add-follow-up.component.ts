
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
import { FollowsService } from '../../../../services/Referral/follows.service';

@Component({
  selector: 'app-add-follow-up',
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
  templateUrl: './add-follow-up.component.html',
  styleUrl: './add-follow-up.component.scss'
})
export class AddFollowUpComponent {

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

    private followServices:FollowsService,

    private dialogRef: MatDialogRef<AddFollowUpComponent>)
    {

  }

  ngOnInit(): void {
    this.configForm();
    if(this.data){
      this.id = this.data.id;
   // console.log("partient   here  ",this.id);
    }
 

  }



  ngOnDestroy(): void {
    this.onDestroy.next()
  }

  onClose() {
    this.dialogRef.close(false)
  }

  configForm(){
    this.patientForm = new FormGroup({
          referral_id: new FormControl(this.id),

          content_summary: new FormControl(null, [Validators.required]),
           next_appointment_date: new FormControl(null, Validators.required),
           outcome: new FormControl(null, Validators.required),
           received_date: new FormControl(null, Validators.required),
           letter_file: new FormControl(null, Validators.required),


    });
  }

   onAttachmentSelected(event: any): void {
    const file = event.target.files?.[0] ?? null;
    if (file) {
      this.patientForm.patchValue({ letter_file: file.name });
      this.selectedAttachement = file;
    }
  }



saveClient() {
  if (this.patientForm.valid) {
    const formData = new FormData();

    // ✅ append the actual file
    if (this.selectedAttachement) {
      formData.append('letter_file', this.selectedAttachement, this.selectedAttachement.name);
    }

    // append patient_list_id explicitly
    formData.append('referral_id', this.id);

    this.followServices.addFollowform(formData).subscribe(response => {
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
