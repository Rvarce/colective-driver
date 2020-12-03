import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SettingComponent } from "../components/setting/setting.component";
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from "../components/popover/popover.component";
import { ColectivoService } from "../services/colectivo.service";
import { Conductor } from "../interfaces/conductor";
import { Rentabilidad } from '../interfaces/rentabilidad';

@NgModule({
  imports: [FormsModule]
})

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  conductor: Conductor = {
    perfil: {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      direccion: '',
      comuna: '',
      ciudad: '',
      pais: '',
      email: ''
    },
    vehiculo: {
      dueño: false,
      marcaVehiculo: '',
      modeloVehiculo: '',
      patenteVehiculo: ''
    },
    configIngresos: {
      valorPasaje: 0,
      intervalo: ''
    },
    configGastos: {
      combustible: 0,
      entrega: 0,
      otros: [
        {
          descripcion: '',
          valor: 0
        }
      ]
    }

  }
  rentabilidad: any
  // rentabilidad: Rentabilidad = {
  //   horaTomaPasajeros: [
  //     {
  //       fecha: '',
  //       hora: ''
  //     }
  //   ],
  //   numPasajeros: 0,
  //   totalGastos: 0,
  //   totalIngresos: 0
  // }

  nombre: string
  pasajeros: number
  valorPasaje: number
  ingresos: number
  segmentModel: string
  listGastos: any
  lock: boolean
  sumaGastos: any
  dataForModal
  dataFromPopover

  constructor(
    private modalController: ModalController,
    public popoverController: PopoverController,
    private colectivoService: ColectivoService
  ) { }

  ngOnInit() {
    this.getConductor().catch(err => console.log(err))
    this.getRentabilidad().catch(err => console.log(err))

    this.listGastos = [
      {
        id: 0,
        nombre: "Combustible",
        valor: 10000,
        color: "success",
        lock: true
      },
      {
        id: 1,
        nombre: "Entrega",
        valor: 17000,
        color: "warning",
        lock: true
      },
      {
        id: 2,
        nombre: "Otros",
        valor: 10000,
        color: "danger",
        lock: true
      }
    ]
    this.segmentModel = 'ingresos'
    this.lock = true


  }

  ngAfterContentInit() {

  }

  getConductor = () => {
    let promise = new Promise((res, rej) => {
      this.colectivoService.getConductor('2').subscribe(res => {
        this.conductor = res['conductor']
        console.log('Respuesta ', res)
        console.log(this.conductor)
      })

    })

    return promise
  }

  getRentabilidad = () => {
    let promise = new Promise((resolve, reject) => {
      this.colectivoService.getRentabilidad('2', 'giKWYPpFz0vWiOxmWCsu').subscribe(res => {

        console.log('Respuesta Rentabilidad ', res)
        this.rentabilidad = res
        console.log('variable Rentabilidad ', this.rentabilidad)


      })

    })

    return promise
  }

  async settings() {
    const modal = await this.modalController.create({
      component: SettingComponent,
      componentProps: { opcion: this.dataForModal, conductor: this.conductor },
      cssClass: 'setting-modal',
      backdropDismiss: false,
    })
    // .then((modalEl) => {
    //   modalEl.present();
    //   return modal.onDidDismiss();
    // })
    // .then((result) => {
    //   if (result.role === 'confirm') {
    //     console.log(result.data)
    //   }
    // });

    modal.present();
    // this.dataForModal = await modal.onWillDismiss();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'setting-popover',
      event: ev,
      translucent: true
    });

    popover.onDidDismiss().then((dataFromPopover) => {
      if (dataFromPopover.data) {
        this.dataFromPopover = dataFromPopover.data;
        this.dataForModal = dataFromPopover.data
        console.log('Popover Sent Data :' + dataFromPopover.data);
        this.settings()
      }
    });

    return await popover.present();
  }

  ionViewDidEnter() {
    this.calculaGastos()
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev.detail.value);
    this.segmentModel = ev.detail.value
  }
  reorderItems(ev) {
    console.log(ev)
    console.log(`Moving item from ${ev.detail.from} to ${ev.detail.to}`);

    const element = this.listGastos[ev.detail.from];
    this.listGastos.splice(ev.detail.from, 1);
    this.listGastos.splice(ev.detail.to, 0, element);
    ev.detail.complete();

  }

  toogleLock(gasto) {
    let indice = this.listGastos.indexOf(gasto)
    this.listGastos[indice].lock = !this.listGastos[indice].lock
    this.calculaGastos()
  }

  calculaGastos() {
    this.sumaGastos = Object.keys(this.listGastos).reduce((sum, key) => {
      return sum + this.listGastos[key].valor;
    }, 0);

    console.log(`Gastos ${this.sumaGastos}`)
  }

}
