import {Component, OnDestroy} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {filter, map, retry, take} from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnDestroy{

  public intervalSubs: Subscription;

  constructor() {


/*    // se suscribe al observable
    this.retornaObservable().pipe(
      retry(1) // en caso de que encuentre un error continua la ejecucion.
    )
      .subscribe(
        valor => console.log('Subs:', valor),
        (err) => console.warn('Error', err),
        // tslint:disable-next-line:no-console
        () => console.info('obs termina'));*/

    this.intervalSubs = this.retornaIntervalo()
      .subscribe((valor) => console.log(valor));
  }


  retornaObservable(): Observable<number> {
    let i = 0;

    return new Observable<number>(observer => {


      // inicia un intervalo de cada segundo
      const intervalo = setInterval(() => {
        i++;
        // emite el siguiente valor
        observer.next(i);

        // Si es igual a 4 completa el observable
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        // si llega al valor de 2, se emite un error
        if (i === 2) {
          observer.error('i llego al valor de 2');
        }
      }, 1000);
    });
  }


  retornaIntervalo(): Observable<number> {
    return interval(500)
      .pipe(
        // take(10),
        map(valor => {
          return valor + 1;
        }),
        filter(valor => (valor % 2 === 0))
      );
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

}
