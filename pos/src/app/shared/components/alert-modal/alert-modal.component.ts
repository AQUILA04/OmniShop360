import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-content fade-in">
        
        <div class="modal-header">
          <div class="icon-container" [ngClass]="type">
            <svg *ngIf="type === 'error'" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            <svg *ngIf="type === 'info' || type === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none">
               <path *ngIf="type === 'info'" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <path *ngIf="type === 'info'" d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
               <circle *ngIf="type === 'info'" cx="12" cy="8" r="1" fill="currentColor"/>
               <path *ngIf="type === 'success'" d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2"/>
               <path *ngIf="type === 'success'" d="M22 4L12 14.01l-3-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2>{{ title || (type === 'error' ? 'Erreur' : 'Information') }}</h2>
        </div>

        <div class="modal-body">
          <p>{{ message }}</p>
        </div>

        <div class="modal-footer">
          <button class="btn-primary" (click)="close.emit()">OK</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
      z-index: 5000; display: flex; align-items: center; justify-content: center;
    }
    .modal-content {
      background: #fff; width: 380px; border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: hidden; text-align: center;
    }
    .fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }
    
    .modal-header {
      padding: 30px 24px 10px; display: flex; flex-direction: column; align-items: center; gap: 16px;
    }
    
    .icon-container {
      width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
    }
    .icon-container.error { background: #fdecec; color: #d93e3e; }
    .icon-container.info { background: #e8edf5; color: #005cad; }
    .icon-container.success { background: #e6f4ea; color: #1a7a4a; }
    
    .modal-header h2 { margin: 0; font-size: 20px; font-weight: 700; color: #1a2035; }
    
    .modal-body { padding: 0 24px 24px; }
    .modal-body p { margin: 0; font-size: 14px; color: #676c73; line-height: 1.5; }
    
    .modal-footer {
      padding: 16px 24px; border-top: 1px solid #f4f5f7; background: #fafafa;
      display: flex; justify-content: center;
    }
    
    .btn-primary {
      width: 100%; padding: 12px 24px; border: none; background: #1a2035;
      color: #fff; font-weight: 600; font-size: 15px; border-radius: 10px; cursor: pointer; transition: background 0.2s;
    }
    .btn-primary:hover { background: #000; }
  `]
})
export class AlertModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'error' | 'info' | 'success' = 'info';

  @Output() close = new EventEmitter<void>();
}
