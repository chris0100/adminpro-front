import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsuarioService} from '../../services/usuario.service';
import Swal from 'sweetalert2'
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terminos: [false, Validators.required]
  }, {
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder, private usuarioService: UsuarioService,
              private router: Router) { }


  crearUsuario(): void{
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid){
      return;
    }

    // Manda info al servicio que crea usuario.
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(
        obj => {
          this.usuarioService.login(this.registerForm.value, false).subscribe(
            (response: any) => {
              // Guarda usuario y token
              this.usuarioService.guardarDataSession(response.access_token);

              const usuario = this.usuarioService.usuarioValidate;

              Swal.fire('Bienvenido', `${usuario.nombre}, has iniciado sesión correctamente`, 'success');

              this.router.navigate(['/dashboard']);
            }
          );
        }, (err) => {
          Swal.fire('Error', err.error.error, 'error');
        });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted){
      return true;
    }
    else {
      return false;
    }
  }

  aceptarTerminos(): boolean {
    // Si se envia el submit y esta en false chequeo de terminos, retornva un true
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }


  passwordsNoValidos(): boolean{
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    // Si son diferentes, son invalidas y si el formulario ha sido posteado
    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    }
    else {
      return false;
    }
  }


  passwordsIguales(pass1Name: string, pass2Name: string): any{

    return (formGroup: FormGroup) => {
      // Se pasan valores de passwords
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value){
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({noEsIgual: true});
      }
    };
  }


}
