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
    path:'more/:id',
    loadComponent:()=>import('./referral-details/referral-details.component').then(c=>c.ReferralDetailsComponent)
  },
  {
    path:'dialog',
    loadComponent:()=>import('./referral-status-dialog/referral-status-dialog.component').then(c=>c.ReferralStatusDialogComponent)
  },

  {
    path:'referralsLetter',
    loadComponent:()=>import('./referrals-letter/referrals-letter.component').then(c=>c.ReferralsLetterComponent)
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule { }
