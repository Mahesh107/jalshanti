import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
//import { DatePicker } from '@ionic-native/date-picker';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SettingsPage } from '../pages/settings/settings';
import { RatesPage } from '../pages/rates/rates';
import { RecordsPage } from '../pages/records/records';
import { Stock } from '../pages/stock/stock';
import { AboutPage } from '../pages/about/about';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    SettingsPage,
    RatesPage,
    RecordsPage,
    Stock,
    AboutPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SettingsPage,
    RatesPage,
    RecordsPage,
    Stock,
    AboutPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
