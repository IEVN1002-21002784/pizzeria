import { JsonPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { PreloadAllModules } from '@angular/router';
import { Subject } from 'rxjs';

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
interface OrdenesGuardadas{
  nombre:string;
  total:number;
  fecha_compra:string|number;
}
@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  ordenesInfo: {
    id:number;
    tamano: string;
    ingredientes: string[];
    cantidad: number;
    subtotal: number;
  }[] = []
  nuevaordenFinal : {
    nombre:string;
    dir: string;
    total:string;
    fecha_compra:string;
  }[]=[]
  private triggerFunctionSource = new Subject<void>();
  triggerFunction$ = this.triggerFunctionSource.asObservable();

  triggerFunction() {
    this.triggerFunctionSource.next();
  }
  guardarCliente(cliente: Cliente) {
    console.log(cliente);
    localStorage.setItem('cliente', JSON.stringify(cliente));
  }

  ObtenerCliente(): Cliente | null {
    const guardadoCliente = localStorage.getItem('cliente');
    return guardadoCliente ? JSON.parse(guardadoCliente) : null;
  }
  ObternerOrdenes(): Orden[]{
    const guardadoorden = localStorage.getItem('ordenes');
    return guardadoorden ? JSON.parse(guardadoorden) : [];
  }

  agregarOrden(ordenData: any): Orden[] {
    let subtotalC = 0;
    const { tamano, ingrediente1, ingrediente2, ingrediente3, cantidad } = ordenData;

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

    this.triggerFunction();
    return ordenes;
  }
  eliminarOrden(id: any){
    console.log('el id a eliminar es '+ id);
    const datos = localStorage.getItem('ordenes');
    if (datos) {
      let ordenEl:Orden[] = [];
      ordenEl = JSON.parse(datos);
      if (id >= 0 && id < ordenEl.length) {
        ordenEl.splice(id, 1);
        console.log(ordenEl);
        localStorage.setItem('ordenes', JSON.stringify(ordenEl));
        console.log('Se eliminó el registro');
        this.triggerFunction();
      } else {
        console.log('Índice no válido.');
      }
    }
  }
  vercompra(){
    this.ordenesInfo = []
    let ordenesG:Orden[] = []
    let id = 0
    const datos = localStorage.getItem('ordenes')
    if(datos){
      ordenesG = JSON.parse(datos)
      ordenesG.forEach(orden => {
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
      return this.ordenesInfo;
      console.log(this.ordenesInfo);
    }else{
      return []
    }
  }

  agregar(){
    let total = 0;
    const cliente = this.ObtenerCliente();

    if (cliente) {
      const {nombre,direccion,fechacompra} = cliente;
      const ordenesGuardas = this.ObternerOrdenes();
      if(ordenesGuardas){
        console.log(ordenesGuardas)
        ordenesGuardas.forEach(orden => {
          total += orden.subtotal;
        });
    }
    if(fechacompra === ""){
      const fecha = new Date();
      const fechacompra = fecha.toISOString().split('T')[0];
      console.log(fechacompra);
    }
    const nuevaOrden: OrdenesGuardadas ={
      nombre: nombre,
      total: total,
      fecha_compra: fechacompra
    };
    console.log(nuevaOrden);
    const guardadasOrdenes = localStorage.getItem('OrdenesGuardas');
    const ordenes = guardadasOrdenes ? JSON.parse(guardadasOrdenes) : [];
    ordenes.push(nuevaOrden);
    localStorage.setItem('OrdenesGuardas', JSON.stringify(ordenes));
    console.log(ordenes);
    }
    localStorage.removeItem('ordenes');
    localStorage.removeItem('cliente');
    window.location.reload();
  }

  filtrar(opcion: string, fechafiltro: string | number) {
    let ventasJ: { nombre: string; total: number; fecha_compra: string | null }[][] = [];
    const ventas = localStorage.getItem('OrdenesGuardas');

    if (ventas) {
        ventasJ = JSON.parse(ventas);
    }

    const ventasPlanas = ventasJ.flat();
    let ventasFiltradas;

    if (opcion === 'dia') {
        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

        ventasFiltradas = ventasPlanas.filter(element => {
            if (element.fecha_compra) {
                const [year, month, day] = element.fecha_compra.split('-').map(Number);
                const fecha = new Date(year, month - 1, day);
                const diaSemana = diasSemana[fecha.getDay()];
                return diaSemana.toLowerCase() === fechafiltro.toString().toLowerCase();
            }
            return false;
        });
    } else if (opcion === 'mes') {
        const filtroTexto = String(fechafiltro).padStart(2, '0');

        ventasFiltradas = ventasPlanas.filter(element => {
            if (element.fecha_compra) {
                const [, mes] = element.fecha_compra.split('-');
                return mes === filtroTexto;
            }
            return false;
        });
    }

    return ventasFiltradas;
}


}

