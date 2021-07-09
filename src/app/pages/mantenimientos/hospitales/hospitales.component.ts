import {Component, OnDestroy, OnInit} from '@angular/core';
import {HospitalService} from '../../../services/hospital.service';
import {Hospital} from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import {UsuarioService} from '../../../services/usuario.service';
import {ModalImagenService} from '../../../services/modal-imagen.service';
import {Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';
import {BusquedasService} from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando = true;
  private imgSubs: Subscription;
  public totalHospitales = 0;

  constructor(private hospitalService: HospitalService, private usuarioService: UsuarioService,
              private modalImagenService: ModalImagenService, private busquedaService: BusquedasService) {
  }

  ngOnInit(): void {

    this.cargarHospitales();

    // luego de que es emitida la imagen, realiza el subscribe
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarHospitales());
  }


  buscar(termino: string): void {
    if (termino.length === 0) {
      return this.cargarHospitales();
    }
    console.log(termino);
    this.busquedaService.buscar('hospitales', termino)
      .subscribe(resp => {
        this.hospitales = resp;
      });
  }


  cargarHospitales(): void {
    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe(
        resp => {
          this.hospitales = resp;
          this.cargando = false;
          this.totalHospitales = this.hospitales.length;
        }
      );
  }


  guardarCambios(hospital: Hospital): void {
    this.hospitalService.actualizarHospital(hospital.nombre, hospital.id)
      .subscribe(
        resp => {
          Swal.fire('Actualizado', resp.mensaje, 'success');
        }
      );
  }


  eliminarHospital(hospital: Hospital): void {
    this.hospitalService.eliminarHospital(hospital.id)
      .subscribe(
        resp => {
          this.hospitales.splice(this.hospitales.indexOf(hospital), 1);
          Swal.fire('Eliminado', resp.mensaje, 'success');
        }
      );
  }


  async abrirSweetAlert() {
    const {value} = await Swal.fire<string>({
      title: 'Nuevo Hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (value.trim().length > 0) {
      this.hospitalService.creacionHospital(value, this.usuarioService.usuario.id)
        .subscribe(resp => {
          this.hospitales.push(resp.hospital);
        });
    }
  }


  abrirModal(hospital: Hospital) {
    // le envio siempre usuario porque en el backend tengo para cargar imagen con usuario.
    this.modalImagenService.abrirModal('hospital', hospital.id, hospital.img);
  }


  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

}
