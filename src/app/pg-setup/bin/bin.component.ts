import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PgSetupService } from '../pg-setup.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.css']
})
export class BinComponent implements OnInit {
  whichForm: any = 'viewBin';
  bins: any = [];
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;
  addBinForm: FormGroup;
  viewBinModel: any;
  providers:  any  = [];

  constructor(private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private pgService: PgSetupService) { }

  ngOnInit() {
    this.getBins();
    this.getProviders();

    this.addBinForm = this.formBuilder.group({
      'bin': ['', Validators.required],
      'processor': ['', Validators.required],
      'status': ['']
    });
  }

  getBins(pageNum = 0) {
    this.pageNum = pageNum;
    const pageSize = 10;
    if (this.pageNum > 1) {
      this.indexPassed = (pageSize * (this.pageNum - 1)) + 1;
    } else {
      this.indexPassed = pageNum;
    }
    this.pgService.getAllBin().subscribe(response => {
      this.bins = response.data.bin;
      this.pageNumber = response.data.bin.pageNumber;
      this.lastPage = response.data.bin.last;
      const returnedPageSize = response.data.bin.totalPages - 1;
      const pageNumberArray = [];
      let i = 1;
      for (i = 1; i <= returnedPageSize; i++) {
        pageNumberArray.push(i);
      }
      this.pages = pageNumberArray;
    }, error => {
    });
  }

  addBin() {
    this.addBinForm.reset();
    this.whichForm = 'addBin';
  }

  goBack() {
    this.addBinForm.reset();
    this.whichForm = 'viewBin';
    this.getBins();
  }

  addNewBin(body) {
    if (this.addBinForm.invalid) {
      this.sharedService.swalAlertMessage('Add New BIN', 'All feild are required', 'info');
      return;
    }
    const requestBody =  {
      'bins': [{
        'bin': this.addBinForm.value.bin,
        'processor': this.addBinForm.value.processor,
        'status': (this.addBinForm.value.status === true) ? 'ACTIVE' : 'INACTIVE'
      }]
    };
    this.spinner.show();
    this.pgService.addBin(requestBody).subscribe(response => {
      this.addBinForm.reset();
      this.spinner.hide();
      this.sharedService.swalAlertMessage('Add New BIN', 'BIN created successfully', 'success');
      this.goBack();
    }, error => {
      this.handleErrors(error.error);
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

  viewBin(bin) {
    this.viewBinModel = Object.assign({}, bin);
    this.spinner.show();
    this.whichForm = 'viewBinDetail';
    this.addBinForm.setValue({
      'bin': this.viewBinModel.bin,
      'processor': this.viewBinModel.processor,
      'status': (this.viewBinModel.status === 'ACTIVE') ? true : false,
    });
    this.spinner.hide();
  }

  updateBin() {
    if (this.addBinForm.invalid) {
      this.sharedService.swalAlertMessage('Update BIN', 'All feild are required', 'info');
      return;
    }
    const requestBody = {
      'bin': this.addBinForm.value.bin,
      'processor': this.addBinForm.value.processor,
      'uniqueKey': this.viewBinModel.uniqueKey,
      'status': (this.addBinForm.value.status === true) ? 'ACTIVE' : 'INACTIVE',
    };
    this.spinner.show();
    this.pgService.updateBin(requestBody).subscribe(response => {
      this.spinner.hide();
      if (response.body.status === 'SUCCESS') {
        this.addBinForm.reset();
        swal({
          title: 'Update BIN',
          text: 'BIN updated successfully',
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
