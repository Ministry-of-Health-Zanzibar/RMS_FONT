import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    loadComponent:()=>import('./viewpartient/viewpartient.component').then(c=>c.ViewpartientComponent)
  },
  {
    path:'insurances0000011111',
    loadComponent:()=>import('./viewinsurances/viewinsurances.component').then(c=>c.ViewinsurancesComponent)

  },
  {
    path:'more/:id',
    loadComponent:()=>import('./displaymoredata/displaymoredata.component').then(c=>c.DisplaymoredataComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartientRoutingModule { }
