import { Component } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent {


  progreso1 = 15;
  progreso2 = 20;

  get getProgreso1(): string {
    return `${this.progreso1}%`;
  }

  get getProgreso2(): string {
    return `${this.progreso2}%`;
  }




}
