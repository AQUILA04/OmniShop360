import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-success-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-content">
        <button class="close-btn" (click)="onNewSale()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <div class="success-icon-wrapper">
             <div class="success-icon-circle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" class="check-icon">
                    <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
             </div>
             <div class="success-icon-pulse"></div>
        </div>
        
        <h2 class="title">Payment Successful</h2>
        <p class="subtitle">Transaction completed successfully.</p>
        
        <div class="amount-box">
            <span class="amount-label">TOTAL AMOUNT</span>
            <span class="amount-value">{{ totalAmount | currency:'EUR' }}</span>
        </div>

        <div class="details-list">
            <div class="detail-row">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value flex-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    {{ paymentMethod }}
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Transaction ID</span>
                <span class="detail-value badge">#{{ ticketNumber }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">{{ transactionDate | date:'mediumDate' }} • {{ transactionDate | date:'shortTime' }}</span>
            </div>
        </div>

        <div class="actions">
            <button class="btn-print" (click)="onPrint()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 9V2H18V9M6 18H18V22H6V18ZM6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18"/>
                </svg>
                Print Receipt
            </button>
            <button class="btn-new-sale" (click)="onNewSale()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                New Sale
            </button>
        </div>

        <a href="javascript:void(0)" class="email-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                 <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Send receipt via email
        </a>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(2px);
    }

    .modal-content {
      background-color: white;
      border-radius: 20px;
      width: 420px;
      padding: 40px 32px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: #9CA3AF;
        cursor: pointer;
        padding: 4px;
        transition: color 0.2s;
    }
    
    .close-btn:hover {
        color: #4B5563;
    }

    .success-icon-wrapper {
        position: relative;
        margin-bottom: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .success-icon-circle {
        width: 64px;
        height: 64px;
        background-color: #00E676; /* Vivid Green */
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        box-shadow: 0 4px 6px -1px rgba(0, 230, 118, 0.4);
    }
    
    .success-icon-pulse {
        position: absolute;
        width: 84px;
        height: 84px;
        background-color: rgba(0, 230, 118, 0.15);
        border-radius: 50%;
        z-index: 1;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 0.3; }
        100% { transform: scale(0.95); opacity: 0.7; }
    }

    .title {
        font-size: 24px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 8px 0;
    }

    .subtitle {
        color: #6B7280;
        font-size: 14px;
        margin: 0 0 32px 0;
    }

    .amount-box {
        background-color: #F8FAFC;
        border-radius: 12px;
        padding: 24px;
        width: 100%;
        margin-bottom: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        border: 1px solid #E2E8F0;
    }
    
    .amount-label {
        font-size: 11px;
        font-weight: 600;
        color: #64748B;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .amount-value {
        font-size: 36px;
        font-weight: 800;
        color: #1E293B;
    }

    .details-list {
        width: 100%;
        margin-bottom: 32px;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    
    .detail-label {
        color: #6B7280;
        font-weight: 500;
    }
    
    .detail-value {
        color: #111827;
        font-weight: 600;
    }
    
    .flex-center {
        display: flex;
        align-items: center;
    }
    
    .mr-2 { margin-right: 8px; }
    .mr-1 { margin-right: 4px; }
    
    .badge {
        background-color: #F3F4F6;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        color: #374151;
        font-family: monospace;
    }

    .actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        width: 100%;
        margin-bottom: 20px;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        font-size: 14px;
        transition: transform 0.1s;
    }
    
    button:active {
        transform: scale(0.98);
    }

    .btn-print {
        background-color: #3B82F6; /* Blue */
        color: white;
    }

    .btn-print:hover {
        background-color: #2563EB;
    }

    .btn-new-sale {
        background-color: #22C55E; /* Green */
        color: white;
    }

    .btn-new-sale:hover {
        background-color: #16A34A;
    }
    
    .email-link {
        color: #6B7280;
        font-size: 13px;
        text-decoration: none;
        display: flex;
        align-items: center;
        transition: color 0.2s;
    }
    
    .email-link:hover {
        color: #3B82F6;
    }
  `]
})
export class SuccessModalComponent {
    @Input() isOpen = false;
    @Input() ticketNumber = '';
    @Input() totalAmount = 0;
    @Input() paymentMethod = 'Cash';
    @Input() transactionDate = new Date();

    @Output() print = new EventEmitter<void>();
    @Output() newSale = new EventEmitter<void>();

    onPrint() {
        this.print.emit();
    }

    onNewSale() {
        this.newSale.emit();
    }
}
