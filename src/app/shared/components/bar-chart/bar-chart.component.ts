import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss',
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() color: string = '#40800b';

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [],
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#7c7d82',
        borderColor: '#e4e4e4',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            if (value === null || value === undefined) {
              return 'R$ 0,00';
            }
            return `R$ ${value.toFixed(2).replace('.', ',')}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#7c7d82',
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          color: '#7c7d82',
          font: {
            size: 12,
          },
          callback: (value) => {
            return `R$ ${value}`;
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  ngOnInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['labels'] || changes['color']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    this.barChartData = {
      labels: this.labels.length > 0 ? this.labels : this.data.map((_, i) => `Sem ${i + 1}`),
      datasets: [
        {
          data: this.data,
          label: this.title,
          backgroundColor: this.hexToRgba(this.color, 0.8),
          borderColor: this.color,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

