import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  estado: boolean;
  @Output() eventoCambiaEstado = new EventEmitter()

  constructor() { }

  ngOnInit() {
    this.estado = false
  }

  cambiaEstado(){
    this.estado = !this.estado
  }

  onEventoCambiaEstado(){
    this.estado = !this.estado
    this.eventoCambiaEstado.emit(this.estado)
  }
}
