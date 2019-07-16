import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class JscriptService {

  // load0 : string = '/assets/plugins/jquery/jquery.min.js';
  // load1 : string = '/assets/plugins/bootstrap/js/bootstrap.js';
  //  load2 : string = '/assets/plugins/jquery-slimscroll/jquery.slimscroll.js';
  //  load3 : string  = '/assets/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js';
  //  load4 : string  = '/assets/plugins/node-waves/waves.js';
  //  load5 : string  = '/assets/plugins/jquery-countto/jquery.countTo.js';
  //  load6 : string  = '/assets/plugins/raphael/raphael.min.js';
  //  load7 : string  = '/assets/plugins/jquery-sparkline/jquery.sparkline.js';
  //  load8 : string  = '/assets/js/admin.js';
  //  load9 : string  = '/assets/js/pages/index.js';
  //  load10 : string  = '/assets/js/demo.js';


  script: any;
  scriptElement: any;
  body: any;

  constructor() {
    // this.script =  scripts;
    // this.scriptElement = document.createElement('script');
    // // this.body = document.querySelector('body');
    // this.body = document.getElementById('appendScript');

  }

  // load(load8){
  //   var promise = new Promise((resolve, reject) =>{
  //     this.scriptElement.src = load8;
  //     this.scriptElement.onload = e => resolve(e);
  //     this.scriptElement.onerror = e => reject(e);
  //     // this.head.appendChild(this.scriptElement);
  //     this.body.appendChild(this.scriptElement);

  //   });

  //   return promise;
  // }

  load(load8) {
    const scriptElement = document.createElement('script');
    // this.body = document.querySelector('body');
    const body = document.getElementById('appendScript');
    const promise = new Promise((resolve, reject) => {
      scriptElement.src = load8;
      scriptElement.onload = e => resolve(e);
      scriptElement.onerror = e => reject(e);
      // this.head.appendChild(this.scriptElement);
      body.appendChild(scriptElement);

    });

    return promise;
  }


  // public updateUrlScripts() {



  //   (<HTMLInputElement>document.getElementById("load0")).remove();
  //   (<HTMLInputElement>document.getElementById("load1")).remove();
  //   (<HTMLInputElement>document.getElementById("load2")).remove();
  //   (<HTMLInputElement>document.getElementById("load3")).remove();
  //   (<HTMLInputElement>document.getElementById("load4")).remove();
  //   (<HTMLInputElement>document.getElementById("load5")).remove();
  //   (<HTMLInputElement>document.getElementById("load6")).remove();
  //   (<HTMLInputElement>document.getElementById("load7")).remove();
  //   (<HTMLInputElement>document.getElementById("load8")).remove();
  //   (<HTMLInputElement>document.getElementById("load9")).remove();
  //   (<HTMLInputElement>document.getElementById("load10")).remove();

  //   const load0 = document.createElement("script");
  //   const load1 = document.createElement("script");
  //   const load2 = document.createElement("script");
  //   const load3 = document.createElement("script");
  //   const load4 = document.createElement("script");
  //   const load5= document.createElement("script");
  //   const load6 = document.createElement("script");
  //   const load7 = document.createElement("script");
  //   const load8 = document.createElement("script");
  //   const load9 = document.createElement("script");
  //   const load10 = document.createElement("script");

  //   load0.setAttribute("id", "load0");
  //   load0.setAttribute("src", this.load0);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load0);

  //   load1.setAttribute("id", "load1");
  //   load1.setAttribute("src", this.load1);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load1);

  //   load2.setAttribute("id", "load2");
  //   load2.setAttribute("src", this.load2);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load2);

  //   load3.setAttribute("id", "load3");
  //   load3.setAttribute("src", this.load3);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load3);

  //   load4.setAttribute("id", "load4");
  //   load4.setAttribute("src", this.load4);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load4);

  //   load5.setAttribute("id", "load5");
  //   load5.setAttribute("src", this.load5);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load5);

  //   load6.setAttribute("id", "load6");
  //   load6.setAttribute("src", this.load6);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load6);

  //   load7.setAttribute("id", "load7");
  //   load7.setAttribute("src", this.load7);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load7);

  //   load8.setAttribute("id", "load8");
  //   load8.setAttribute("src", this.load8);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load8);

  //   load9.setAttribute("id", "load9");
  //   load9.setAttribute("src", this.load9);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load9);

  //   load10.setAttribute("id", "load10");
  //   load10.setAttribute("src", this.load10);
  //   (<HTMLInputElement>document.getElementById("myScript")).appendChild(load10);


  // }

}
