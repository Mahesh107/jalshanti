import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
//import { ManageCustomer } from '../manage-customer/manage-customer';
import { ActionSheetController } from 'ionic-angular';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {
    selectedCustomer: any;
    customers: Array<{customerName: string, shopName: string}>;
    navHomePage;

    customerName;
    shopName;
    personIcon;

    customersString;

    constructor(public navCtrl: NavController, public navParams: NavParams, public customerStorage: Storage, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController) {
        this.personIcon = 'person'
        this.customerStorage.get('customers')
            .then(
            (data) => {
                console.log('customers = ' + JSON.stringify(data));
                this.customers = data;
                this.customersString = JSON.stringify(this.customers);
                if (data == null) {
                    this.customers = [];
                    console.log('data is null; Nothing to display');
                }
            }
        );

    }


    saveCustomer() {
        let goodToGo = true;

        if(this.customerName == null){
            goodToGo = false;
            this.callToast('Enter customer name!');
        }


        if(this.shopName == null){
            goodToGo = false;
            this.callToast('Enter shop name!');
        }

        for (let i = 0; i < this.customers.length; i++) {
            if (this.customerName == this.customers[i].customerName) {
                goodToGo = false;
                this.callToast(this.customers[i].customerName +' already exists! ');
            }
        }


        if (goodToGo) {

            this.customers.push({
                customerName: this.customerName,
                shopName: this.shopName
            });

            this.customerStorage.set('customers', this.customers)
                .then(
                (data) => {
                    console.log('list.ts :: saveCustomer() :: data saved: ' + JSON.stringify(data));
                }
            )
        }
    }



    itemTapped(event, customer) {
        // That's right, we're pushing to ourselves!
        /*this.navCtrl.push(ManageCustomer, {
            customer: customer
        });*/
this.selectedCustomer = customer;
        this.presentActionSheet(customer)
    }


    presentActionSheet(customer) {
        let actionSheet = this.actionSheetCtrl.create({
            title: customer.customerName,
            cssClass: 'bckgrnd',
            buttons: [
                {
                    text: 'Sale',
                    icon: 'arrow-dropright-circle',
                    cssClass: 'bckgrnd',
                    handler: () => {
                        this.navToHomePage(customer);
                        console.log('Sale clicked');
                    }
                },{
                    text: 'Delete',
                    icon: 'trash',
                    role: 'destructive',
                    color: 'red',
                    handler: () => {
                        this.saveUpdatedCustomers();
                        console.log('Delete clicked');
                    }
                },{
                    text: 'Cancel',
                    icon: 'close-circle',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }


    oldData;
    saveUpdatedCustomers(){
        console.log('requested to delete customer: ' + this.selectedCustomer.customerName);
        this.customerStorage.get('customers')
            .then(
            (data) => {

                this.oldData = data;

                /*START: Remove selected customer from array*/

                for(let index = 0; index < this.oldData.length; index++){
                    let customer = this.oldData[index];
                    if(customer['customerName'] == this.selectedCustomer.customerName){
                        this.oldData.splice(index, 1);
                    }
                }

                /*END: Remove selected customer from array*/

                this.customerStorage.remove('customers')
                    .then(
                    (data) =>{
                        console.log('cleared all customers: ' + data);
                        this.customerStorage.set('customers', this.oldData)
                            .then(
                            (data) => {
                                this.customers = this.oldData;
                                console.log('list.ts :: saveCustomer() :: data saved: ' + JSON.stringify(data));
                                this.customerRemovedToast();
                                //this.navBackToListPage('');
                            }
                        )
                    }
                )

            })
    }


    navToHomePage(customerInfo){
        this.navCtrl.push(HomePage, {
            customerInfo: customerInfo
        });
    }


    doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        // this.noRatesDefined(); TODO
        //this.fetchCustomers();
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 1000);
    }

    customerRemovedToast() {
        let toast = this.toastCtrl.create({
            message: 'removed',
            duration: 2000,
            position : 'bottom'
        });
        toast.present();
    }

    customerAddedToast() {
        let toast = this.toastCtrl.create({
            message: 'added - '+this.selectedCustomer.customerName,
            duration: 2000,
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

    /*testToast() {
        this.customerStorage.getItem('customer')
            .then(
            customers => {
                let toast = this.toastCtrl.create({
                    message: 'added (from storage)- ' + JSON.stringify(this.items),
                    duration: 10000,
                    position: 'top'
                });
                toast.present();
            })
    }*/

}
