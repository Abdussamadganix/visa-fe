import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SharedService } from 'src/app/service/shared.service';
// import Chart from 'chart.js';
import {TransactionService} from '../../transaction/transaction.service';
import {DashboardService} from '../dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  myChart: any;
  myDoughnutChart: any;
  merchantKey: any;
  transactions: any;
  transactionsAmount: any;
  myBarChart: any;

  constructor(private dashboardService: DashboardService,
              private sharedService: SharedService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit()  {
  }

  chart() {
    this.spinner.show();
    this.merchantKey = this.sharedService.getMerchantId();
    this.dashboardService.getTransactionAmountSummary(this.merchantKey).subscribe(resp => {
      this.transactionsAmount = resp.data.statusAmount;
    }, error => { this.spinner.hide(); });
    this.dashboardService.getTransactionSummary(this.merchantKey).subscribe(response => {
      this.spinner.hide();
      this.transactions = response.data.statusCounts;
      const ctx = document.getElementById('myBarChart');
      this.myBarChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: ['Successful', 'Pending', 'Incomplete', 'Canceled', 'Declined', 'Failed'],
          datasets: [{
            // label: '# of Votes',
            data: [this.transactionsAmount.SUCCESSFUL,
              this.transactionsAmount.PENDING, this.transactionsAmount.INCOMPLETE, this.transactionsAmount.CANCELED,
              this.transactionsAmount.DECLINED, this.transactionsAmount.FAILED],
            backgroundColor: [
              'rgba(124,252,0)',
              'rgba(241, 241, 241)',
              'rgba(131, 131, 131)',
              'rgba(255,255,0)',
              'rgba(47,79,79)',
              'rgba(255, 106, 47)',
            ],
            borderWidth: 1
          }]
        },
        options: {
          legend: {
            display: false,
            labels: {
              fontColor: 'rgba(0,0,0)'
            },
            position: 'left'
          }
        }
      });


      const pie = document.getElementById('myDoughnutChart');
      this.myDoughnutChart = new Chart(pie, {
        type: 'doughnut',
        data: {
          labels: ['Successful', 'Failed', 'Pending', 'Incomplete', 'Canceled', 'Declined'],
          datasets: [{
            label: '# of Votes',
            data: [this.transactions.SUCCESSFUL, this.transactions.FAILED,
              this.transactions.PENDING, this.transactions.INCOMPLETE, this.transactions.CANCELED, this.transactions.DECLINED],
            // data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
              'rgba(124,252,0)',
              'rgba(255, 106, 47)',
              'rgba(241, 241, 241)',
              'rgba(131, 131, 131)',
              'rgba(255,255,0)',
              'rgba(47,79,79)'
            ],
            borderColor: [
              'rgba(124,252,0)',
              'rgba(255, 106, 47)',
              'rgba(241, 241, 241)',
              'rgba(131, 131, 131)',
              'rgba(255,255,0)',
              'rgba(47,79,79)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          legend: {
            display: true,
            labels: {
              fontColor: 'rgba(0,0,0)'
            },
            position: 'left'
          }
        }
      });

    }, error => { this.spinner.hide(); });
    // this.dashboardService.getTransactionSummary(this.merchantKey).subscribe(response => {
      // this.transactions = response.data.statusCounts;
      // this.getTransactionSummary();
    // });
  }

  ngAfterViewInit() {
    this.chart();
  }
}
