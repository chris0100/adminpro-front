import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private linkTheme = document.querySelector('#theme');

  constructor() {
    this.loadTheme();
  }

  loadTheme(): void {
    // Si no encuentra nada en el ls, toma otro valor por defecto para url.
    const url = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';

    // Se cambia el atributo
    this.linkTheme.setAttribute('href', url);
  }


  changeTheme(theme: string): void {
    const url = `./assets/css/colors/${theme}.css`;

    // Se cambia el atributo
    this.linkTheme.setAttribute('href', url);
    // se guarda en el localstorage
    localStorage.setItem('theme', url);

    this.checkCurrentTheme();
  }


  checkCurrentTheme(): void {
    const links = document.querySelectorAll('.selector');

    // Se reccorren todos los elementos html, usando vanillaJs
    links.forEach(elem => {
      // se remueven todos los working de las clases
      elem.classList.remove('working');

      // Se obtiene el nombre del tema
      const btnTheme = elem.getAttribute('data-theme');

      // Se arman los href para el actual como para el que se recorre
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme.getAttribute('href');

      // Si son iguales, se añade flecha
      if (btnThemeUrl === currentTheme) {
        elem.classList.add('working');
      }
    });
  }
}
