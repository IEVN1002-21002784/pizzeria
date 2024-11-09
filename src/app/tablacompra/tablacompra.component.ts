import { Component } from '@angular/core';
import { FormBuilder, FormControl,FormGroup,FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ComunicacionService } from '../comunicacion.service';
import { CommonModule } from '@angular/common';
interface Orden {
  id:number,
  tamano: string;
  ingredientes: string[];
  cantidad: number;
  subtotal: number;
}
@Component({
  selector: 'app-tablacompra',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './tablacompra.component.html',
  styles: ``
})
export class TablacompraComponent {
  formGroup!: FormGroup;
  ordenEl:Orden[] = []
  ordenesInfo: {
    id:number;
    tamano: string;
    ingredientes: string[];
    cantidad: number;
    subtotal: number;
  }[] = []
  modal = 'hidden';
  constructor(private fb: FormBuilder,private comunicacion: ComunicacionService){}
  ngOnInit() {
    this.formGroup = this.initForm();
    this.comunicacion.triggerFunction$.subscribe(() => {
      this.vertabla();
    });
  }
  initForm(): FormGroup {
    return this.fb.group({
      id:[0]
    });
  }
  vertabla(){
    this.ordenesInfo = this.comunicacion.vercompra();
    console.log(this.ordenesInfo);

  }
  eliminar(): void{
    const {id} = this.formGroup.value;
    this.comunicacion.eliminarOrden(id);
  }
  agregar():void{
    this.modal = 'flex'
  }
  cerrar():void{
    this.modal = 'hidden'
  }
  confirmar():void{
    this.comunicacion.agregar();
  }

}
