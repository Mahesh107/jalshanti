import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RatesPage } from '../rates/rates';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    NavRatesPage;

    constructor(public navCtrl: NavController) {
    this.NavRatesPage = RatesPage;

    }

}
