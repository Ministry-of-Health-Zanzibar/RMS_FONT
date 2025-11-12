import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
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
import { Observable, Subject, startWith, map } from 'rxjs';
import Swal from 'sweetalert2';
import { PartientService } from '../../../services/partient/partient.service';
import { LocationService } from '../../../services/system-configuration/location.service';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';

@Component({
  selector: 'app-partient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    MatRadioModule,
  ],
  templateUrl: './partient-form.component.html',
  styleUrls: ['./partient-form.component.scss'],
})
export class PartientFormComponent implements OnInit, OnDestroy {
  patientForm!: FormGroup;
  loading = false;
  selectedFile: File | null = null;
  currentFileName: string | null = null;
  currentFilePath: string | null = null;

  locations: any[] = [];
  filteredOptions!: Observable<any[]>;
  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private patientService: PartientService,
    private locationService: LocationService,
    private router: Router,
    public dialogRef: MatDialogRef<PartientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
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
      zan_id: [''],
      has_insurance: [false, Validators.required],
      insurance_provider_name: [''],
      card_number: [''],
      valid_until: [''],
      patient_file: [null],
    });

    this.loadLocations();

    // patch for edit
    if (this.data?.patient) {
      this.patchFormForEdit(this.data.patient);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // Load locations
  private loadLocations() {
    this.locationService.getLocation().subscribe({
      next: (res: any) => {
        this.locations = res.data;
        this.filteredOptions = this.patientForm
          .get('location_id')!
          .valueChanges.pipe(
            startWith(''),
            map((value: any) =>
              typeof value === 'string' ? value : value?.label
            ),
            map((name: string) =>
              name ? this._filter(name) : this.locations.slice()
            )
          );
      },
      error: (err) => console.error('Failed to load locations', err),
    });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter((option) =>
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayFn(option: any): string {
    return option ? option.label : '';
  }

  trackById(index: number, option: any): any {
    return option.location_id;
  }

  // File upload handler
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.patientForm.patchValue({ patient_file: file });
    }
  }

  // Format DOB
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

  private patchFormForEdit(patient: any) {
    const locationObj = this.locations.find(
      (loc) =>
        loc.location_id ===
        (patient.geographical_location?.location_id || patient.location_id)
    );

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
      location_id: locationObj || '',
      matibabu_card: patient.matibabu_card || '',
      zan_id: patient.zan_id || '',
      has_insurance: !!patient.has_insurance,
      insurance_provider_name: patient.insurance_provider_name || '',
      card_number: patient.card_number || '',
      valid_until: patient.valid_until || '',
    });

    if (patient.files?.length) {
      this.currentFileName = patient.files[0].file_name;
      this.currentFilePath = patient.files[0].file_path;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.patientForm.invalid) return;

    this.loading = true;
    const formValue = this.patientForm.value;
    const formData = new FormData();

    // Append all fields
    Object.keys(formValue).forEach((key) => {
      if (key === 'location_id') {
        const loc = formValue.location_id;
        formData.append(
          'location_id',
          typeof loc === 'object' ? String(loc.location_id) : String(loc)
        );
      } else if (key === 'patient_file' && this.selectedFile) {
        formData.append('patient_file', this.selectedFile);
      } else {
        formData.append(key, formValue[key] ?? '');
      }
    });

    const patientId = this.data?.patient?.patient_id ?? null;

    if (patientId) {
      this.patientService.updatePartient(formData, patientId).subscribe({
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
