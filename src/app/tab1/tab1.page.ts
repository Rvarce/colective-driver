import { Component, OnInit, NgZone } from '@angular/core';
import { Map, latLng, tileLayer, Layer, icon, marker, circle, featureGroup } from 'leaflet';
import { Plugins, Capacitor, CallbackID } from '@capacitor/core';
const { Geolocation } = Plugins;
import { ColectivoService } from "../services/colectivo.service";
import { UbicacionesService } from "../services/ubicaciones.service";
import { LoadingController } from "@ionic/angular";

// import { Geolocation } from "@ionic-native/geolocation/ngx";
// import "leaflet/dist/images/marker-shadow.png";
// import "leaflet/dist/images/marker-icon-2x.png";

import "leaflet/dist/images/marker-car-shadow.png";
import "leaflet/dist/images/marker-car.png";
import { Ubicaciones } from '../interfaces/ubicaciones';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  map: Map
  newMarker: any
  address: string[]
  counter: number
  cupo: number
  color: string
  estado: boolean
  group: any
  coordinate: any
  watchCoordinate: any
  watchId: CallbackID
  ubicacion: Ubicaciones = {
    comuna: '',
    coordenadas: [
      {
        lat: 0,
        lng: 0
      }
    ]
  }

  constructor(
    private zone: NgZone,
    private colectivoService: ColectivoService,
    private ubicacionesService: UbicacionesService,
    public loadingController: LoadingController
    // private geo: Geolocation
  ) { }

  ngOnInit() {
    this.counter = 0
    this.cupo = 0
    this.color = 'light'
    this.group = []
    this.estado = false
    this.requestPermissions()
    this.watchPosition()
    this.getContador()

  }

  ionViewDidEnter() {
    if (this.watchCoordinate) {
      this.setEstado(this.estado)
      
    }
  }

  ionViewWillLeave() {
    this.map.off()
    this.map.remove()
  }

  async requestPermissions() {
    const permissionResult = await Plugins.Geolocation.requestPermissions()
    console.log('Permission result: ', permissionResult)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      message: 'Espere mientras se cargas los datos...',
      duration: 500
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }

  getCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin Geolocation not available')
      return
    }
    Geolocation.getCurrentPosition().then(data => {
      this.coordinate = {
        lat: data.coords.latitude,
        lng: data.coords.longitude,
        accuracy: data.coords.accuracy,
        heading: data.coords.heading
      }
    }).catch(error => {
      console.error('Catch get postition error: ', error)
    })
  }

  watchPosition() {
    try {
      this.watchId = Plugins.Geolocation.watchPosition({}, (position, error) => {
        console.log('Watch: ', position)
        this.zone.run(() => {
          this.watchCoordinate = {
            lat: position.coords?.latitude,
            lng: position.coords?.longitude,
            heading: position.coords?.heading
          }
          this.colectivoService.updatePosition('2', this.watchCoordinate)
        })
      })
    } catch (error) {
      console.error('Catch watch postition error: ', error)
    }
  }

  clearWatch() {
    if (this.watchId != null) {
      Plugins.Geolocation.clearWatch({ id: this.watchId })
    }
  }

  loadMap() {

    this.map = new Map('mapId').setView([this.watchCoordinate?.lat, this.watchCoordinate?.lng], 15)

    tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      //attribution: 'edupala.com'
    }).addTo(this.map);

    var carIcon = icon({
      iconUrl: 'marker-car.png',
      shadowUrl: 'marker-car-shadow.png',

      iconSize: [40, 40], // size of the icon
      shadowSize: [41.5, 41.5], // size of the shadow
      iconAnchor: [4, 64], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 64],  // the same for the shadow
      popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });


    const markPoint = marker([this.watchCoordinate?.lat, this.watchCoordinate?.lng], { icon: carIcon });
    markPoint.bindPopup('<p>Tashi Delek - Bangalore.</p>');
    this.map.addLayer(markPoint);

    this.map.attributionControl.remove()
  }
  getContador = () => {
    let response
    let promise = new Promise((resolve, reject) => {
      this.colectivoService.getRentabilidad('2', 'giKWYPpFz0vWiOxmWCsu').subscribe(res => {

        console.log('Respuesta contador ', res)
        response = res
        this.counter = response.numPasajeros
        console.log('variable counter ', this.counter)

      })

    })
    return promise
  }

  counterUpdate(operation) {
    switch (operation) {
      case 'mas':
        this.counter++
        this.actualizaCupo('mas')
        let date = new Date()
        let day = date.getDate()
        let fecha = (day < 10 ? '0' + day : day) + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        let hora = date.toLocaleTimeString()
        let sendDate = { fecha, hora }
        this.colectivoService.saveTime('2', sendDate)
        break;
      case 'menos':
        if (this.counter > 0) {
          this.counter--
          this.actualizaCupo('menos')
          this.colectivoService.deleteLast('2')
        }
        break;
      case 'reset':
        this.counter = 0
        break;
      case 'resetCount':
        this.cupo = 0
        break;
      default:
        break;
    }

    this.colectivoService.updateCounter('2', 'giKWYPpFz0vWiOxmWCsu', this.counter)
  }

  actualizaCupo(op) {
    switch (op) {
      case 'mas':
        if (this.cupo === 50) {
          this.color = 'warning'
        } else {
          this.color = 'light'
        }
        if (this.cupo === 100) {
          this.cupo = 25
        } else {
          this.cupo = this.cupo + 25
        }
        break;
      case 'menos':
        if (this.cupo >= 0) {
          if (this.cupo === 75) {
            this.color = 'light'
          }
          if (this.cupo === 100) {
            this.color = 'warning'
          }
          this.cupo = this.cupo - 25
        }
        break;
      case 'reset':
        if (this.cupo === 75) {
          this.color = 'light'
        }
        this.cupo = 0
      default:
        break;
    }
  }

  actualizaClase() {
    return {
      'cero': this.cupo === 0 ? true : false,
      'un-cuarto': this.cupo === 25 ? true : false,
      'un-medio': this.cupo === 50 ? true : false,
      'tres-cuartos': this.cupo === 75 ? true : false,
      'completo': this.cupo === 100 ? true : false
    }
  }

  setEstado($estado) {
    if ($estado) {
      this.presentLoading()
          .then(() => this.loadMap())
          .then(() => this.getCoordenadasPasajeros())
          // .then(coords => this.loadZones(coords))
          .catch(err => console.error(err))
    }
    else {
      this.removeZone()
      this.group.pop()
      this.clearWatch()
    }
    this.estado = $estado
  }

  getCoordenadasPasajeros = () => {
    let promise = new Promise((resolve, reject) => {
      this.ubicacionesService.getUbicaciones('3CqBDZ3tf82DViUBgmKj').subscribe(res => {
        // this.ubicacion = res
        console.log('ubicacion ', res.coordenadas)

        if (this.group != []) {

          this.removeZone()
        }
        if (res) {
          res.coordenadas.forEach(coord => {
            console.log('coord ', coord)
            this.group.push(circle([coord.lat, coord.lng], { radius: 80, stroke: false }).addTo(this.map))
          })

          resolve()
        } else {
          reject('No hay coordenadas')
        }
      })
    })

    return promise
  }

  // loadZones(coords) {
  //   let promise = new Promise((res, rej) => {



  //     //  coords.forEach(coord => {
  //     //   circle([coord.lat, coord.lng], { radius: 80, stroke: false }).addTo(this.map)
  //     // })
  //   })

  //   return promise
  // }

  removeZone() {
    this.group.forEach(circle => {
      this.map.removeLayer(circle);
    });
    this.group = []
  }
}
