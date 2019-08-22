import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsersService } from '../user/users.service';
import { Router } from '@angular/router';
import { SharedService } from '../service/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { MerchantService } from './merchant.service';
import { PagerService } from 'src/app/service/pager.service';
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
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  pageSize: any;
  totalElements: any;
  constructor(
    private merchantService: MerchantService,
    private router: Router,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  private pagerService: PagerService,
  ) { }

private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  ngOnInit() {
    this.whichForm = 'addMerchant';
    this.viewAllMerchant();
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

viewAllMerchant(pageNum = 0) {
    const pageSize = 10;
    this.spinner.show();
    this.merchantService.viewAllMerchant(pageSize, pageNum).subscribe(response => {
      //this.viewDownloadButton = true;
      this.spinner.hide();
      this.merchants = response.data.merchantAliases.content;
       console.log( this.merchants);
      this.totalElements = response.data.merchants.totalElements;
      this.pager = this.pagerService.getPager(this.totalElements);
    }, error => this.spinner.hide());
  }

newSearch(pageNum = 1, paginate = '') {
    let queryPAram;
    let paging;
    if (paginate === 'paginate') {
      const x = pageNum - 1;
      const y = +x;
      paging = '&pageNumber=' + y + '&pageSize=10';
    }
    // tslint:disable-next-line:max-line-length
    //queryPAram = this.getQueryParams(this.startDate.nativeElement.value + ' 00:00:00', this.endDate.nativeElement.value + ' 23:59:59', 'false');
    queryPAram = "";
    this.merchantService.searchMerchant(queryPAram, paging).subscribe(response => {
      this.merchants = response.data.merchants;
      this.totalElements = response.data.merchants.totalElements;
      this.pager = this.pagerService.getPager(this.totalElements, pageNum);
    });

  }

getQueryParams(fromCreatedAt, toCreatedAt, all) {
    this.merchants = [];
    let queryPAram = '';

    return queryPAram;
  }

  toTimestamp(date) {
    const datum = Date.parse(date);
    return datum;
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
