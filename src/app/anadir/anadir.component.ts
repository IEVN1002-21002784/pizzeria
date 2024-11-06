import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TablacompraComponent } from '../tablacompra/tablacompra.component';
import { ComunicacionService } from '../comunicacion.service';

interface Orden {
  tamano: string;
  ingredientes: string[];
  cantidad: number;
  subtotal: number;
}

interface Cliente {
  nombre: string;
  direccion: string;
  telefono: string;
}

@Component({
  selector: 'app-anadir',
  standalone: true,
  imports: [ReactiveFormsModule, TablacompraComponent],
  templateUrl: './anadir.component.html',
  styles: ``
})
export class AnadirComponent {
  formGroup!: FormGroup;
  cliente: Cliente = {
    nombre: '',
    direccion: '',
    telefono: ''
  };

  constructor(private fb: FormBuilder, private comunicacion: ComunicacionService) {}

  ngOnInit(): void {
    this.formGroup = this.initForm();

    // Cargar datos previos del cliente
    const storedCliente = localStorage.getItem('cliente');
    if (storedCliente) {
      this.cliente = JSON.parse(storedCliente);
    }
  }

  initForm(): FormGroup {
    return this.fb.group({
      nombre: [''],
      direccion: [''],
      telefono: [''],
      tamano: [''],
      ingrediente1: [false],
      ingrediente2: [false],
      ingrediente3: [false],
      cantidad: [''],
    });
  }

  triggerOtherComponentFunction() {
    this.comunicacion.triggerFunction();
  }

  onSubmit(): void {
    let subtotalC = 0;
    const { nombre, direccion, telefono, tamano, ingrediente1, ingrediente2, ingrediente3, cantidad } = this.formGroup.value;


    this.cliente = { nombre, direccion, telefono };
    localStorage.setItem('cliente', JSON.stringify(this.cliente));


    const nuevaOrden: Orden = {
      tamano: tamano,
      ingredientes: [],
      cantidad: cantidad,
      subtotal: 0
    };

    if (ingrediente1) {
      nuevaOrden.ingredientes.push('Jamon');
      subtotalC += 10;
    }
    if (ingrediente2) {
      nuevaOrden.ingredientes.push('Piña');
      subtotalC += 10;
    }
    if (ingrediente3) {
      nuevaOrden.ingredientes.push('Champiñones');
      subtotalC += 10;
    }

    switch (tamano) {
      case 'Chica':
        subtotalC += 40;
        break;
      case 'Mediana':
        subtotalC += 80;
        break;
      case 'Grande':
        subtotalC += 120;
        break;
    }
    subtotalC = subtotalC * cantidad;
    nuevaOrden.subtotal = subtotalC;

    const storedOrdenes = localStorage.getItem('ordenes');
    const ordenes = storedOrdenes ? JSON.parse(storedOrdenes) : [];


    ordenes.push(nuevaOrden);
    localStorage.setItem('ordenes', JSON.stringify(ordenes));

    console.log(ordenes);
    this.comunicacion.triggerFunction();

    this.formGroup.reset({
      direccion: this.formGroup.value.direccion,
      nombre: this.formGroup.value.nombre,
      telefono: this.formGroup.value.telefono,
      tamano: '',
      ingrediente1: false,
      ingrediente2: false,
      ingrediente3: false,
      cantidad: ''
    });
  }
}
