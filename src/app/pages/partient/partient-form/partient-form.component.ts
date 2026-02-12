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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
    MatSnackBarModule,
  ],
  templateUrl: './partient-form.component.html',
})
export class PartientFormComponent implements OnInit {

  patientForm!: FormGroup;
  loading = false;
  selectedFile!: File | null;

  locations: any[] = [];
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
        location_id: [null, Validators.required],
        job: [''],
        position: [''],
      }),
      historyInfo: this.fb.group({
        referring_doctor: [''],
        file_number: [''],
        referring_date: [''],
        reason_id: [null, Validators.required],
        diagnosis_ids: [[]],
        case_type: ['Routine', Validators.required],
        history_of_presenting_illness: [''],
        physical_findings: [''],
        investigations: [''],
        management_done: [''],
      }),
      insuranceInfo: this.fb.group({
        has_insurance: [false],
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
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  private listenToMatibabuCard() {
    this.patientForm.get('basicInfo.matibabu_card')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: string) => {

        if (value?.length === 12) {
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
          }, { emitEvent: false });
        }
      });
  }

  private checkEligibility(matibabuCard: string) {
    this.patientService.searchPatientEligibility({ matibabu_card: matibabuCard })
      .subscribe({
        next: (res: any) => {
          const patient = res.data;

          this.snackBar.open(res.message || 'Patient is eligible', 'Close', { duration: 4000 });

          this.patientForm.get('basicInfo')?.patchValue({
            name: patient?.name || '',
            zan_id: patient?.zan_id || '',
            date_of_birth: patient?.date_of_birth || '',
            gender: patient?.gender === 'male' ? 'Male' : 'Female',
            phone: patient?.phone || '',
            location_id: patient?.location_id ?? null,
            job: patient?.job || '',
            position: patient?.position || '',
          });
        },
        error: (err) => {
          this.snackBar.open(
            err?.error?.message || 'No patient found',
            'Close',
            { duration: 4000 }
          );
        }
      });
  }

  loadLocations() {
    this.locationService.getLocation().subscribe({
      next: (res: any) => this.locations = res.data || []
    });
  }

  loadReasons() {
    this.reasonService.getAllReasons()
      .subscribe(res => this.reasonList = res.data || []);
  }

  loadDiagnoses() {
    this.diagnosisService.getAllDiagnosis()
      .subscribe(res => this.diagnosesList = res.data || []);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ? file : null;
  }

  private formatDate(value: any): string {
    if (!value) return '';
    return new Date(value).toISOString().split('T')[0];
  }

  onSubmit() {

    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formData = new FormData();
    const { basicInfo, historyInfo, insuranceInfo } = this.patientForm.value;

    // BASIC INFO
    Object.keys(basicInfo).forEach(key => {
      let value = basicInfo[key];
      if (value !== null && value !== '') {
        formData.append(
          key,
          key === 'date_of_birth' ? this.formatDate(value) : value
        );
      }
    });

    // HISTORY INFO
    Object.keys(historyInfo).forEach(key => {
      let value = historyInfo[key];

      if (value !== null && value !== '') {

        if (key === 'referring_date') {
          formData.append(key, this.formatDate(value));
        }
        else if (key === 'diagnosis_ids') {
          value.forEach((id: any) =>
            formData.append('diagnosis_ids[]', id)
          );
        }
        else {
          formData.append(key, value);
        }
      }
    });

    // INSURANCE INFO
    Object.keys(insuranceInfo).forEach(key => {
      let value = insuranceInfo[key];

      if (key === 'has_insurance') {
        formData.append(key, value ? '1' : '0');
      }
      else if (value) {
        formData.append(
          key,
          key === 'valid_until' ? this.formatDate(value) : value
        );
      }
    });

    // FILE (IMPORTANT)
    if (this.selectedFile) {
      formData.append('medical_history_file', this.selectedFile);
    
    }

    this.patientService.addPartient(formData).subscribe({
      next: (res) => {
        this.loading = false;
        this.snackBar.open('Patient saved successfully', 'Close', { duration: 4000 });
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(
          err?.error?.message || 'Error occurred',
          'Close',
          { duration: 5000 }
        );
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
