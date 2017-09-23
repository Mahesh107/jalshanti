import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RatesPage } from '../rates/rates';
import { ToastController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Stock } from '../stock/stock';
//import { DatePicker } from '@ionic-native/date-picker';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers: [RatesPage, Stock]
})
export class HomePage {

    wtInKg = true;
    insulator = true;
    newCopperWt;
    oldCopperWt;
    payableAmount;
    acceptableAmount;
    billMessage = '';
    currency = '';
    billTitle = '';
    defaultCardMsg = 'Bill will be generated here';
    cardColor = 'card-grey';
    OCWeight;
    NCWeight;
    newCRate;
    oldCRate : any;
    readyToGo;
    item;
    customerName;
    gauge;
    shopName;
    billDate;
    billRecord: Array<{customerName: string, gauge: any, insulator: any, wtUnit: any, newCopperSold: any, oldCopperPurchased: any, amountReceived: any, amountPaid: any, billDate: any, rateInfo: any}>;
    fullDate : {date: any, day: any, month: any, year: any};


    calculate() {

    /* Check stock availability*/

        this.recordStorage.get('stockRecords')
            .then(
            (data) => {
                if(data != null && data != ''){
                    let isStockAvailableForGauge = false;
                    this.validate();

                    for(let i = 0; i < data.length; i++){
                        if(data[i].gauge == this.gauge){
                            isStockAvailableForGauge = true;
                            if(Number(data[i].weight) < Number(this.NCWeight)){
                                this.callToast('Not enough stock remaining for ' + this.gauge);
                                this.readyToGo = false;
                                this.clear();
                                break;
                            }
                        }
                    }

                    /* Check stock availability*/

                    if(isStockAvailableForGauge == false){
                        if(this.gauge){
                            this.readyToGo = false;
                            this.callToast('No Stock Available for ' + this.gauge);
                        }
                    }

                    if (this.readyToGo) {
                        this.defaultCardMsg = '';
                        this.billTitle = "Bill";
                        this.currency = 'Rs.';

                        if (this.OCWeight == null) {
                            this.OCWeight = 0;
                        }

                        if (this.NCWeight == null) {
                            this.NCWeight = 0;
                        }

                        let newCopperBill = this.NCWeight * this.newCRate;
                        let oldCopperBill = this.OCWeight * this.oldCRate;
                        console.log('oldCopperBill : ' + oldCopperBill);

                        if (newCopperBill > oldCopperBill) {
                            this.acceptableAmount = (newCopperBill - oldCopperBill).toFixed(2);
                            this.payableAmount = null;
                            this.billMessage = 'Amount To Collect : ';
                            this.cardColor = 'card-green';
                        } else if (newCopperBill < oldCopperBill) {
                            this.payableAmount = (oldCopperBill - newCopperBill).toFixed(2);
                            this.acceptableAmount = null;
                            this.billMessage = 'Amount To Return : ';
                            this.cardColor = 'card-red';
                        } else if (newCopperBill == oldCopperBill) {
                            this.payableAmount = 0;
                            this.acceptableAmount = null;
                            this.billMessage = 'Nil : ';
                            this.cardColor = 'card-grey';
                        }

                        this.billDate = this.fullDate.date + '/' + (this.fullDate.month + 1) + '/' + (this.fullDate.year - 2000);

                        console.log("this.payableAmount : " + this.payableAmount);
                        console.log("this.acceptableAmount : " + this.acceptableAmount);
                    }



                }else{
                    this.callToast('Stock Not Available!');
                }

            }
        )

    }


    validate(){
        this.readyToGo = true;
        if(this.wtInKg == false){
            this.OCWeight = this.oldCopperWt / 1000;
            this.NCWeight = this.newCopperWt / 1000;
        }else{
            this.OCWeight = this.oldCopperWt;
            console.log("this.oldCopperWt : "+this.oldCopperWt)
            this.NCWeight = this.newCopperWt;
        }

        if(this.insulator){
            this.oldCRate = Number(this.rates.OCR) - Number(this.rates.OCR) * 0.1;
            console.log("Number(this.rates.OCR) * 0.1 = " +Number(this.rates.OCR) * 0.1);
        }else{
            this.oldCRate = this.rates.OCR;
        }

        this.newCRate = this.rates.NCR;
        //console.log('this.newCRate : ' + this.newCRate)

        if(this.newCRate == null || this.oldCRate == null || this.newCRate == '' || this.oldCRate == ''){
            this.noRatesToast();
            this.readyToGo = false;
            this.currency = '';
        }else if(this.NCWeight == null && this.OCWeight == null || this.NCWeight == '' && this.OCWeight == ''){
            this.noWeightToast();
            this.readyToGo = false;
            this.clear();
        }else if(this.gauge == null && this.gauge == null || this.gauge == '' && this.gauge == ''){
            this.callToast('Please Enter Gauge');
            this.readyToGo = false;
            this.clear();
        }
    }


