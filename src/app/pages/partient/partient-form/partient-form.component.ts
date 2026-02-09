import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, startWith, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { PartientService } from '../../../services/partient/partient.service';
import { LocationService } from '../../../services/system-configuration/location.service';
import { ReasonsService } from '../../../services/system-configuration/reasons.service';
import { DiagnosisService } from '../../../services/system-configuration/diagnosis.service';

@Component({
  selector: 'app-partient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatAutocompleteModule,
    MatSnackBarModule,
  ],
  templateUrl: './partient-form.component.html',
})
export class PartientFormComponent implements OnInit {
  patientForm!: FormGroup;
  loading = false;
  selectedFiles: File[] = [];

  locations: any[] = [];
  filteredOptions!: Observable<any[]>;

  reasonList: any[] = [];
  diagnosesList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PartientService,
    private locationService: LocationService,
    private reasonService: ReasonsService,
    private diagnosisService: DiagnosisService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PartientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      basicInfo: this.fb.group({
        name: ['', Validators.required],
        matibabu_card: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
        zan_id: [''],
        date_of_birth: ['', Validators.required],
        gender: ['', Validators.required],
        phone: [''],
        location_id: [''], // Set to null initially
        job: [''],
        position: [''],
      }),
      historyInfo: this.fb.group({
        referring_doctor: [''],
        file_number: [''],
        referring_date: [''],
        reason_id: ['', Validators.required],
        diagnosis_ids: [[]],
        case_type: ['Routine', Validators.required],
        history_of_presenting_illness: [''],
        physical_findings: [''],
        investigations: [''],
        management_done: [''],
      }),
      insuranceInfo: this.fb.group({
        has_insurance: [false, Validators.required],
        insurance_provider_name: [''],
        card_number: [''],
        valid_until: [''],
      }),
    });

    this.loadLocations();
    this.loadReasons();
    this.loadDiagnoses();
    this.listenToMatibabuCard();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) event.preventDefault();
  }

  // private listenToMatibabuCard() {
  //   this.patientForm.get('basicInfo.matibabu_card')?.valueChanges
  //     .pipe(debounceTime(300), distinctUntilChanged())
  //     .subscribe((value: string) => {
  //       if (value && value.length === 12) {
  //         this.checkEligibility(value);
  //       }
  //     });
  // }
  private listenToMatibabuCard() {
  this.patientForm.get('basicInfo.matibabu_card')?.valueChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((value: string) => {
      if (value && value.length === 12) {
        this.checkEligibility(value);
      } else {
        
        this.patientForm.get('basicInfo')?.patchValue({
          name: '',
          zan_id: '',
          date_of_birth: '',
          gender: '',
          phone: '',
          location_id: null,
          job: '',
          position: ''
        });
      }
    });
}


  private checkEligibility(matibabuCard: string) {
    this.patientService.searchPatientEligibility({ matibabu_card: matibabuCard }).subscribe({
      next: (res: any) => {
        const patient = res.data;
        this.snackBar.open(res.message || 'Patient is eligible', 'Close', { duration: 4000 });

        this.patientForm.get('basicInfo')?.patchValue({
          name: patient.name,
          zan_id: patient.zan_id,
          date_of_birth: patient.date_of_birth,
          gender: patient.gender === 'male' || patient.gender === 'Male' ? 'Male' : 'Female',
          phone: patient.phone,
          location_id: patient.location_id ? String(patient.location_id) : null, 
          job: patient.job,
          position: patient.position
        });
      },
      error: (err) => {
        if (err.status === 404) {
          this.snackBar.open(err.error?.message || 'No patient found', 'Close', { duration: 4000 });
        }
      }
    });
  }

  loadReasons() { this.reasonService.getAllReasons().subscribe({ next: (res: any) => this.reasonList = res.data || [] }); }
  loadDiagnoses() { this.diagnosisService.getAllDiagnosis().subscribe({ next: (res: any) => this.diagnosesList = res.data || [] }); }

  private loadLocations() {
    this.locationService.getLocation().subscribe({
      next: (res: any) => {
        this.locations = res.data || [];
        this.filteredOptions = this.patientForm.get('basicInfo.location_id')!.valueChanges.pipe(
          startWith(''),
          map(value => this._filterLocations(value))
        );
      }
    });
  }

  private _filterLocations(value: any): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.locations.filter(option => 
      option.label.toLowerCase().includes(filterValue)
    );
  }

  displayLocation(locationId: any): string {
    if (!locationId) return '';
    const loc = this.locations.find(l => l.location_id === locationId);
    return loc ? loc.label : '';
  }

  onFileSelected(event: any) { 
    const files = event.target.files; 
    if (files.length > 0) this.selectedFiles = [files[0]]; 
  }

  private formatDate(value: any): string { 
    if (!value) return ''; 
    const d = new Date(value);
    return d.toISOString().split('T')[0]; 
  }

  onSubmit() {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { basicInfo, historyInfo, insuranceInfo } = this.patientForm.value;
    const formData = new FormData();

    Object.keys(basicInfo).forEach(key => {
      let val = basicInfo[key];
      if (val !== null && val !== '') {
        if (key === 'date_of_birth') {
          formData.append(key, this.formatDate(val));
        } else if (key === 'location_id') {

          if (!isNaN(Number(val))) {
            formData.append(key, val.toString());
          }
        } else {
          formData.append(key, val);
        }
      }
    });

 
    Object.keys(historyInfo).forEach(key => {
      let val = historyInfo[key];
      if (val !== null && val !== '') {
        if (key === 'referring_date') {
          formData.append(key, this.formatDate(val));
        } else if (key === 'diagnosis_ids' && Array.isArray(val)) {
          val.forEach((id: any) => formData.append('diagnosis_ids[]', id));
        } else {
          formData.append(key, val);
        }
      }
    });

    
    Object.keys(insuranceInfo).forEach(key => {
      let val = insuranceInfo[key];
      if (key === 'has_insurance') {
        formData.append(key, val ? '1' : '0'); 
      } else if (val !== null && val !== '') {
        if (key === 'valid_until') {
            formData.append(key, this.formatDate(val));
        } else {
            formData.append(key, val);
        }
      }
    });

    if (this.selectedFiles.length > 0) {
      formData.append('history_file', this.selectedFiles[0]);
    }

    this.patientService.addPartient(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open('Patient saved successfully', 'Close', { duration: 4000 });
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading = false;
        
        const errorMsg = err.error?.errors?.location_id?.[0] || err.error?.message || 'Error occurred';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
      }
    });
  }

  onCancel() { this.dialogRef.close(); }
}