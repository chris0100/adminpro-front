import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  // Si no vienen datos, toma por defecto los que se estan definiendo.
  @Input() progreso = 50;
  @Input() btnClass = 'btn-primary';

  @Output() valorSalida: EventEmitter<number> = new EventEmitter<number>();


  cambiarValor(valor: number): void {
    if (this.progreso >= 100 && valor >= 0) {
      this.valorSalida.emit(100);
      this.progreso = 100;
      return;
    }

    if (this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0);
      this.progreso = 0;
      return;
    }
    this.progreso = this.progreso + valor;
    this.valorSalida.emit(this.progreso);
  }

  ngOnInit(): void {
    this.btnClass = `btn ${this.btnClass}`;
  }


  onChange(valor: number): void {
    if (valor >= 100) {
      this.progreso = 100;
    } else if (valor <= 0) {
      this.progreso = 0;
    } else {
      this.progreso = valor;
    }
    this.valorSalida.emit(valor);
  }

}
