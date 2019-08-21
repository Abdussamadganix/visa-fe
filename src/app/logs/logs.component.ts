import { Component, OnInit } from '@angular/core';
import { LogsService } from './logs.service';
import { PagerService } from 'src/app/service/pager.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  temp_var: boolean;
  log: any = {}
pages: any;
pageNum: any;
firstPage: any;
lastPage: any;
pageNumber: any;
indexPassed: number;
pageSize: any;
totalElements: any;
transactions: any;

  constructor(private logService: LogsService,    private spinner: NgxSpinnerService, private pagerService: PagerService
) { }

  ngOnInit() {
    this.viewTransactions();
  }
private allItems: any[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: any[];

  getLog(){
    const body = {
      "uniqueKey": "c8baeef6c5"
    }
    this.logService.viewLogs(body).subscribe(response => {
      this.temp_var = true;
      this.log = response.data.payments.content
      console.log(response)
    });
  }

viewTransactions(pageNum = 0) {
    const from1 = '';
    const to = '';
    const pageSize = 10;
    this.spinner.show();
    this.logService.getTransactions(pageNum, pageSize, from1, to).subscribe(response => {
      this.spinner.hide();
      this.totalElements = response.data.payments.totalElements;
      this.transactions = response.data.payments.content;
console.log(this.transactions);
      this.pager = this.pagerService.getPager(this.totalElements);
      this.temp_var = true;
    }, error => {
      this.spinner.hide();
    });
  }

}
