import {Component, OnDestroy, OnInit} from '@angular/core';
import {MedicoService} from '../../../services/medico.service';
import {Medico} from '../../../models/medico.model';
import {Hospital} from '../../../models/hospital.model';
import {ModalImagenService} from '../../../services/modal-imagen.service';
import {Subscription} from 'rxjs';
import {delay} from 'rxjs/operators';
import {BusquedasService} from '../../../services/busquedas.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;
  public totalMedicos = 0;


  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) { }

  ngOnInit(): void {
    this.cargarMedicos();

    // luego de que es emitida la imagen, realiza el subscribe
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarMedicos());
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(
        resp => {
          this.cargando = false;
          this.medicos = resp;
          this.totalMedicos = this.medicos.length;
        });
  }


  abrirModal(medico: Medico){
    // le envio siempre usuario porque en el backend tengo para cargar imagen con usuario.
    this.modalImagenService.abrirModal('medico', medico.id, medico.img);
  }

  buscar(termino: string){
    if (termino.length === 0) {
      return this.cargarMedicos();
    }
    this.busquedaService.buscar('medicos', termino)
      .subscribe(resp => {
        this.medicos = resp;
      });
  }

  borrarMedico(medico: Medico) {

    Swal.fire({
      title: '¿Esta seguro de eliminarlo?',
      text: 'Esta accion no puede ser revertida',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value){
        this.medicoService.eliminarMedicos(medico.id).subscribe(
          resp => {
            Swal.fire(
              'Eliminado',
              resp.mensaje,
              'success'
            );
            this.cargarMedicos();
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }


}
