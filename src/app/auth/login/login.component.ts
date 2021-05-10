import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, Validators} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  public formSubmitted = false;
  email: string;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private router: Router, private fb: FormBuilder, private usuarioService: UsuarioService) {
  }

  ngOnInit(): void {
        this.email = localStorage.getItem('email') || '';
        this.loginForm.value.email = this.email;
    }


  login(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.usuarioService.login(this.loginForm.value, this.loginForm.value.remember)
      .subscribe(
        (response: any) => {

          // Guarda usuario y token
          this.usuarioService.guardarDataSession(response.access_token);

          const usuario = this.usuarioService.usuarioValidate;

          Swal.fire('Bienvenido', `${usuario.nombre}, has iniciado sesión correctamente`, 'success');
          this.router.navigate(['/dashboard']);
        },
        error => {
          Swal.fire('Error', error.error.error_description, 'error');
        }
      );

  }

}
