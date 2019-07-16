import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PgSetupService } from '../pg-setup.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  whichForm: any = 'viewProvider';
  providers: any = [];
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  addProviderForm: FormGroup;
  viewProviderModel: any;

  constructor(private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private pgService: PgSetupService) { }

  ngOnInit() {
    this.getProviders();

    this.addProviderForm = this.formBuilder.group({
      'name': new FormControl({value: '', disabled: true}, Validators.required),
      'status': new FormControl({value: ''}, Validators.required),
      'code':  new FormControl({value: '',  disabled: true}, Validators.required),
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

  addProvider() {
    this.whichForm = 'addNewProvoder';
  }

  goBack() {
    this.addProviderForm.reset();
    this.whichForm = 'viewProvider';
    this.getProviders();
  }

  addNewProvider(body) {
    if (this.addProviderForm.invalid) {
      this.sharedService.swalAlertMessage('Add New Provider', 'All feild are required', 'info');
      return;
    }
    const requestBody = {
      'name': this.addProviderForm.value.name,
      'code': this.addProviderForm.value.code,
      'status': (this.addProviderForm.value.status === true) ? 'ACTIVE' : 'INACTIVE'
    };
    this.spinner.show();
    this.pgService.addProvider(requestBody).subscribe(response => {
      this.addProviderForm.reset();
      this.spinner.hide();
      this.sharedService.swalAlertMessage('Add New Provider', 'Provider created successfully', 'success');
      this.goBack();
    }, error => {
      this.handleErrors(error.error);
    });
  }

  viewProvider(provider) {
    this.viewProviderModel = Object.assign({}, provider);
    // this.spinner.show();
    this.whichForm = 'viewProviderDetail';
    this.addProviderForm.setValue({
      'name': this.viewProviderModel.name,
      'code': this.viewProviderModel.code,
      'status': (this.viewProviderModel.status === 'ACTIVE') ? true : false,
    });
    // this.spinner.hide();
  }

  updateProvider() {
    if (this.addProviderForm.invalid) {
      this.sharedService.swalAlertMessage('Update Provider', 'All feild are required', 'info');
      return;
    }
    const requestBody = {
      'name': this.viewProviderModel.name,
      'code': this.viewProviderModel.code,
      'status': (this.addProviderForm.value.status === true) ? 'ACTIVE' : 'INACTIVE',
    };
    this.spinner.show();
    this.pgService.updateProvider(this.viewProviderModel.code, requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        this.addProviderForm.reset();
        swal({
          title: 'Update Provider',
          text: 'Provider updated successfully',
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
