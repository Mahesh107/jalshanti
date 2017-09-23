import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the Stock page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class Stock {

    gauge;
    weight;
    TotalStockRemaining;
    stock = [];
    fullDate : {date: any, day: any, month: any, year: any};

  constructor(public navCtrl: NavController, public navParams: NavParams, public stockStorage: Storage, public toastCtrl: ToastController) {
      this.getDate();
      this.getStock();
  }

    stockSaved;
    saveStock() {

        if ((this.gauge != null && this.gauge != '') && (this.weight != null && this.weight != '')) {
            this.stockStorage.get('stockRecords')
                .then(
                (data) => {
                    let goSaveStock = true;
                    console.log('This is what the data is = '+data);
                    if(data != null && data != ''){

                    for(let i = 0; i< data.length; i++){
                        if(this.gauge == data[i].gauge){
                            goSaveStock =false;
                        }
                    }
                    }

                if(goSaveStock){
                    this.stock.push({
                        gauge: this.gauge.toFixed(1),
                        weight: this.weight,
                        lastUpdatedOn: this.lastUpdatedOn
                    });

                    this.getTotalStockRemaining();

                    this.stockStorage.set('stockRecords', this.stock)/* Push New Record*/
                        .then(
                        (data) => {
                            console.log('stock record saved - ' + JSON.stringify(data));
                            this.getStock();
                            this.stockSaved = true;
                            this.callToast('New Stock Saved!');
                        }
                    );
                }else{

                    this.callToast(''+this.gauge + ' already exists!');
                }

                }
            );

        }else{
            this.callToast('Enter Gauge and Weight');
        }
    }

    lastUpdatedOn;
    getStock() {

        this.stockStorage.get('stockRecords')
            .then(
            (data) => {

                if(data != null && data != ''){
                    this.stock = [];
                    this.gaugeArray = [];
                    for(let i = 0; i < data.length; i++){
                        this.stock.push(data[i]);

                        //this.stock[i].lastUpdatedOn = this.lastUpdatedOn;
                        this.stock[i].weight = Number(this.stock[i].weight).toFixed(2);



                        this.gaugeArray.push(data[i].gauge);    /* for update functionality */

                    }

                    console.log('stock: ' + JSON.stringify(this.stock));
                    this.getTotalStockRemaining();
                }else{
                    this.callToast('Stock not available!')
                }

            }
        );
    }

    remainingStockForGauge;

    getStockRemainingForSelectedGauge(gauge){
        for(let i =0; i<this.stock.length; i++){
            if(this.stock[i].gauge == gauge.trim()){
                return this.stock[i].weight;
            }
        }
    }


    gaugeArray;
    weightForUpdate;
    updateStock(gauge, weight, isAddition){

        this.stockStorage.get('stockRecords')
            .then(
            (data) => {

        if(data != null && data != ''){
                let isInputAvailable = false;
                let isGaugeAvailable = false;
                for(let i = 0; i < data.length; i++){

                    this.getDate();



                    if(data[i].gauge == gauge.trim()){
                        isGaugeAvailable = true;
                        if(weight != null && weight != ''){
                            isInputAvailable = true;

                            if(isAddition){
                                let existingWeight = Number(data[i].weight);
                                data[i].weight = existingWeight + Number(weight);
                                data[i].lastUpdatedOn = this.lastUpdatedOn;
                                break;
                            }else{
                                let existingWeight = Number(data[i].weight);
                                data[i].weight = existingWeight - Number(weight);
                                break;
                            }
                            }
                    }
                }

                if(isInputAvailable){
                    if(isGaugeAvailable){
                        this.stockStorage.set('stockRecords', data)
                            .then(
                            (data) => {
                                this.getStock();
                                if(isAddition){
                                    this.callToast('Stock Updated!');
                                }
                            }
                        );
                    }else{
                        this.callToast(gauge+' is not in Stock!');
                    }
                }else{
                    this.callToast('Enter Gauge and Weight!');
                }

        }else{
            this.callToast('There is no stock!');
        }
            }
        );

    }


  getTotalStockRemaining(){
      this.TotalStockRemaining = 0;
      for(let i = 0; i < this.stock.length; i++){
          this.TotalStockRemaining += Number(this.stock[i].weight);
      }
      this.TotalStockRemaining = Number(this.TotalStockRemaining).toFixed(2);
  }


    customerInfo; objDate; date; month; year; day;      /* local date variables */

    getDate(){
        this.objDate = new Date();

        this.date = this.objDate.getDate();
        this.day = this.objDate.getDay();
        this.month = this.objDate.getMonth();
        this.year = this.objDate.getFullYear();

        this.fullDate = {date: this.date, day: this.day, month: this.month, year: this.year};
        this.lastUpdatedOn = this.fullDate.date + '/' + (this.fullDate.month + 1) + '/' + (this.fullDate.year - 2000);
    }


    callToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position : 'bottom'
        });
        toast.present();
    }

}
