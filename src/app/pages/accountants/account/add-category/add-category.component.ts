import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { HDividerComponent } from '@elementar/components';
import { Subject, takeUntil } from 'rxjs';
import { GlobalConstants } from '@shared/global-constants';
import Swal from 'sweetalert2';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CategoryService } from '../../../../services/accountants/category.service';

@Component({
  selector: 'app-add-category',
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
    AsyncPipe,
    MatDatepickerModule,
  ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {

 readonly data = inject<any>(MAT_DIALOG_DATA);
    private readonly onDestroy = new Subject<void>()
    public sidebarVisible:boolean = true

    categoryForm: FormGroup;
    parent: any;
    uploadProgress: number = 0;
    uploading: boolean = false;
    errorMessage: string | null = null;
    categoryData: any;
    category:any;

    constructor(private formBuilder:FormBuilder,

      public categoryServices:CategoryService,
      private dialogRef: MatDialogRef<AddCategoryComponent>) {
    }


    ngOnInit(): void {
        if(this.data){
          this.categoryData = this.data.data;
         // this.getcategory(this.id);
        }
        this.configForm();
      }

      ngOnDestroy(): void {
        this.onDestroy.next()
      }
      onClose() {
        this.dialogRef.close(false)
      }

      configForm(){
        this.categoryForm = new FormGroup({
          category_name: new FormControl(null, [Validators.required,]),


        });
        if(this.categoryData){
          this.categoryForm.patchValue(this.categoryData);
        }
      }

      savecategory(){
        if(this.categoryForm.valid){
          this.categoryServices.addCategory(this.categoryForm.value).subscribe(response=>{
            if(response.statusCode == 201){
              Swal.fire({
                title: "Success",
                text: "Data saved successfull",
                icon: "success",
                confirmButtonColor: "#4690eb",
                confirmButtonText: "Continue"
              });
            }else{
              Swal.fire({
                title: "Error",
                text: response.message,
                icon: "error",
                confirmButtonColor: "#4690eb",
                confirmButtonText: "Continue"
              });
            }
          }

        );
        }else{

        }
      }

      updatecategory(){
        if(this.categoryForm.valid){
          this.categoryServices.updateCategory(this.categoryForm.value, this.categoryData.category_id).subscribe(response=>{
            if(response.statusCode == 200){
              Swal.fire({
                title: "Success",
                text: "Data saved successfull",
                icon: "success",
                confirmButtonColor: "#4690eb",
                confirmButtonText: "Continue"
              });
            }else{
              Swal.fire({
                title: "Error",
                text: response.message,
                icon: "error",
                confirmButtonColor: "#4690eb",
                confirmButtonText: "Continue"
              });
            }
          }

        );
        }else{

        }
      }

}

