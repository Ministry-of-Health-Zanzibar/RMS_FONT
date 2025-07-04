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

  {
    path:'referralsLetter',
    loadComponent:()=>import('./referrals-letter/referrals-letter.component').then(c=>c.ReferralsLetterComponent)
  },
  {
    path:'confirm0000111101',
    loadComponent:()=>import('./view-referal-confirm/view-referal-confirm.component').then(c=>c.ViewReferalConfirmComponent)
  },
  {
    path:'billpayment2222200000',
    loadComponent:()=>import('./billpayment/billpayment.component').then(c=>c.BillpaymentComponent)
  },
  {
    path:'monthbill00998778',
    loadComponent:()=>import('./month-bill/month-bill.component').then(c=>c.MonthBillComponent)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule { }
