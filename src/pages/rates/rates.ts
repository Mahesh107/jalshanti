import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-rates',
    templateUrl: 'rates.html'
})
export class RatesPage {

    newCopperRate : any;
    oldCopperRate : any;

    NCR;
    OCR;



    saveRates(){
            this.rateStorage.set('rates', {newCopperRate: this.newCopperRate, oldCopperRate: this.oldCopperRate})
                .then(
                (data) => this.fetchRates()
            );
            console.log('New rates saved!');
            this.presentSaveToast();



    }

    //fetched : boolean = false;

    fetchRates(){
        this.rateStorage.get('rates')
            .then(
            (data) =>{
                if(data != null){
                this.NCR = data.newCopperRate;
                this.OCR = data.oldCopperRate;
                console.log('rates.ts :: fetchRates() :: rates fetched : '+JSON.stringify(data));
                }
            });
    }

    clearFields(){
        this.newCopperRate = '';
        this.oldCopperRate = '';
        this.presentClearToast();
    }


    presentSaveToast() {
        let toast = this.toastCtrl.create({
            message: 'New Rates Saved!',
            duration: 2000,
            position : 'bottom'
        });
        toast.present();
    }

    presentClearToast() {
        let toast = this.toastCtrl.create({
            message: 'cleared!',
            duration: 2000,
            position : 'bottom'
        });
        toast.present();
    }

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        // this.noRatesDefined(); TODO
        this.clearFields()
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 1000);
    }

    constructor(public navCtrl: NavController, public toastCtrl: ToastController, public rateStorage: Storage) {

        this.fetchRates();

    }

}
