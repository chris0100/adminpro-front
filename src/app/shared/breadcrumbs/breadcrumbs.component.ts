import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, ActivationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string;
  public titulosSubs$: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {
    // console.log(route.snapshot.children[0].data);
    this.titulosSubs$ = this.getArgumentosRuta()
      .subscribe(data => {
        this.titulo = data;
        // colocarlo en el titulo de la pestaña
        document.title = `AdminPro - ${data}`;
      });
  }


  getArgumentosRuta(): Observable<string> {
    return this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data.titulo)
      );
  }

  ngOnDestroy(): void {
    this.titulosSubs$.unsubscribe();
  }


}
