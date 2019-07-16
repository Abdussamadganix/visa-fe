import { Directive, Input, HostListener, forwardRef, Attribute } from '@angular/core';
import * as $ from 'jquery';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appPasswordStrength]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => PasswordStrengthDirective), multi: true }
  ]
})
export class PasswordStrengthDirective implements Validator {

  @Input() passwordStrength: string;
  constructor(
    @Attribute('validatePassword')
    public invalidPassword: boolean
  ) { }

  test(pass) {
    const tests = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i];
    let s = 0;
    if (pass === null) {
      return -1;
    }
    if (pass.length < 6) {
      return 0;
    }
    for (const i in tests) {
      if (tests[i].test(pass)) {
        s++;
        return s;
      }
    }
  }

  validate(ctrl: AbstractControl): { [key: string]: any } {
    const password = ctrl.value;
    let hasLower = false;
    let hasUpper = false;
    let hasNum = false;
    let hasSpecial = false;

    const lowercaseRegex = new RegExp('(?=.*[a-z])');
    // has at least one lower case letter
    if (lowercaseRegex.test(password)) {
      hasLower = true;
    }

    const uppercaseRegex = new RegExp('(?=.*[A-Z])');
    // has at least one upper case letter
    if (uppercaseRegex.test(password)) {
      hasUpper = true;
    }

    const numRegex = new RegExp('(?=.*\\d)'); // has at least one number
    if (numRegex.test(password)) {
      hasNum = true;
    }

    const specialcharRegex = new RegExp('[!@#$%^&*(),.?\':{}|<>]');
    if (specialcharRegex.test(password)) {
      hasSpecial = true;
    }

    let counter = 0;
    const checks = [hasLower, hasUpper, hasNum, hasSpecial];
    for (let i = 0; i < checks.length; i++) {
      if (checks[i]) {
        counter += 1;
      }
    }
    if (counter === 1 && (password.length >= 4 && password.length < 8)) {
      $('#password-str').text('Weak');
      $('#password-str').css('background-color', 'red');
      $('#password-str').width('25%');
    }
    if (counter === 2 && (password.length > 8)) {
      // $('#password-str').text('')
      $('#password-str').text('Fair');
      $('#password-str').css('background-color', 'yellow');
      $('#password-str').width('50%');
    }
    if (counter === 3 && (password.length > 8)) {
      // $('#password-str').text('')
      $('#password-str').text('Medium');
      $('#password-str').css('background-color', 'blue');
      $('#password-str').width('75%');
    }
    if (counter === 4 && (password.length > 8)) {
      // $('#password-str').text('')
      $('#password-str').text('Strong');
      $('#password-str').css('background-color', 'green');
      $('#password-str').width('100%');
    }
    if ((password.length > 0 && password.length < 4)) {
      $('#password-str').css('background-color', 'gray');
      $('#password-str').width('10%');
      $('#password-str').text('Weak');
      // return null;
    }
    return;
  }
}


