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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralsRoutingModule { }
