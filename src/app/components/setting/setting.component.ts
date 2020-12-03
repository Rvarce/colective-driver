import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Conductor } from 'src/app/interfaces/conductor';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  @Input() opcion: string;
  @Input() conductor: Conductor;

  perfil: Object
  vehiculo: Object
  configIngresos: Object
  configGastos: Object

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    console.log('opcion en modal: ' + this.opcion)
    this.perfil = this.conductor.perfil
    this.vehiculo = this.conductor.vehiculo
    this.configIngresos = this.conductor.configIngresos
    this.configGastos = this.conductor.configGastos
  }

  settingIonic(version: string) {
    this.modalController.dismiss(
      { ionic: version },
      'confirm'
      );
  }

  closeModal() { this.modalController.dismiss(); }

  settingJavascript() {}

  settingAngular(name: string) {}

}
