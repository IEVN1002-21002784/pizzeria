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
  ordenesG:Orden[] = []
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
    console.log('click ver tabla');
    this.ordenesInfo = [];
    let id = 0;
    const datos = localStorage.getItem('ordenes')
    if(datos){
      this.ordenesG = JSON.parse(datos)
      console.log(this.ordenesG);
      this.ordenesG.forEach(orden => {
        let info = {
          id: id,
          tamano: orden.tamano,
          ingredientes: orden.ingredientes,
          cantidad: orden.cantidad,
          subtotal: orden.subtotal
        }
        this.ordenesInfo.push(info);
        id++;
      });
      console.log(this.ordenesInfo);
    }
  }
  eliminar(): void{
    const {id} = this.formGroup.value;
    console.log('el id a eliminar es '+ id);
    const datos = localStorage.getItem('ordenes');
    if (datos) {
      this.ordenEl = JSON.parse(datos);
      if (id >= 0 && id < this.ordenEl.length) {
        this.ordenEl.splice(id, 1);
        console.log(this.ordenEl);
        localStorage.setItem('ordenes', JSON.stringify(this.ordenEl));
        console.log('Se eliminó el registro');
        this.vertabla();
      } else {
        console.log('Índice no válido.');
      }
    }
  }
  agregar():void{
    console.log('Aqui pon tu api wey');
  }
}
