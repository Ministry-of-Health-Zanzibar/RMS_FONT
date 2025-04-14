import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { Router } from 'express';
import { Subject, takeUntil } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatMiniFabButton, MatIconButton, MatAnchor, MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { VDividerComponent } from '@elementar/components';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PermissionService } from '../../../services/authentication/permission.service';
import { ReferralService } from '../../../services/Referral/referral.service';
import { AddReferralsComponent } from '../add-referrals/add-referrals.component';

@Component({
  selector: 'app-view-referrals',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDivider,
    MatIcon,
    MatMiniFabButton,
    MatIconButton,
    VDividerComponent,
    MatTooltip,
    MatSlideToggleModule,
    FormsModule,
    MatAnchor,
    MatButton,
    RouterLink,
  ],
  templateUrl: './view-referrals.component.html',
  styleUrl: './view-referrals.component.scss'
})
export class ViewReferralsComponent implements OnInit,OnDestroy{


   private readonly onDestroy = new Subject<void>()
    
      displayedColumns: string[] = 
      ['id', 'patient_id', 'referral_type_id',
      'hospital_id', 'reason_id','start_date', 'end_date', 'status', 'action'];
      dataSource: MatTableDataSource<any> = new MatTableDataSource();
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;
    
    
      constructor(public permission: PermissionService,
        public referralService:ReferralService,
        private route:Router,
        private dialog: MatDialog
        ){}
    
      ngOnInit(): void {
        this.getReferrals();
      }
      ngOnDestroy(): void {
        this.onDestroy.next()
      }
      renew(){
        this.getReferrals();
      }
    
      getReferrals() {
        this.referralService.getAllRefferal().pipe(takeUntil(this.onDestroy)).subscribe((response: any)=>{
          if(response.statusCode==200){
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }if(response.statusCode==401){
            this.route.navigateByUrl("/")
            console.log(response.message)
          }
        },(error)=>{
          this.route.navigateByUrl("/")
          console.log('country getAway api fail to load')
        })
      }
    
    
      applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
    
      addReferrals() {
        let config = new MatDialogConfig()
        config.disableClose = false
        config.role = 'dialog'
        config.maxWidth ='100vw'
        config.maxHeight = '100vh'
        config.width = '850px'
        config.panelClass = 'full-screen-modal'
    
        const dialogRef = this.dialog.open(AddReferralsComponent,config);
    
        dialogRef.afterClosed().subscribe(result => {
          this.getReferrals();
        });
      }
    
      // updateDepartment(id: any) {
      //   let config = new MatDialogConfig()
      //   config.disableClose = false
      //   config.role = 'dialog'
      //   config.maxWidth ='100vw'
      //   config.maxHeight = '100vh'
      //   config.width = '850px'
      //   config.panelClass = 'full-screen-modal'
      //   config.data = {id: id}
    
      //   const dialogRef = this.dialog.open(AddDepartmentComponent,config);
    
      //   dialogRef.afterClosed().subscribe(result => {
      //     this.getDepartment();
      //   });
      // }
    
      // downloadFile(filename: string): void {
      //   const link = document.createElement('a');
      //   link.href = `assets/file/${filename}`;
      //   link.download = filename;
      //   link.click();
      // }
    
      // uploadFile(): void {
      //   let config = new MatDialogConfig()
      //   config.disableClose = false
      //   config.role = 'dialog'
      //   config.maxWidth ='100vw'
      //   config.maxHeight = '100vh'
      //   config.width = '850px'
      //   config.panelClass = 'full-screen-modal'
    
      //   const dialogRef = this.dialog.open(UploadDepartmentComponent,config);
    
      //   dialogRef.afterClosed().subscribe(result => {
      //     this.getDepartment();
      //   });
      // }
    
      // confirmBlock(data:any){
      //   var message;
      //   if(data.deleted_at){
      //     message = 'Are you sure you want to unblock'
      //   }
      //   else{
      //     message = 'Are you sure you want to block'
      //   }
      //   Swal.fire({
      //     title: "Confirm",
      //     html: message + ' <b> ' + data.department_name + ' </b> ',
      //     icon: "warning",
      //     confirmButtonColor: "#4690eb",
      //     confirmButtonText: "Confirm",
      //     cancelButtonColor: "#D5D8DC",
      //     cancelButtonText: "Cancel",
      //     showCancelButton: true
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       this.blockDepartment(data.department_id, data.deleted_at);
      //     }
      //     else{
      //       this.getDepartment();
      //     }
      //   });
      // }
    
      // blockDepartment(id: any, deleted: any): void{
      //   if(deleted){
      //     this.departmentService.unblockDepartment(id).subscribe(response=>{
      //       if(response.statusCode == 201){
      //         Swal.fire({
      //           title: "Success",
      //           text: response.message,
      //           icon: "success",
      //           confirmButtonColor: "#4690eb",
      //           confirmButtonText: "Continue"
      //         });
      //         this.getDepartment();
      //       }else{
      //         Swal.fire({
      //           title: "Error",
      //           text: response.message,
      //           icon: "error",
      //           confirmButtonColor: "#4690eb",
      //           confirmButtonText: "Continue"
      //         });
      //       }
      //     })
      //   }else{
      //     this.departmentService.deleteDepartment(id).subscribe(response=>{
      //       if(response.statusCode == 201){
      //         Swal.fire({
      //           title: "Success",
      //           text: response.message,
      //           icon: "success",
      //           confirmButtonColor: "#4690eb",
      //           confirmButtonText: "Continue"
      //         });
      //         this.getDepartment()
      //       }else{
      //         Swal.fire({
      //           title: "Error",
      //           text: response.message,
      //           icon: "error",
      //           confirmButtonColor: "#4690eb",
      //           confirmButtonText: "Continue"
      //         });
      //       }
      //     });
      //   }
      // }
    

}
