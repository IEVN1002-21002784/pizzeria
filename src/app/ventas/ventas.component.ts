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
  tipo: string = '';
  resultadoF: { nombre: string; total: number; fecha_compra: string | null }[] | null | undefined = [];
  ventasTotal:number = 0;
  mensajerror:string = 'none';
  constructor(private fb: FormBuilder, private comunicacion: ComunicacionService) {}

  ngOnInit() {
    this.formulario = this.initForm();
  }

  initForm(): FormGroup {
    return this.fb.group({
      tipo: [this.tipo],
      dia :[''],
      mes: ['']
    });
  }

  onSubmit(): void {
    this.ventasTotal = 0;
    let fechafiltro;
    const { tipo, dia, mes } = this.formulario.value;

    if (tipo === 'dia') {
        fechafiltro = dia;
    } else if (tipo === 'mes') {
        fechafiltro = mes;
    }

    this.resultadoF = this.comunicacion.filtrar(tipo, fechafiltro);

    if (Array.isArray(this.resultadoF) && this.resultadoF.length > 0) {
        this.mensajerror = 'none';
        this.resultadoF.forEach(resultado => {
            this.ventasTotal += resultado.total;
        });
    } else {
        this.mensajerror = 'flex';
    }
    console.log(this.mensajerror);
}

}
