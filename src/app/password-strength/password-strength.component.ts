import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  styleUrls: ['./password-strength.component.scss'],
  templateUrl: './password-strength.component.html',
})
export class PasswordStrengthComponent implements OnChanges {
  bar0!: string;
  bar1!: string;
  bar2!: string;

  @Input() public passwordToCheck!: string;

  @Output() passwordStrength = new EventEmitter<boolean>();

  message!: string;
  messageColor!: string;

  checkStrength(password: string) {
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g; // special symbols
    const lowerLetters = /[a-z]+/.test(password);
    const upperLetters = /[A-Z]+/.test(password);
    const letters = lowerLetters || upperLetters;
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);

    const hasLettersAndSymbols = letters && symbols;
    const hasLettersAndNumbers = letters && numbers;
    const hasNumbersAndSymbols = numbers && symbols;

    // When field is empty
    if (password.length == 0) {
      return 'not entered';
    }

    // Less than 8 characters
    if (password.length < 8) {
      return 'short';
    }

    // Only one type of characters
    if (!hasLettersAndSymbols && !hasLettersAndNumbers && !hasNumbersAndSymbols) {
      return 'easy';
    }

    // Two types of characters but not all
    if ((hasLettersAndSymbols || hasLettersAndNumbers || hasNumbersAndSymbols) && !(letters && numbers && symbols)) {
      return 'medium';
    }

    // All types of characters
    if (letters && numbers && symbols) {
      return 'strong';
    }
    else {
      return 'Bad value';
    }
  }

  getColor(strength: string) {
    let index = 0;
    let color = '';
    switch (strength) {
      case 'not entered':
        index = -1;
        color = 'gray';
        break;
      case 'short':
        index = 0;
        color = 'red';
        break;
      case 'easy':
        index = 1;
        color = 'red';
        break;
      case 'medium':
        index = 2;
        color = 'yellow';
        break;
      case 'strong':
        index = 3;
        color = 'green';
        break;
      default:
        index = 3;
        color = 'gray';
        break;
    }
    return {
      index,
      color,
    };
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToCheck.currentValue;

    if (!password) {
      this.setBarColors(-1, 'gray');
      this.message = '';
    } else {
      const strength = this.checkStrength(password) as string;
      const colorInfo = this.getColor(strength);
      this.setBarColors(colorInfo.index, colorInfo.color);
      console.log(colorInfo.index);
      switch (strength) {
        case 'short':
          this.message = 'Short';
          break;
        case 'easy':
          this.message = 'Easy';
          break;
        case 'medium':
          this.message = 'Medium';
          break;
        case 'strong':
          this.message = 'Strong';
          break;
      }
    }
  }

  setBarColors(count: number, color: string) {
    if (count == -1) {
      for (let i = 0; i < 3; i++) {
        (this as any)['bar' + i] = color;
      }
    }
    if (count == 0) {
      for (let i = 0; i < 3; i++) {
        (this as any)['bar' + i] = color;
      }
    }
    else {
      for (let i = 0; i < count; i++) {
        (this as any)['bar' + i] = color;
      }
      for (let i = count; i < 3; i++) {
        (this as any)['bar' + i] = 'gray';
      }
    }

  }
}