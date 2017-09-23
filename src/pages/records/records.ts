//import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

/**
 * Generated class for the Records page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-records',
  templateUrl: 'records.html'
})
export class RecordsPage {

    customers;
    selectedCustomerForRecord;
    TotalNewCopWt;
    TotalOldCopWt;
    TotalAmountReceived;
    TotalAmountPaid;
    gaugeFromStock;
    date: any;
    billRecord: Array<{customerName: string, gauge: any, insulator: any, wtUnit: any, newCopperSold: any, oldCopperPurchased: any, amountReceived: any, amountPaid: any, date: any}>;
    monthlyBillRecord;
    days = ['SUN', 'MON', 'TUE', 'WED', 'THUS', 'FRI', 'SAT'];
    months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    years = ['2017','2018','2019','2020','2021','2022','2023','2024','2025'];
    gaugeArray;

  constructor(public navCtrl: NavController, public customerStorage: Storage, public toastCtrl: ToastController) {

      console.log('Record Page constructor');

        this.fetchCustomers();
        this.fetchAllRecord();

  }


    fetchCustomers(){
        this.customerStorage.get('customers')
            .then(
            (data) => {
                if(data == null || data == ''){
                    console.log('No customer is available - '+this.customers);
                }else{
                    this.customers = [];
                    this.customers = data;
                    console.log('Customers available - '+JSON.stringify(this.customers));
                }
            }
        )
    }



    allBillRecords;
    TotalNewCopWtAll;
    TotalOldCopWtAll;
    TotalAmountReceivedAll;
    TotalAmountPaidAll;
    dateForAllRecords;

    fetchAllRecord(){

        this.customerStorage.get('billRecords')
            .then(
            (data) => {
                if(data == null || data == ''){
                    console.log('No records available');
                    this.callToast('No records available');
                }else{
                    this.allBillRecords = [];
                    this.gaugeArray = [];
                    this.TotalNewCopWtAll=0;
                    this.TotalOldCopWtAll=0;
                    this.TotalAmountReceivedAll=0;
                    this.TotalAmountPaidAll=0;
                    let recordsAvailable = false;
                    for(let i = 0; i<data.length; i++){

                            this.allBillRecords.push(data[i]);


                                if(this.gaugeArray.indexOf(data[i].gauge) == -1){
                                    this.gaugeArray.push(data[i].gauge);  /* for sort Records by gauge */
                                    console.log('All gauges in record: '+this.gaugeArray);

                            }



                            if(data[i].wtUnit == 'Gm'){
                                this.TotalNewCopWtAll += Number(data[i].newCopperSold)/1000;
                                this.TotalOldCopWtAll += Number(data[i].oldCopperPurchased)/1000;

                            }else{
                                this.TotalNewCopWtAll += Number(data[i].newCopperSold);
                                this.TotalOldCopWtAll += Number(data[i].oldCopperPurchased);
                            }

                            this.TotalAmountReceivedAll += Number(data[i].amountReceived);
                            this.TotalAmountPaidAll += Number(data[i].amountPaid);
                            recordsAvailable = true;
