import { Component, OnInit } from '@angular/core';
import { SharedService } from '../service/shared.service';
import { JscriptService } from '../service/jscript.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-page-frame',
  templateUrl: './page-frame.component.html',
  styleUrls: ['./page-frame.component.css']
})
export class PageFrameComponent implements OnInit {
  fullName: string;
  lastLogin: string;
  menu: any = [];
  user: any;
  isMainMerchant: any;
  isRegistrationComplete: any;
  isRegistration: boolean;
  private titleService: Title;
  docs: string;

  constructor(private sharedService: SharedService,
    private router: Router,
    private jscript: JscriptService,
    private activatedRoute: ActivatedRoute) { }
  ngOnInit() {
    // this.router.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    //   map(() => this.activatedRoute),
    //   map((route) => {
    //     while (route.firstChild) {
    //       route = route.firstChild;
    //     }
    //     return route;
    //   }),
    //   filter((route) => route.outlet === 'primary'),
    //   mergeMap((route) => route.data),
    // ).subscribe((event) => {
    //   // this.titleService.setTitle(event['title']);
    this.docs = this.sharedService.docsUrl;
    // });
    this.fullName = this.sharedService.getFullName();
    this.lastLogin = this.sharedService.lastLogin();
    this.isRegistrationComplete = this.sharedService.getisRegistrationComplete();
    const regCompleted = this.sharedService.getRegistrationComplete();
    const load9 = './assets/custom/js/custom.js';
    const load10 = './assets/new_vendor/js/front.js';
    this.isMainMerchant = this.sharedService.getIsMainMerchant();
    this.jscript.load(load9).then(e => true)
      .catch(e => false);
      this.jscript.load(load10).then(e => true)
      .catch(e => false);
    this.menu = this.sharedService.getUserPermistions();
    this.user = this.sharedService.getUser();
    if (this.isRegistrationComplete === 0 && (regCompleted === null || regCompleted === undefined)) {
      this.isRegistration = false;
    } else {
      this.isRegistration = false;
    }
    this.isRegistration = false;
  }

  toggleMenu() {
    if ($(window).outerWidth() > 1194) {
      $('nav.side-navbar').toggleClass('shrink');
      $('.page').toggleClass('active');
  } else {
      $('nav.side-navbar').toggleClass('show-sm');
      $('.page').toggleClass('active-sm');
  }
  }
  logOut() {
    this.sharedService.logout();
    this.router.navigateByUrl('home');
  }

}
