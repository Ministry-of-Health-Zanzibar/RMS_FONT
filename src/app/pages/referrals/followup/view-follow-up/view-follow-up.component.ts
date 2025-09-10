import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { PermissionService } from '../../../../services/authentication/permission.service';
import { PartientService } from '../../../../services/partient/partient.service';
import { FollowsService } from '../../../../services/Referral/follows.service';
import { AddFollowUpComponent } from '../add-follow-up/add-follow-up.component';



@Component({
  selector: 'app-view-follow-up',
  standalone: true,
  imports: [
     CommonModule,
       MatButtonModule,
       MatDialogModule,
       MatFormFieldModule,
       MatInputModule,
       MatCheckboxModule,
       ReactiveFormsModule,
        MatIconModule,    // ✅ Fixed
       MatDialogModule
  ],
  templateUrl: './view-follow-up.component.html',
  styleUrl: './view-follow-up.component.scss',

})
export class ViewFollowUpComponent implements OnInit {
  public displayRoleForm!: FormGroup;
  loading: boolean = false;
  followListId: string | null = null;
  follow: any = { data: [] };
  referralId: number | null = null;
  feedback: any = null;
  userRole: string | null = null;
  patientListInfo: any = null;   // ✅ to hold title + file

  constructor(
    private route: ActivatedRoute,
     public permission: PermissionService,
    private followService: FollowsService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.followListId = this.route.snapshot.paramMap.get('id'); // Get patient list ID from URL
    if (this.followListId) {
      this.getFeedbackById();

    }
  }



getFeedbackById() {
  this.loading = true;

  this.followService.getFollowListById(this.followListId).subscribe(
    (response: any) => {
      this.loading = false;

      if (response?.data) {
        this.follow = { data: response.data };

        // ✅ Get referralId from first record
        this.referralId = this.follow.data[0]?.referral_id;
        console.log("Referral ID:", this.referralId);
      } else {
        this.follow = { data: [] };
        this.referralId = null;
      }
    },
    (error) => {
      this.loading = false;
      console.error('Error fetching follow details:', error);
    }
  );
}

addFollow(referral_id: any) {
  console.log("Add follow for referral ID:", referral_id);
  let config = new MatDialogConfig();
  config.disableClose = false;
  config.role = 'dialog';
  config.maxWidth = '100vw';
  config.maxHeight = '100vh';
  config.width = '850px';
  config.panelClass = 'full-screen-modal';
  config.data = { referral_id };

  const dialogRef = this.dialog.open(AddFollowUpComponent, config);
 dialogRef.afterClosed().subscribe(result => {
    if (result === true) {   // only refresh if dialog was saved successfully
      this.getFeedbackById();
    }
  });
}


  extractFileName(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}
