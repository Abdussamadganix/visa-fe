import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedService } from '../service/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PgSetupService } from './pg-setup.service';

@Component({
  selector: 'app-pg-setup',
  templateUrl: './pg-setup.component.html',
  styleUrls: ['./pg-setup.component.css']
})
export class PgSetupComponent implements OnInit {
  whichForm: any = 'viewProvider';
  providers: any = [];
  pages: any;
  pageNum: any;
  firstPage: any;
  lastPage: any;
  pageNumber: any;
  indexPassed: number;

  constructor(private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private spinner: NgxSpinnerService,
    private pgService: PgSetupService) { }

  ngOnInit() {
    // this.getProvider();
  }
}
