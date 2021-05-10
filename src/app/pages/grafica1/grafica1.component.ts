import {Component} from '@angular/core';
import {Label, MultiDataSet, Color} from 'ng2-charts';


@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: []
})
export class Grafica1Component {

  // Utiliza estos datos para enviarlos al componente de dona
  public labels1 = ['Pan', 'Refresco', 'tacos'];
  public data1 = [
    [50, 45, 10]
  ];
}
