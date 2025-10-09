import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Observable, Subject, takeUntil, startWith, map } from 'rxjs';
import Swal from 'sweetalert2';
import { PartientService } from '../../../services/partient/partient.service';
import { LocationService } from '../../../services/system-configuration/location.service';
import {
  AddpartientComponent,
  AddPatientDialogData,
} from '../addpartient/addpartient.component';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-partient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardSubtitle,
    FormsModule,
    MatRadioModule,
  ],
  templateUrl: './partient-form.component.html',
  styleUrl: './partient-form.component.scss',
})
export class PartientFormComponent implements OnInit, OnDestroy {
  patientForm: FormGroup;
  loading = false;
  selectedFile: File | null = null;

  locations: any[] = [];
  options: any[] = [];
  boardList: any[] = [];
  filteredBoardList: any[] = [];
  filteredOptions!: Observable<any[]>;

  boardSearchControl = new FormControl('');
  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private patientService: PartientService,
    private locationService: LocationService,
    public dialogRef: MatDialogRef<AddpartientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      gender: ['', Validators.required],
      job: [''],
      position: [''],
      dob_type: ['known'],
      date_of_birth: [null],
      location_id: ['', Validators.required],
      matibabu_card: [''],
      patient_file: [null],
      patient_list_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBoardList();
    this.loadLocations();

    this.boardSearchControl.valueChanges
      .pipe(startWith(''))
      .subscribe((value) => {
        const filterValue = value ? value.toLowerCase() : '';
        this.filteredBoardList = this.boardList.filter((board) =>
          board.patient_list_title.toLowerCase().includes(filterValue)
        );
      });

    if (this.data && this.data.patient) {
      this.patchFormForEdit(this.data.patient);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  private loadBoardList() {
    this.loading = true;
    this.patientService.getAllBodyList().subscribe(
      (response: any) => {
        this.loading = false;
        if (response.data) {
          this.boardList = response.data;
          this.filteredBoardList = [...this.boardList];
        } else {
          this.boardList = [];
          this.filteredBoardList = [];
        }
      },
      (error) => {
        this.loading = false;
        console.log('Failed to load board list', error);
      }
    );
  }

  private loadLocations() {
    this.locationService.getLocation().subscribe({
      next: (res: any) => {
        this.locations = res.data;
        this.options = res.data;
        this.filteredOptions = this.patientForm
          .get('location_id')!
          .valueChanges.pipe(
            startWith(''),
            map((value: any) =>
              typeof value === 'string' ? value : value?.label
            ),
            map((name: string) =>
              name ? this._filter(name) : this.options.slice()
            )
          );
      },
      error: (err) => console.error('Failed to load locations', err),
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: any): string {
    return option ? option.label : '';
  }

  trackById(index: number, option: any): any {
    return option.location_id;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.patientForm.patchValue({ patient_file: file });
      this.patientForm.get('patient_file')?.updateValueAndValidity();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private formatDate(value: Date | string | number, dobType: string): string {
    if (dobType === 'known') {
      const d = new Date(value);
      const year = d.getFullYear();
      const month = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } else if (dobType === 'unknown') {
      return String(value);
    }
    return '';
  }

  /**  Populate form when editing */
  // private patchFormForEdit(patient: any) {
  //   this.patientForm.patchValue({
  //     name: patient.name || '',
  //     phone: patient.phone || '',
  //     gender: patient.gender || '',
  //     job: patient.job || '',
  //     position: patient.position || '',
  //     dob_type: patient.dob_type || 'known',
  //     date_of_birth: patient.date_of_birth ? new Date(patient.date_of_birth) : null,
  //     location_id: patient.location
  //       ? patient.location.location_id
  //         ? patient.location
  //         : patient.location_id
  //       : '',
  //     matibabu_card: patient.matibabu_card || '',
  //     patient_list_id: patient.patient_list_id || '',
  //       patient_file_name: patient.patient_file_name || '',
  //   });
  // }

  private patchFormForEdit(patient: any) {
    this.patientForm.patchValue({
      name: patient.name || '',
      phone: patient.phone || '',
      gender: patient.gender || '',
      job: patient.job || '',
      position: patient.position || '',
      dob_type: patient.dob_type || 'known',
      date_of_birth: patient.date_of_birth
        ? new Date(patient.date_of_birth)
        : null,
      location_id:
        this.options.find(
          (loc) =>
            loc.location_id ===
            (patient.location?.location_id || patient.location_id)
        ) || '', // ensures autocomplete sees the object
      matibabu_card: patient.matibabu_card || '',
      patient_list_id: patient.patient_list_id || '',
      // File cannot be set programmatically, see below
    });
  }

  onSubmit() {
    if (this.patientForm.invalid) return;

    this.loading = true;
    const formValue = this.patientForm.value;
    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('phone', formValue.phone);
    formData.append('gender', formValue.gender);
    formData.append('job', formValue.job || '');
    formData.append('position', formValue.position || '');
    formData.append('matibabu_card', formValue.matibabu_card || '');
    formData.append('patient_list_id', formValue.patient_list_id);
    formData.append(
      'date_of_birth',
      this.formatDate(formValue.date_of_birth, formValue.dob_type)
    );
    const location = formValue.location_id;
    formData.append(
      'location_id',
      typeof location === 'object' ? location.location_id : location
    );
    if (this.selectedFile) {
      formData.append(
        'patient_file',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    if (this.data && this.data.patient && this.data.patient.id) {
      this.patientService
        .updatePartient(this.data.patient.id, formData)
        .subscribe({
          next: (res) => {
            this.loading = false;
            Swal.fire('Updated', 'Patient updated successfully', 'success');
            this.dialogRef.close(res);
          },
          error: (err) => {
            this.loading = false;
            Swal.fire(
              'Error',
              err.error?.message || 'Failed to update patient',
              'error'
            );
          },
        });
    } else {
      this.patientService.addPartient(formData).subscribe({
        next: (res) => {
          this.loading = false;
          Swal.fire('Success', 'Patient saved successfully', 'success');
          this.dialogRef.close(res);
        },
        error: (err) => {
          this.loading = false;
          Swal.fire(
            'Error',
            err.error?.message || 'Failed to save patient',
            'error'
          );
        },
      });
    }
  }
}
