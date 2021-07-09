import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.getUsuarios().then(usuarios => {
      console.log(usuarios);
    });

    // Construyendo promesa
    const promesa = new Promise( (resolve, reject) => {
      if (false){
        resolve('hola M');
      } else{
        reject('algo salio mal');
      }
    });

    // Toma el camino del reject
    promesa.then((mensaje) => {
      console.log(mensaje);
    }).catch(error => console.log('Error en promesa:', error));

    console.log('fin init');
  }


  getUsuarios(): Promise<any>{
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(resp => resp.json())
        .then(body => resolve(body.data));
    });
  }

}
