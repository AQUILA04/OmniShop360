import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { SalesEvolutionEntry } from '../../../tenant-space/models/analytics.model';

@Component({
  selector: 'app-sales-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title class="chart-title">Évolution des Ventes</mat-card-title>
        <mat-card-subtitle>Chiffre d'affaires quotidien sur la période</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="chart-container" *ngIf="salesEvolution?.length; else noData">
          <canvas baseChart
            [type]="chartType"
            [data]="chartData"
            [options]="chartOptions">
          </canvas>
        </div>
        <ng-template #noData>
          <div class="no-data">Aucune donnée de vente sur cette période</div>
        </ng-template>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .chart-card {
      border-radius: 16px;
      padding: 1.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }

    .chart-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #94a3b8;
      font-size: 0.95rem;
    }
  `]
})
export class SalesChartComponent implements OnChanges {
  @Input() salesEvolution: SalesEvolutionEntry[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartType = 'line' as const;

  chartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y;
            return `CA: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(value ?? 0)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.04)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          callback: (value) => {
            const num = typeof value === 'number' ? value : parseFloat(value as string);
            if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
            if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
            return num.toString();
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
        borderColor: '#6366f1',
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.08)'
      },
      point: {
        radius: 4,
        backgroundColor: '#6366f1',
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverRadius: 6
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['salesEvolution']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const labels = this.salesEvolution.map(e => {
      const date = new Date(e.day);
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    });

    this.chartData = {
      labels,
      datasets: [
        {
          data: this.salesEvolution.map(e => e.totalAmount),
          label: 'Chiffre d\'affaires'
        }
      ]
    };

    this.chart?.update();
  }
}
