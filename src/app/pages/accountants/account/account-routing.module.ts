import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'source',
    loadComponent:()=>import('./viewsource/viewsource.component').then(c=>c.ViewsourceComponent)
  },
  {
    path:'sourceType',
    loadComponent:()=>import('./view-source-type/view-source-type.component').then(c=>c.ViewSourceTypeComponent)
  },
  {
    path:'category',
    loadComponent:()=>import('./view-category/view-category.component').then(c=>c.ViewCategoryComponent)
  },
  {
    path:'documentCategory',
    loadComponent:()=>import('./document-type/document-type.component').then(c=>c.DocumentTypeComponent)
  },
  {
    path:'documentForm',
    loadComponent:()=>import('./documents/documents.component').then(c=>c.DocumentsComponent)
  },
  {
    path:'more/:id',
    loadComponent:()=>import('./displaymore/displaymore.component').then(c=>c.DisplaymoreComponent)
  },
  {
    path:'report',
    loadComponent:()=>import('./rangereport/rangereport.component').then(c=>c.RangereportComponent)

  },
  {
  path:'parameter-report',
  loadComponent:()=>import('./parameter-report/parameter-report.component').then(c=>c.ParameterReportComponent)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
