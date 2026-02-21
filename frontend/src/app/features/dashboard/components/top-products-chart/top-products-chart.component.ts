import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TopProductEntry } from '../../../tenant-space/models/analytics.model';

@Component({
  selector: 'app-top-products-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, BaseChartDirective],
  template: `
    <mat-card class="chart-card">
      <mat-card-header>
        <mat-card-title class="chart-title">Top 5 Produits</mat-card-title>
        <mat-card-subtitle>Par chiffre d'affaires sur la période</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="chart-container" *ngIf="topProducts?.length; else noData">
          <canvas baseChart
            [type]="chartType"
            [data]="chartData"
            [options]="chartOptions">
          </canvas>
        </div>
        <ng-template #noData>
          <div class="no-data">Aucun produit vendu sur cette période</div>
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
export class TopProductsChartComponent implements OnChanges {
  @Input() topProducts: TopProductEntry[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartType = 'bar' as const;

  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  private readonly colors = [
    '#6366f1',
    '#8b5cf6',
    '#a78bfa',
    '#c4b5fd',
    '#ddd6fe'
  ];

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
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
            const value = ctx.parsed.x;
            return `CA: ${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(value ?? 0)}`;
          },
          afterLabel: (ctx) => {
            const product = this.topProducts[ctx.dataIndex];
            return product ? `Qté vendue: ${new Intl.NumberFormat('fr-FR').format(product.quantitySold)}` : '';
          }
        }
      }
    },
    scales: {
      x: {
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
      },
      y: {
        grid: { display: false },
        ticks: {
          color: '#1e293b',
          font: { size: 12, weight: 'bold' }
        }
      }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['topProducts']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const sorted = [...this.topProducts].sort((a, b) => a.totalAmount - b.totalAmount);

    this.chartData = {
      labels: sorted.map(p => this.truncate(p.productName, 25)),
      datasets: [
        {
          data: sorted.map(p => p.totalAmount),
          backgroundColor: sorted.map((_, i) => this.colors[i % this.colors.length]),
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 28
        }
      ]
    };

    this.chart?.update();
  }

  private truncate(text: string, maxLen: number): string {
    return text.length > maxLen ? text.substring(0, maxLen) + '…' : text;
  }
}
