import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HospitalService} from '../../../../services/hospital.service';
import {Hospital} from '../../../../models/hospital.model';
import {MedicoService} from '../../../../services/medico.service';
import {Medico} from '../../../../models/medico.model';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {delay} from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    // obtiene los parametros de la ruta
    this.activatedRoute.params
      .subscribe(({id}) => this.cargarMedico(id));


    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();


    // cuando se selecciona un hospital se activa
    this.medicoForm.get('hospital').valueChanges
      .subscribe(resp => {
        this.hospitalSeleccionado = this.hospitales.find(h => h.id === resp);
      });
  }


  cargarMedico(id: string) {

    if (id === 'nuevo'){
      return;
    }

    this.medicoService.obtenerMedicoById(id)
      .pipe( // se coloca el delay para que de tiempo de cargar la foto del hospital
        delay(100)
      )
      .subscribe(resp => {
        console.log(resp);
        // tslint:disable-next-line:no-shadowed-variable
        const {nombre, hospital: {id}} = resp.medico;
        this.medicoSeleccionado = resp.medico;
        this.medicoForm.setValue({nombre, hospital: id});
      }, error => {
        if (error.error.mensaje){
          return this.router.navigateByUrl('/dashboard/medicos');
        }
      });
  }


  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe((resp: Hospital[]) => {
        this.hospitales = resp;
      });
  }


  guardarMedico() {

    console.log(this.medicoSeleccionado);
    if (this.medicoSeleccionado) {
      // actualizar
      console.log(this.medicoForm.value);
      const {nombre, hospital} = this.medicoForm.value;

      this.medicoSeleccionado.nombre = nombre;
      this.medicoSeleccionado.hospital.id = hospital;
      this.medicoService.actualizarMedicos(this.medicoSeleccionado)
        .subscribe(resp => {
          Swal.fire('Modificado', resp.mensaje, 'success');
          console.log(resp);
        });

    } else {
      // crear
      const medico: Medico = new Medico(this.medicoForm.value.nombre, null, 'sin-foto.png', null, this.hospitalSeleccionado);
      medico.usuario = this.hospitalSeleccionado.idUsuarioCreate;

      this.medicoService.creacionMedicos(medico)
        .subscribe(resp => {
          console.log(resp);
          Swal.fire('Creado', resp.mensaje, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico.id}`);
        });
    }



  }

}
