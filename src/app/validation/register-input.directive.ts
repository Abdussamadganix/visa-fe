import { Directive, HostListener, Input, ElementRef, forwardRef } from '@angular/core';
import * as $ from 'jquery';
import { NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appRegisterInputValidator]'
})
export class RegisterInputDirective {

  @Input() cardNumber: string;

  constructor() {
  }
  @HostListener('focus', ['$event']) onfocus(event) {
    // if (event.key === ''  || event.key === undefined || event.key === null) {
    //   $('#' + event.target.id).css('border-color', 'red');
    // }
    // this.validateCard(event, '');
  }

  // @HostListener('click', ['$event']) onclick(event) {
  //   if (event.key === ''  || event.key === undefined || event.key === null) {
  //     $('#' + event.target.id).css('border-color', 'red');
  //   }
  //   // this.validateCard(event, '');
  // }

  @HostListener('blur', ['$event']) onblur(event) {
    const val = event.target.value.length;
    if (val <= 0) {
      // $('#' + event.target.id).css('border-color', 'red');
      $('#' + event.target.id).addClass('is-invalid');
      return;
    }
    $('#' + event.target.id).removeClass('is-invalid');
    // $('#' + event.target.id).css('border-color', 'green');
    // this.validateCard(event, '');
  }

  // @HostListener('keyup', ['$event']) onkeyup(event) {
  //   if (event.key === ''  || event.key === undefined || event.key === null) {
  //     $('#' + event.target.id).css('border-color', 'none');
  //   }
  //   // this.validateCard(event, '');
  // }

  @HostListener('mouseup', ['$event']) onmouseup(event) {
    // if (event.key === ''  || event.key === undefined || event.key === null) {
    //   $('#' + event.target.id).css('border-color', 'red');
    //   return;
    // }
    // $('#' + event.target.id).css('border-color', 'none');
    // this.validateCard(event, '');
  }
  // validateCard(event, cardNumber) {
  //   if ($.inArray(event.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
  //     ((event.keyCode === 65 || event.keyCode === 86 || event.keyCode === 67) && (event.ctrlKey === true || event.metaKey === true)) ||
  //     (event.keyCode >= 35 && event.keyCode <= 40)) {
  //     return;
  //   }
  //   if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
  //     event.preventDefault();
  //   }
  //   if (cardNumber.length > 25) {
  //     event.preventDefault();
  //     $(this).next('#mm-yy').focus();
  //   }
  //   event.target.value = event.target.value.replace(
  //     /\s/g, ''
  //   ).replace(
  //     /[^\0-9]/g, ''
  //   ).replace(
  //     /(.{4})/g, '$1 '
  //   ).replace(
  //     /[^\d\ ]|^[\ ]*$/g, ''
  //   );
  // }


}
