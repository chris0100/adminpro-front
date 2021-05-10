import {Component, Input} from '@angular/core';
import {Color, Label, MultiDataSet} from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent  {

  @Input() title = 'Sin titulo';
  // tslint:disable-next-line:no-input-rename
  @Input('labels') doughnutChartLabels: Label[] = ['Label1', 'Label2', 'Label3'];
  // tslint:disable-next-line:no-input-rename
  @Input('data') doughnutChartData: MultiDataSet = [
    [10, 20, 30]
  ];


  public colors: Color[] = [
    {backgroundColor: ['#9E120E', '#FF5800', '#FFB414']}
  ];

}
