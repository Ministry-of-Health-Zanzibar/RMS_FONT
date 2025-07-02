import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { ReferralService } from '../../../services/Referral/referral.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-referral-status-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './referral-status-dialog.component.html',
  styleUrl: './referral-status-dialog.component.scss'
})
export class ReferralStatusDialogComponent {
  private readonly onDestroy = new Subject<void>()
    readonly data = inject<any>(MAT_DIALOG_DATA);
    public sidebarVisible:boolean = true

  statusForm: FormGroup;
  id:number;

  constructor(
    public referralsService:ReferralService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ReferralStatusDialogComponent>,

    // @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }




   ngOnInit(): void {
      this.configForm();
      if(this.data){
        console.log("Referral  ya kwanza  ", this.data.data);
        this.id = this.data.data.referral_id;
      console.log("Referral   here  ",this.id);
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
      this.statusForm = new FormGroup({
        referral_id: new FormControl(this.id),
      
        status: new FormControl(null, [Validators.required, ]),
        letter_text: new FormControl(null, [Validators.required, ]),


      });
    }


    saveReferralLetter() {
      if (this.statusForm.valid) {
        const formData = {
          ...this.statusForm.value,
          referral_id: this.id  // override in case it was not set in form
        };

        this.referralsService.addReferralLetter(formData).subscribe(response => {
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
