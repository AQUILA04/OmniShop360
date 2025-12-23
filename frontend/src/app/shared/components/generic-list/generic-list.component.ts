import { Component, Input, Output, EventEmitter, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnConfig } from '../../abstractions/column-config.model';

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
  styleUrls: ['./generic-list.component.scss']
})
export class GenericListComponent<T extends { id: string; [key: string]: any }> implements AfterViewInit {

  @Input() pageTitle: string = '';
  @Input() isLoading: boolean = true;
  @Input() columnsConfig: ColumnConfig[] = [];
  @Input() resultsLength: number = 0;
  @Input() defaultSort: { active: string; direction: SortDirection } = { active: 'createdAt', direction: 'desc' };

  @Input()
  set data(data: T[]) {
    this.dataSource.data = data;
  }

  // Templates pour la personnalisation
  @Input() specificActionsTemplate?: TemplateRef<any>;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() action = new EventEmitter<{ action: string; item: T }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<T>();
  displayedColumns: string[] = [];

  ngOnChanges() {
    this.displayedColumns = [...this.columnsConfig.map(c => c.key), 'actions'];
  }

  ngAfterViewInit() {
    // Propage les événements de tri et de pagination au composant parent
    this.sort.sortChange.subscribe(sort => this.sortChange.emit(sort));
    this.paginator.page.subscribe(page => this.pageChange.emit(page));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchChange.emit(filterValue);
  }

  getFieldValue(key: string, item: any): any {
    if (!item) return '';
    const value = key.split('.').reduce((obj: any, k: string) => obj && obj[k], item);
    return value === null || value === undefined ? '-' : value;
  }

  emitAction(action: string, item: T) {
    this.action.emit({ action, item });
  }
}
