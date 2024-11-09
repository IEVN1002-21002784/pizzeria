import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule ,FormsModule} from '@angular/forms';
import { ComunicacionService } from '../comunicacion.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './ventas.component.html',
  styles: [],
})
export class VentasComponent implements OnInit {
  formulario!: FormGroup;
  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  tipo: string = ''; // Variable para almacenar el tipo seleccionado
  constructor(private fb: FormBuilder, private comunicacion: ComunicacionService) {}

  ngOnInit() {
    this.formulario = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      tipo: [this.tipo], // Establece el valor inicial del formulario
    });
  }

  filtropor() {
    // Esta función ahora actualiza la variable `tipo` al seleccionar un radio button.
    // No es necesario cambiar la visibilidad de los elementos en el TS, ya que usamos *ngIf en el HTML.
  }
}
