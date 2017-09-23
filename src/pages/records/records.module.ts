import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecordsPage } from './records';

@NgModule({
  declarations: [
      RecordsPage,
  ],
  imports: [
    IonicPageModule.forChild(RecordsPage),
  ],
  exports: [
      RecordsPage
  ]
})
export class RecordsModule {}
