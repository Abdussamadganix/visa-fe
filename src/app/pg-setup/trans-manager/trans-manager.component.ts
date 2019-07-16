import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PgSetupService } from '../pg-setup.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-trans-manager',
  templateUrl: './trans-manager.component.html',
  styleUrls: ['./trans-manager.component.css']
})
export class TransManagerComponent implements OnInit {
  whichForm: any = 'viewProvider';
  transManagers: any = [];
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  addtransManagerForm: FormGroup;
  viewTransManagerModel: any;
  providers: any = [];

  constructor(private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private pgService: PgSetupService) { }

  ngOnInit() {
    this.getTransManager();
    this.getProviders();

    this.addtransManagerForm = this.formBuilder.group({
      'merchantName':  new FormControl({value: '', disabled: true}),
      'useCardType': [''],
      'cardType': [''],
      'cardProcessor': [''],
      'useBin': [''],
      'binProcessor': [''],
      'isDefaultProviderSet': [''],
      'provider': [''],
      'status': ['']
    });
  }

  getProviders(pageNum = 0) {
    this.pageNum = pageNum;
    const pageSize = 10;
    if (this.pageNum > 1) {
      this.indexPassed = (pageSize * (this.pageNum - 1)) + 1;
    } else {
      this.indexPassed = pageNum;
    }
    this.spinner.show();
    this.pgService.getAllProviders(pageSize, pageNum).subscribe(response => {
      this.spinner.hide();
      const resp = response.data.providers;
      this.providers = resp.content;
      this.pageNumber = resp.pageNumber;
      this.lastPage = resp.last;
      const returnedPageSize = resp.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    }, error => {
      this.spinner.hide();
    });
  }
  getTransManager(pageNum = 0) {
    this.pageNum = pageNum;
    const pageSize = 10;
    if (this.pageNum > 1) {
      this.indexPassed = (pageSize * (this.pageNum - 1)) + 1;
    } else {
      this.indexPassed = pageNum;
    }
    this.spinner.show();
    this.pgService.getAllTransManager(pageSize, pageNum).subscribe(response => {
      this.spinner.hide();
      this.transManagers = response.data.cardTransactionManagers.content;
      this.pageNumber = response.data.cardTransactionManagers.pageNumber;
      this.lastPage = response.data.cardTransactionManagers.last;
      const returnedPageSize = response.data.cardTransactionManagers.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    }, error => {
      this.spinner.hide();
    });
  }
  addProvider() {
    this.whichForm = 'addNewProvoder';
  }
  goBack() {
    // this.addtransManagerForm.reset();
    this.whichForm = 'viewProvider';
    this.getTransManager();
  }
  addNewProvider(body) {
    if (this.addtransManagerForm.invalid) {
      this.sharedService.swalAlertMessage('Add New Provider', 'All feild are required', 'info');
      return;
    }
    const requestBody = {
      'merchant': this.addtransManagerForm.value.name,
      'useCardType':  (this.addtransManagerForm.value.useCardType === true) ? 'ACTIVE' : 'INACTIVE',
      'cardType': this.addtransManagerForm.value.code,
      'cardProcessor': this.addtransManagerForm.value.code,
      'useBin':  (this.addtransManagerForm.value.useBin === true) ? 'ACTIVE' : 'INACTIVE',
      'binProcessor': this.addtransManagerForm.value.code,
      'isDefaultProviderSet':  (this.addtransManagerForm.value.isDefaultProviderSet === true) ? 'ACTIVE' : 'INACTIVE',
      'provider': this.addtransManagerForm.value.code,
      'status': (this.addtransManagerForm.value.status === true) ? 'ACTIVE' : 'INACTIVE',
    };
    this.spinner.show();
    this.pgService.addTransManager(requestBody).subscribe(response => {
      this.addtransManagerForm.reset();
      this.spinner.hide();
      this.sharedService.swalAlertMessage('Add New Provider', 'Provider created successfully', 'success');
      this.goBack();
    }, error => {
      this.handleErrors(error.error);
    });
  }

  viewTransManager(transManager) {
    this.viewTransManagerModel = Object.assign({}, transManager);
    this.spinner.show();
    this.whichForm = 'viewtransManagerDetail';
    this.spinner.hide();
    this.addtransManagerForm.setValue({
      'merchantName': this.viewTransManagerModel.merchantName,
      'useCardType':  (this.viewTransManagerModel.useCardType === 'ACTIVE') ? true : false,
      'cardType': this.viewTransManagerModel.cardType,
      'cardProcessor': this.viewTransManagerModel.cardProcessor,
      'useBin':  (this.viewTransManagerModel.useBin === 'ACTIVE') ? true : false,
      'binProcessor': this.viewTransManagerModel.binProcessor,
      'isDefaultProviderSet':  (this.viewTransManagerModel.isDefaultProviderSet === 'ACTIVE') ? true : false,
      'provider': this.viewTransManagerModel.provider,
      'status': (this.viewTransManagerModel.status === 'ACTIVE') ? true : false,
      // 'status': (this.viewProviderModel.status === 'ACTIVE') ? true : false,
    });
    // this.spinner.hide();
  }

  updateTransManagerss(data) {
    if (this.addtransManagerForm.invalid) {
      this.sharedService.swalAlertMessage('Update Card Transaction Manager', 'All feild are required', 'info');
      return;
    }
    const requestBody = {
      'useCardType':  (this.addtransManagerForm.value.useCardType === true) ? 'ACTIVE' : 'INACTIVE',
      'cardType': this.addtransManagerForm.value.cardType,
      'merchant': this.viewTransManagerModel.merchant,
      'cardProcessor': this.addtransManagerForm.value.cardProcessor,
      'useBin':  (this.addtransManagerForm.value.useBin === true) ? 'ACTIVE' : 'INACTIVE',
      'binProcessor': this.addtransManagerForm.value.binProcessor,
      'isDefaultProviderSet':  (this.addtransManagerForm.value.isDefaultProviderSet === true) ? 'ACTIVE' : 'INACTIVE',
      'provider': this.addtransManagerForm.value.provider,
      'status': (this.addtransManagerForm.value.status === true) ? 'ACTIVE' : 'INACTIVE',
    };
    this.spinner.show();
    this.pgService.updateTransManager(this.viewTransManagerModel.uniqueKey, requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        swal({
          title: 'Update Transaction Manager',
          text: 'Card Transaction Manager updated successfully',
          type: 'success',
          confirmButtonText: 'Ok',
          customClass: 'sweet-alert',
          allowOutsideClick: false
        }).then(() => {
          this.goBack();
        });
      }
    }, error => {
      this.handleErrors(error);
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
