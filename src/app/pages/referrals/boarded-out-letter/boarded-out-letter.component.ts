import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-boarded-out-letter',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './boarded-out-letter.component.html',
  styleUrls: ['./boarded-out-letter.component.scss']
})
export class BoardedOutLetterComponent {
email = 'info@mohz.go.tz'
  constructor(
    @Inject(MAT_DIALOG_DATA) public referral: any
  ) {}

  print() {
    window.print();
  }
}