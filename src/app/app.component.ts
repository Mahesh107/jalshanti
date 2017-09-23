import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RecordsPage } from '../pages/records/records';
import { Stock } from '../pages/stock/stock';
import { SettingsPage } from '../pages/settings/settings';
import { AboutPage } from '../pages/about/about';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private toastCtrl:   ToastController, private alertCtrl: AlertController) {
    this.initializeApp();
    this.callExitToast();



    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Customers', component: ListPage },
      { title: 'Records', component: RecordsPage },
      { title: 'Stock', component: Stock },
        { title: 'Settings', component: SettingsPage },
      { title: 'About', component: AboutPage },
    ];

  }

    callExitToast(){
        this.platform.ready().then(() => {
            this.platform.registerBackButtonAction(() => {


                //uncomment this and comment code below to to show toast and exit app
                // if (this.backButtonPressedOnceToExit) {
                //   this.platform.exitApp();
                // } else if (this.nav.canGoBack()) {
                //   this.nav.pop({});
                // } else {
                //   this.showToast();
                //   this.backButtonPressedOnceToExit = true;
                //   setTimeout(() => {

                //     this.backButtonPressedOnceToExit = false;
                //   },2000)
                // }


                /*let view = this.nav.getActive();
                if (view.component.name != "HomePage") {
                    this.nav.push('HomePage');
                }*/

                if (this.nav.canGoBack()) {
                    this.nav.pop();
                    } else {
                        if (this.alert) {
                            this.alert.dismiss();
                            this.alert = null;
                        } else {
                            this.showAlert();
                        }
                    }

            });
        });

    }
    alert;
    showAlert() {
        this.alert = this.alertCtrl.create({
            title: 'Exit?',
            message: 'Do you want to exit the app?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.alert =null;
                    }
                },
                {
                    text: 'Exit',
                    handler: () => {
                        this.platform.exitApp();
                    }
                }
            ]
        });
        this.alert.present();
    }

    showToast() {
        let toast = this.toastCtrl.create({
            message: 'Press Again to exit',
            duration: 2000,
            position: 'bottom'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }



  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
//      this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString('#DB8E0A');
      //this.statusBar.hide();
      this.splashScreen.hide();



    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