    saveRecord(){

        this.recordStorage.get('billRecords')
            .then(
            (data) => {

                        this.billRecord = [];

                        if(data != null && data != ''){
                            for(let i = 0; i < data.length; i++){
                                this.billRecord.push(data[i]);     /* fetch old records*/
                            }
                        }


                        let acceptableAmount, payableAmount, newCopperWt, oldCopperWt, insulator, gauge, wtUnit, rateInfo;

                        if(this.acceptableAmount == null || this.acceptableAmount == ''){
                            acceptableAmount = 0;
                        }else{
                            acceptableAmount = Number(this.acceptableAmount).toFixed(1);
                        }

                        if(this.payableAmount == null || this.payableAmount == ''){
                            payableAmount = 0;
                        }else{
                            payableAmount = Number(this.payableAmount).toFixed(1);
                        }

                        if(this.newCopperWt == null || this.newCopperWt == ''){
                            newCopperWt = 0;
                        }else{
                            if(wtUnit == 'Kg'){
                                newCopperWt = Number(this.newCopperWt).toFixed(2);
                            }else{
                                newCopperWt = Number(this.newCopperWt);
                            }

                        }

                        if(this.oldCopperWt == null || this.oldCopperWt == ''){
                            oldCopperWt = 0;
                        }else{
                            if(wtUnit == 'Kg'){
                                oldCopperWt = Number(this.oldCopperWt).toFixed(2);
                            }else{
                                oldCopperWt = Number(this.oldCopperWt);
                            }

                        }

                        if(this.gauge == null || this.gauge == ''){
                            gauge = 'NA';
                        }else{
                            gauge = this.gauge;
                        }

                        if(this.insulator == true){
                            insulator = 'Yes';
                        }else{
                            insulator = 'No';
                        }

                        if(this.wtInKg == true){
                            wtUnit = 'Kg';
                        }else{
                            wtUnit = 'Gm';
                        }


                        rateInfo = {oldCopRate: this.oldCRate, newCopRate: this.newCRate};
                        this.billDate = '';
                        this.billDate = this.fullDate.date + '/' + (this.fullDate.month + 1) + '/' + (this.fullDate.year - 2000);

                        this.billRecord.push({
                            customerName:       this.customerInfo.customerName,
                            gauge:              gauge,                             /* Add New Record*/
                            insulator:          insulator,
                            wtUnit:             wtUnit,
                            newCopperSold:      newCopperWt,
                            oldCopperPurchased: oldCopperWt,
                            amountReceived:     acceptableAmount,
                            amountPaid:         payableAmount,
                            billDate:           this.billDate,
                            rateInfo:           rateInfo
                        });

                        this.recordStorage.set('billRecords', this.billRecord)      /* Push New Record*/
                            .then(
                            (data) => {
                                console.log('bill record saved - ' + JSON.stringify(this.billRecord));


                                this.stockRef.updateStock(this.gauge,this.NCWeight,false);

                                /*this.recordStorage.get('stockRecords')
                                    .then(
                                    (data) => {
                                        for(let i = 0; i < data.length; i++){

                                            if(data[i].gauge == this.gauge){
                                                data[i].weight = Number(data[i].weight) - Number(this.NCWeight);
                                            }

                                            this.recordStorage.set('stockRecords', data)
                                                .then(
                                                (data) =>{
                                                   console.log('stock updated '+ JSON.stringify(data));
                                                });

                                        }
                                    }
                                )*/

                                this.callToast('Record saved!');
                            }
                        )
            }
        )

    }



    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        // this.noRatesDefined(); TODO
        this.clear();
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 1000);
    }

    clear(){
        this.billTitle = '';
        this.billMessage = '';
        this.newCopperWt = '';
        this.oldCopperWt = '';
        this.payableAmount = '';
        this.acceptableAmount = '';
        this.currency = '';
        this.cardColor = 'card-grey';
        this.defaultCardMsg = 'Bill will be generated here',
            this.currency = '';
    }


    noRatesToast() {
        let toast = this.toastCtrl.create({
            message: 'Please define rates!',
            duration: 3000,
            position : 'bottom'
        });
        toast.present();
    }

    noWeightToast(){
        let toast = this.toastCtrl.create({
            message: 'Please enter weight!',
            duration: 3000,
            position : 'bottom'
        });
        toast.present();
    }

    callToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position : 'bottom'
        });
        toast.present();
    }


    customerInfo; objDate; date; month; year; day;      /* local date variables */

    getDate(){
        this.objDate = new Date();

        this.date = this.objDate.getDate();
        this.day = this.objDate.getDay();
        this.month = this.objDate.getMonth();
        this.year = this.objDate.getFullYear();

        this.fullDate = {date: this.date, day: this.day, month: this.month, year: this.year};
    }

    constructor(public navCtrl: NavController, public rates: RatesPage, public toastCtrl: ToastController, public navParams: NavParams, public recordStorage: Storage, public stockRef: Stock) {
        this.customerInfo = navParams.get('customerInfo');

        this.getDate();


    }

}