//                            this.dateForAllRecords = data[i].fullDate.date + '/' + (data[i].fullDate.month + 1) + '/' + (data[i].fullDate.year - 2000);

                        }
                        /* END: for selected customer*/




                    this.TotalNewCopWtAll=Number(this.TotalNewCopWtAll).toFixed(2);
                    this.TotalOldCopWtAll=Number(this.TotalOldCopWtAll).toFixed(2);

                    this.TotalAmountReceivedAll=Number(this.TotalAmountReceivedAll).toFixed(1);
                    this.TotalAmountPaidAll=Number(this.TotalAmountPaidAll).toFixed(1);

                    if(recordsAvailable == false){
                        console.log('No records available');
                        this.callToast('No records available');
                    }

                    console.log('Records fetched: ' + JSON.stringify(this.allBillRecords));

                }
            }
        )
    }


    fetchRecordsForSelectedCustomer(){
        let selectedCustomer = this.selectedCustomerForRecord.trim();
        let recordsAvailable = false;
        console.log('Requested record for: '+selectedCustomer);

        this.customerStorage.get('billRecords')
            .then(
            (data) => {
                if(data == null || data == ''){
                    console.log('No records available');
                    this.callToast('No records available');
                }else{
                    this.billRecord = [];
                    this.TotalNewCopWt=0;
                    this.TotalOldCopWt=0;
                    this.TotalAmountReceived=0;
                    this.TotalAmountPaid=0;
                    for(let i = 0; i<data.length; i++){


                        /* START: for selected customer*/
                        if(data[i].customerName == selectedCustomer){
                            this.billRecord.push(data[i]);

                            if(data[i].wtUnit == 'Gm'){
                                this.TotalNewCopWt += Number(data[i].newCopperSold)/1000;
                                this.TotalOldCopWt += Number(data[i].oldCopperPurchased)/1000;

                            }else{
                                this.TotalNewCopWt += Number(data[i].newCopperSold);
                                this.TotalOldCopWt += Number(data[i].oldCopperPurchased);
                            }

                            this.TotalAmountReceived += Number(data[i].amountReceived);
                            this.TotalAmountPaid += Number(data[i].amountPaid);
                            recordsAvailable = true;
//                            this.date = data[i].fullDate.date + '/' + (data[i].fullDate.month + 1) + '/' + (data[i].fullDate.year - 2000);
                        }
                        /* END: for selected customer*/

                    }


                    this.TotalNewCopWt=Number(this.TotalNewCopWt).toFixed(2);
                    this.TotalOldCopWt=Number(this.TotalOldCopWt).toFixed(2);

                    this.TotalAmountReceived=Number(this.TotalAmountReceived).toFixed(1);
                    this.TotalAmountPaid=Number(this.TotalAmountPaid).toFixed(1);

                    if(recordsAvailable == false){
                        console.log('No records available for '+ selectedCustomer);
                        this.callToast('No records available for '+ selectedCustomer);
                    }

                    console.log('Records fetched: ' + JSON.stringify(this.billRecord));

                }
            }
        )

    }

    selectedMonthForRecord;
    TotalNewCopWtMonthlySort;
    TotalOldCopWtMonthlySort;
    TotalAmountReceivedMonthlySort;
    TotalAmountPaidMonthlySort;
    selectedYearForRecord;

    fetchRecordsForSelectedMonth(){
        let selectedMonth = this.selectedMonthForRecord.trim();
        let selectedYear = this.selectedYearForRecord.trim();
        let recordsAvailable = false;
        console.log('Requested record for: '+selectedMonth);

        this.customerStorage.get('billRecords')
            .then(
            (data) => {
                if(data == null || data == ''){
                    console.log('No records available');
                    this.callToast('No records available');
                }else{
                    this.monthlyBillRecord = [];
                    this.TotalNewCopWtMonthlySort=0;
                    this.TotalOldCopWtMonthlySort=0;
                    this.TotalAmountReceivedMonthlySort=0;
                    this.TotalAmountPaidMonthlySort=0;

                    let monthIndex = 0;
                    monthIndex = this.months.indexOf(selectedMonth);
                    monthIndex = monthIndex +1;

                    for(let i = 0; i<data.length; i++){


                        /*START: for selected month and year*/

                        let str: string = data[i].billDate;
                        let res = [];
                        res = str.split("/");

                        let yearLastTwoDigits = '';
                        yearLastTwoDigits = selectedYear.substring(2);

                        if(res[1] == monthIndex && res[2] == yearLastTwoDigits){
                            this.monthlyBillRecord.push(data[i]);

                            if(data[i].wtUnit == 'Gm'){
                                this.TotalNewCopWtMonthlySort += Number(data[i].newCopperSold)/1000;
                                this.TotalOldCopWtMonthlySort += Number(data[i].oldCopperPurchased)/1000;

                            }else{
                                this.TotalNewCopWtMonthlySort += Number(data[i].newCopperSold);
                                this.TotalOldCopWtMonthlySort += Number(data[i].oldCopperPurchased);
                            }

                            this.TotalAmountReceivedMonthlySort += Number(data[i].amountReceived);
                            this.TotalAmountPaidMonthlySort += Number(data[i].amountPaid);
                            recordsAvailable = true;
//                            this.date = data[i].fullDate.date + '/' + (data[i].fullDate.month + 1) + '/' + (data[i].fullDate.year - 2000);
                        }
                        /*END: for selected month and year*/

                    }


                    this.TotalNewCopWtMonthlySort=Number(this.TotalNewCopWtMonthlySort).toFixed(2);
                    this.TotalOldCopWtMonthlySort=Number(this.TotalOldCopWtMonthlySort).toFixed(2);

                    this.TotalAmountReceivedMonthlySort=Number(this.TotalAmountReceivedMonthlySort).toFixed(1);
                    this.TotalAmountPaidMonthlySort=Number(this.TotalAmountPaidMonthlySort).toFixed(1);

                    if(recordsAvailable == false){
                        console.log('No records available for '+ selectedMonth);
                        this.callToast('No records available for '+ selectedMonth + ' ' + selectedYear);
                    }

                    console.log('Records fetched: ' + JSON.stringify(this.monthlyBillRecord));

                }
            }
        )
    }



    selectedGaugeForRecord;
    gaugeWiseBillRecord;
    TotalCopWtOfGauge;
    costPerRecord;
    TotalCost;
    dateForGaugeSort;

    fetchRecordsForSelectedGauge(){
        let selectedGauge = this.selectedGaugeForRecord.trim();
        let recordsAvailable = false;
        console.log('Requested record for gauge: '+selectedGauge);

        this.customerStorage.get('billRecords')
            .then(
            (data) => {
                if (data == null || data == '') {
                    console.log('No records available');
                    this.callToast('No records available');
                } else {
                    this.gaugeWiseBillRecord = [];
                    this.TotalCopWtOfGauge = 0;
                    this.costPerRecord = 0;
                    this.TotalCost = 0;

                    let newCopperSoldInKg;

                    let index=0;

                    for (let i = 0; i < data.length; i++) {


                        /*START: for selected month and year*/
                        if (data[i].gauge == selectedGauge) {
                            this.gaugeWiseBillRecord.push(data[i]);

                            if (data[i].wtUnit == 'Gm') {
                                newCopperSoldInKg = Number(data[i].newCopperSold) / 1000;
                                this.TotalCopWtOfGauge += Number(data[i].newCopperSold) / 1000;

                            } else {
                                newCopperSoldInKg = Number(data[i].newCopperSold);
                                this.TotalCopWtOfGauge += Number(data[i].newCopperSold);
                            }

                            this.costPerRecord = newCopperSoldInKg * data[i].rateInfo.newCopRate;

                            this.gaugeWiseBillRecord[index].costPerOneRecord = this.costPerRecord;

                            console.log('this.gaugeWiseBillRecord.costPerRecord: ' + this.gaugeWiseBillRecord[index].costPerOneRecord);
                            this.TotalCost += this.costPerRecord;
                            recordsAvailable = true;

                            index++;
//                            this.dateForGaugeSort = data[i].fullDate.date + '/' + (data[i].fullDate.month + 1) + '/' + (data[i].fullDate.year - 2000);
                        }
                        /*END: for selected month and year*/

                    }


                    this.TotalCopWtOfGauge = Number(this.TotalCopWtOfGauge).toFixed(2);

                    this.TotalCost = Number(this.TotalCost).toFixed(1);
                    this.costPerRecord = Number(this.costPerRecord).toFixed(1);

                    if (recordsAvailable == false) {
                        console.log('No records available for gauge' + selectedGauge);
                        this.callToast('No records available for gauge' + selectedGauge);
                    }

                    console.log('Records fetched: ' + JSON.stringify(this.gaugeWiseBillRecord));
                }
            }
        )
    }
    /*landscapeView = false;
    view = 'phone-landscape';
    rotateScreen(){
        this.landscapeView = !this.landscapeView;
        if(this.landscapeView){
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
            this.view = 'phone-landscape';
        }else{
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
            this.view = 'phone-portrait';
        }

    }*/


    fullRecord: boolean = false;
    recordLengthButtonName = 'full record';
    toggleFullRecord(){
        this.fullRecord = !this.fullRecord;
        if(this.fullRecord){
            this.recordLengthButtonName = 'small record';
        }else{
            this.recordLengthButtonName = 'full record';
        }

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