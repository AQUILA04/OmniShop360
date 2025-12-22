import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { TenantResponse, TenantStatus } from '../../models/tenant.model';
import { TenantService } from '../../services/tenant.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['companyName', 'contactEmail', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<TenantResponse>();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private tenantService = inject(TenantService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.tenantService.getTenants({
            page: this.paginator.pageIndex,
            size: this.paginator.pageSize,
            sort: `${this.sort.active},${this.sort.direction}`
          }).pipe(catchError(() => of(null)));
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.page.totalElements;
          return data.content;
        })
      ).subscribe(data => this.dataSource.data = data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    // Note: Server-side filtering should be implemented here by triggering the stream
    // For now, we might need to add a search subject or update the merge pipeline
  }

  createTenant() {
    this.router.navigate(['/tenants/create']);
  }

  editTenant(tenant: TenantResponse) {
    this.router.navigate(['/tenants/edit', tenant.id]);
  }

  deleteTenant(tenant: TenantResponse) {
    if (confirm(`Are you sure you want to delete ${tenant.companyName}?`)) {
      this.tenantService.deleteTenant(tenant.id).subscribe({
        next: () => {
          this.snackBar.open('Tenant deleted successfully', 'Close', { duration: 3000 });
          this.refreshTable();
        },
        error: (err) => {
          this.snackBar.open('Error deleting tenant', 'Close', { duration: 3000 });
        }
      });
    }
  }

  toggleStatus(tenant: TenantResponse) {
    const newStatus = tenant.status === TenantStatus.ACTIVE ? TenantStatus.SUSPENDED : TenantStatus.ACTIVE;
    this.tenantService.updateTenantStatus(tenant.id, newStatus).subscribe({
      next: () => {
        this.snackBar.open(`Tenant ${newStatus === TenantStatus.ACTIVE ? 'activated' : 'suspended'}`, 'Close', { duration: 3000 });
        this.refreshTable();
      },
      error: (err) => {
        this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
      }
    });
  }

  refreshTable() {
    this.paginator.page.emit({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length
    });
  }
}
