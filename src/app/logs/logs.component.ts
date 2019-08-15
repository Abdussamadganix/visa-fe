import { Component, OnInit } from '@angular/core';
import { LogsService } from './logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  temp_var: boolean;
  log: any = {}
  constructor(private logService: LogsService) { }

  ngOnInit() {
    this.getLog();
  }

  getLog(){
    const body = {
      "uniqueKey": "c8baeef6c5"
    }
    this.logService.viewLogs(body).subscribe(response => { 
      this.temp_var = true;
      this.log = response.data.payment
      console.log(response)
    });
  }

}
