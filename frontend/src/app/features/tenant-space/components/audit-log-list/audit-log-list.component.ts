import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort, SortDirection } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { SharedModule } from '../../../../shared/shared.module';
import { ColumnConfig } from '../../../../shared/abstractions/column-config.model';
import { AuditLogService } from '../../services/audit-log.service';
import { AuditLogEntry } from '../../models/audit-log.model';

@Component({
    selector: 'app-audit-log-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    templateUrl: './audit-log-list.component.html',
    styleUrls: ['./audit-log-list.component.scss']
})
export class AuditLogListComponent implements OnInit {
    data: AuditLogEntry[] = [];
    isLoading = true;
    resultsLength = 0;

    // Pagination & sort
    pageIndex = 0;
    pageSize = 20;
    sortActive = 'timestamp';
    sortDirection: SortDirection = 'desc';

    // Filters
    filterFromDate = '';
    filterToDate = '';
    filterEntityType = '';
    filterUserId = '';

    private readonly actionTypeLabels: Record<string, string> = {
        'CREATE': 'Création',
        'UPDATE': 'Modification',
        'DELETE': 'Suppression'
    };

    private readonly entityTypeLabels: Record<string, string> = {
        'Stock': 'Stock',
        'Sale': 'Vente',
        'Product': 'Produit'
    };

    columnsConfig: ColumnConfig[] = [
        {
            key: 'timestamp',
            label: 'Date',
            type: 'datetime',
            sortable: true
        },
        {
            key: 'userId',
            label: 'Utilisateur',
            type: 'text',
            sortable: true
        },
        {
            key: 'actionType',
            label: 'Action',
            type: 'text',
            sortable: true,
            mapValue: (val: string) => this.actionTypeLabels[val] || val
        },
        {
            key: 'entityType',
            label: 'Entité',
            type: 'text',
            sortable: true,
            mapValue: (val: string) => this.entityTypeLabels[val] || val
        },
        {
            key: 'entityId',
            label: 'ID Entité',
            type: 'text',
            sortable: false
        }
    ];

    constructor(private auditLogService: AuditLogService) { }

    ngOnInit(): void {
        this.loadData();
    }

    applyFilters(): void {
        this.pageIndex = 0;
        this.loadData();
    }

    onPageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        this.loadData();
    }

    onSortChange(sort: Sort): void {
        this.sortActive = sort.active;
        this.sortDirection = sort.direction;
        this.pageIndex = 0;
        this.loadData();
    }

    private loadData(): void {
        this.isLoading = true;

        this.auditLogService.getAll({
            page: this.pageIndex,
            size: this.pageSize,
            sort: this.sortDirection ? `${this.sortActive},${this.sortDirection}` : undefined,
            fromDate: this.filterFromDate || undefined,
            toDate: this.filterToDate || undefined,
            userId: this.filterUserId || undefined,
            entityType: this.filterEntityType || undefined
        }).subscribe({
            next: (response) => {
                this.data = response.content;
                this.resultsLength = response.page.totalElements;
                this.isLoading = false;
            },
            error: () => {
                this.data = [];
                this.resultsLength = 0;
                this.isLoading = false;
            }
        });
    }
}
