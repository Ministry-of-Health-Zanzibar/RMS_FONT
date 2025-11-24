
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule} from "@angular/material/form-field";

import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forwarddialog',
  standalone: true,
  imports: [
     MatDialogModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  ReactiveFormsModule,
  FormsModule,
  MatIcon
],
  templateUrl: './forwarddialog.component.html',
  styleUrl: './forwarddialog.component.scss'
})
export class ForwarddialogComponent {
  form!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ForwarddialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      mkurugenzi_tiba_comments: ['', Validators.required]
    });
  }

  // ✔ THIS is the correct method. Only returns form data to parent.
  submit() {
    if (this.form.invalid) return;

    // Return only the comment
    this.dialogRef.close({
      mkurugenzi_tiba_comments: this.form.value.mkurugenzi_tiba_comments
    });
  }

  close() {
    this.dialogRef.close();
  }
}
