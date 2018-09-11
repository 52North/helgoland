import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: 'info',
    component: InfoViewComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  declarations: [
    InfoViewComponent,
  ],
  providers: [
  ]
})
export class InfoModule { }
