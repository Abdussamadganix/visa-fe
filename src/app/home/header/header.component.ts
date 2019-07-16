import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/service/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
docs: string;
  constructor(public sharedService: SharedService) { }

  ngOnInit() {
    this.docs = this.sharedService.docsUrl;
  }

}
