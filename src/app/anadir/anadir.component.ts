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
  fechacompra:string;
}

@Component({
  selector: 'app-anadir',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './anadir.component.html',
  styles: ``
})
export class AnadirComponent {
  formGroup!: FormGroup;
  cliente: Cliente = {
    nombre: '',
    direccion: '',
    telefono: '',
    fechacompra: ''
  };
  orden:Orden[]=[];

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
      fechacompra: [''],
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
    const { nombre, direccion, telefono, tamano,fechacompra, ingrediente1, ingrediente2, ingrediente3, cantidad } = this.formGroup.value;


    this.cliente = { nombre, direccion, telefono,fechacompra };
    this.comunicacion.guardarCliente(this.cliente);
    const nuevaOrden = {
      tamano: tamano,
      ingrediente1 : ingrediente1,
      ingrediente2 : ingrediente2,
      ingrediente3 : ingrediente3,
      cantidad: cantidad,
    };
    const order  = this.comunicacion.agregarOrden(nuevaOrden)
    console.log(order);
    this.formGroup.get('nombre')?.disable();
    this.formGroup.get('direccion')?.disable();
    this.formGroup.get('telefono')?.disable();
    this.formGroup.get('fechacompra')?.disable();
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
