import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from "chart.js";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild("diarios") barCanvas: ElementRef;
  @ViewChild("chartMensual") lineCanvas: ElementRef;
  @ViewChild("chartGastos") pieCanvas: ElementRef;



  private barChart:Chart
  private lineChart:Chart
  private pieChart:Chart


  
  constructor() {}

  ionViewDidEnter() {
    this.createBarChart();

  }
  createBarChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
        datasets: [
          {
            label: "Ingresos",
            barPercentage: 0.9,
            data: [12, 19, 13, 15, 12, 13],
            backgroundColor: "#144F85",
            borderWidth: 1
          },
          {
            label: "Gastos",
            barPercentage: 0.9,
            data: [2, 9, 3, 5, 2, 3],
            backgroundColor: "#2F97F5",
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          display: true,
          position: 'bottom'
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: "pie",
      data: {
        labels: ["Combustible", "Entrega", "Otros"],
        datasets: [
          {
            label: "Ingresos",
            barPercentage: 0.9,
            data: [12, 19, 5],
            backgroundColor: [
              "rgba(230, 70, 100)",
              "rgba(30, 140, 220)",
              "rgba(240, 190, 70)",
            ],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          display: true,
          position: 'right'
        }
      }
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
        datasets: [
          {
            label: "Ingresos",
            borderColor: "#80b6f4",
            pointBorderColor: "#80b6f4",
            pointBackgroundColor: "#80b6f4",
            pointHoverBackgroundColor: "#80b6f4",
            pointHoverBorderColor: "#80b6f4",
            pointBorderWidth: 5,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
            fill: false,
            borderWidth: 1,
            data: [100, 120, 150, 170, 180, 170, 160]
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: "rgba(0,0,0,0.5)",
                    fontStyle: "bold",
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    padding: 20
              }
            }
          ]
        }
      }
    });

  }


}
