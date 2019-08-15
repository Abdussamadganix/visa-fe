import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsersService } from '../user/users.service';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { MerchantService } from './merchant.service';
declare var $: any;


@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styleUrls: ['./merchant.component.css']
})
export class MerchantComponent implements OnInit {
  merchantForm: FormGroup;
  whichForm: any = 'addMerchant';
  merchants: any = [];
  temp_var: boolean;
  viewMerchantModel: any;
  constructor(
    private merchantService: MerchantService,
    private router: Router,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.whichForm = 'addMerchant';
    this.getMerchant();
    this.merchantForm = this.formBuilder.group({
      aliasId: ['', Validators.required],
      merchantId: ['', Validators.required],
      merchantCategoryCode: ['', Validators.required],
      payloadFormatIndicator: ['', Validators.required],
      pointOfInitiationMethod: [''],
      transactionCurrencyCode: ['', Validators.required],
      recipientName: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      
    });
  }

  getMerchant(){
    const body = {
      "merchantAliasId": "4761100090708271"
    }
    this.merchantService.viewMerchant(body).subscribe(response => { 
      this.temp_var = true;
      console.log(response)
    }, error => {
      this.handleErrors(error.error);
    });
  }


  displayUpdateForm(merchant){
      this.viewMerchantModel = Object.assign({}, merchant);
      this.merchantForm.setValue({
        aliasId: merchant.aliasId,
        merchantId: merchant.merchantForm,
        merchantCategoryCode: merchant.merchantCategoryCode,
        payloadFormatIndicator: merchant.payloadFormatIndicator,
        pointOfInitiationMethod: merchant.pointOfInitiationMethod,
        transactionCurrencyCode: merchant.transactionCurrencyCode,
        recipientName: merchant.recipientName,
        city: merchant.city,
        country: merchant.country
      });
  }

  updateMerchant(merchant){

    const body = {
      aliasId: merchant.aliasId,
      merchantId: merchant.merchantForm,
      merchantCategoryCode: merchant.merchantCategoryCode,
      payloadFormatIndicator: merchant.payloadFormatIndicator,
      pointOfInitiationMethod: merchant.pointOfInitiationMethod,
      transactionCurrencyCode: merchant.transactionCurrencyCode,
      recipientName: merchant.recipientName,
      city: merchant.city,
      country: merchant.country
  };
  this.spinner.show();
  this.merchantService.updateMerchant(body).subscribe(response => {
    this.spinner.hide();
    if (response.status === 200) {
      swal({
        title: 'User Update',
        text: 'User successfully updated',
        type: 'info',
        confirmButtonText: 'Ok',
        customClass: 'sweet-alert',
        allowOutsideClick: false
      }).then(() => {
        this.whichForm = 'viewUserTable';
        // this.router.navigateByUrl('/users/view');
      });
    }
    //  this.router.navigateByUrl('/home');
  }, error => {
    this.handleErrors(error.error);
  });
  }

  deleteMerchant(merchant){
    const body = {
      aliasId: merchant.aliasId,
      merchantId: merchant.merchantId
    }

    this.merchantService.deleteMerchant(body).subscribe(response => { 
      this.temp_var = true;
      console.log(response)
    }, error => {
      this.handleErrors(error.error);
    });
  }

  

  createMerchant(merchant) {
    const body = {
        aliasId: merchant.aliasId,
        merchantId: merchant.merchantForm,
        merchantCategoryCode: merchant.merchantCategoryCode,
        payloadFormatIndicator: merchant.payloadFormatIndicator,
        pointOfInitiationMethod: merchant.pointOfInitiationMethod,
        transactionCurrencyCode: merchant.transactionCurrencyCode,
        recipientName: merchant.recipientName,
        city: merchant.city,
        country: merchant.country
    };
    this.spinner.show();
    this.merchantService.createMerchant(body).subscribe(response => {
      this.spinner.hide();
      if (response.status === 200) {
        swal({
          title: 'User Update',
          text: 'User successfully updated',
          type: 'info',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.whichForm = 'viewUserTable';
          // this.router.navigateByUrl('/users/view');
        });
      }
      //  this.router.navigateByUrl('/home');
    }, error => {
      this.handleErrors(error.error);
    });
  }

  handleErrors(error) {
    this.spinner.hide();
    let errorMessage;
    if (error.status === 'FAILED' && error.error === 'PROCESSING') {
      errorMessage = 'An error occured';
    } else if (error.status === 'FAILED') {
      errorMessage = error.message;
    }
    this.sharedService.swalAlertMessage('Error!', errorMessage, 'error');
  }
}
