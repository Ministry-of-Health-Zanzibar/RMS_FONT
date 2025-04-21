import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path:'',
  //   loadComponent:()=>import('./view-referal-type/view-referal-type.component').then(c=>c.ViewReferalTypeComponent)
  // }

  {
    path:'',
    loadComponent:()=>import('./view-referrals/view-referrals.component').then(c=>c.ViewReferralsComponent)
  },
  {
    path:'bill',
    loadComponent:()=>import('./referralwithbills/referralwithbills.component').then(c=>c.ReferralwithbillsComponent)

  },
  {
    path:'more/:id',
    loadComponent:()=>import('./referral-details/referral-details.component').then(c=>c.ReferralDetailsComponent)
  },
  {
    path:'dialog',
    loadComponent:()=>import('./referral-status-dialog/referral-status-dialog.component').then(c=>c.ReferralStatusDialogComponent)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule { }
