import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPermissionsService } from 'ngx-permissions';

import { Chart, registerables } from 'chart.js';

import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { SalesChartComponent } from './components/sales-chart/sales-chart.component';
import { TopProductsChartComponent } from './components/top-products-chart/top-products-chart.component';
import { AnalyticsService } from '../tenant-space/services/analytics.service';
import { ShopService } from '../tenant-space/services/shop.service';
import { AnalyticsSummaryResponse, ExportFormat } from '../tenant-space/models/analytics.model';
import { Shop } from '../tenant-space/models/shop.model';
import { ToastService } from '../../shared/services/toast.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    KpiCardComponent,
    SalesChartComponent,
    TopProductsChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  summary: AnalyticsSummaryResponse | null = null;
  shops: Shop[] = [];
  isLoading = false;
  isExporting = false;
  isTenantAdmin = false;

  // Filter state
  fromDate = '';
  toDate = '';
  selectedShopId = '';

  constructor(
    private analyticsService: AnalyticsService,
    private shopService: ShopService,
    private permissionsService: NgxPermissionsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.initDateRange();
    this.checkRole();
    this.loadDashboard();
  }

  get periodLabel(): string {
    if (this.fromDate && this.toDate) {
      return `${this.formatDateLabel(this.fromDate)} — ${this.formatDateLabel(this.toDate)}`;
    }
    return "Aujourd'hui";
  }

  onFilterChange(): void {
    // Automatic reload can be added here with debounce — for now, user clicks 'Actualiser'
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.summary = null;

    this.analyticsService.getSummary({
      shopId: this.selectedShopId || undefined,
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined
    }).subscribe({
      next: (data) => {
        this.summary = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.toastService.showError('Erreur lors du chargement du tableau de bord');
        this.isLoading = false;
      }
    });
  }

  exportReport(format: ExportFormat): void {
    this.isExporting = true;

    this.analyticsService.exportReport({
      format,
      shopId: this.selectedShopId || undefined,
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined
    }).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, format);
        this.toastService.showSuccess(`Export ${format} téléchargé avec succès`);
        this.isExporting = false;
      },
      error: (err) => {
        console.error('Error exporting report:', err);
        this.toastService.showError(`Erreur lors de l'export ${format}`);
        this.isExporting = false;
      }
    });
  }

  private initDateRange(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = this.formatDate(firstDayOfMonth);
    this.toDate = this.formatDate(today);
  }

  private checkRole(): void {
    const permissions = this.permissionsService.getPermissions();
    this.isTenantAdmin = !!permissions['ROLE_TENANT_ADMIN'] || !!permissions['ROLE_superadmin'];

    if (this.isTenantAdmin) {
      this.loadShops();
    }
  }

  private loadShops(): void {
    this.shopService.getAll({ page: 0, size: 100 }).subscribe({
      next: (response) => {
        this.shops = Array.isArray(response) ? response : response.content;
      },
      error: (err) => {
        console.error('Error loading shops:', err);
      }
    });
  }

  private downloadBlob(blob: Blob, format: ExportFormat): void {
    const extension = format === 'PDF' ? 'pdf' : 'xlsx';
    const filename = `rapport-ventes-${this.formatDate(new Date())}.${extension}`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatDateLabel(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
