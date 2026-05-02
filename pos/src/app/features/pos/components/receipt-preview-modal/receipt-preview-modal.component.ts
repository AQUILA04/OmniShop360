import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../../core/services/cart.service';
import { AlertModalComponent } from '../../../../shared/components/alert-modal/alert-modal.component';

@Component({
    selector: 'app-receipt-preview-modal',
    standalone: true,
    imports: [CommonModule, AlertModalComponent],
    template: `
    <div class="modal-overlay" *ngIf="isOpen">
      <div class="modal-wrapper">
        
        <!-- Left Side: Receipt Preview -->
        <div class="receipt-preview-section">
            <div class="receipt-paper" [class.receipt-a4]="printFormat === 'A4'">
                <div class="receipt-header">
                    <div class="store-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    </div>
                    <div class="store-brand">URBAN RETAIL</div>
                    <div class="store-details">
                        123 Market Street, Downtown<br>
                        San Francisco, CA 94103<br>
                        (555) 123-4567
                    </div>
                </div>

                <div class="receipt-divider-dashed"></div>

                <div class="receipt-meta">
                    <div class="meta-row">
                        <span>Date: {{ transactionDate | date:'MM/dd/yyyy' }}</span>
                        <span>Trans #: {{ ticketNumber }}</span>
                    </div>
                    <div class="meta-row">
                        <span>Time: {{ transactionDate | date:'HH:mm a' }}</span>
                        <span>Reg: 04</span>
                    </div>
                </div>

                <div class="receipt-items">
                    <div class="item-row" *ngFor="let item of cartItems">
                        <div class="item-details">
                            <div class="item-name">{{ item.productName }}</div>
                            <div class="item-qty">Qty: {{ item.quantity }} x {{ item.price | currency:'EUR' }}</div>
                        </div>
                        <div class="item-total">{{ (item.price * item.quantity) | currency:'EUR' }}</div>
                    </div>
                </div>

                <div class="receipt-divider-dashed"></div>

                <div class="receipt-totals">
                    <div class="total-row">
                        <span>Subtotal</span>
                        <span>{{ (totalAmount / 1.2) | currency:'EUR' }}</span>
                    </div>
                    <div class="total-row">
                        <span>Tax (20%)</span>
                        <span>{{ (totalAmount - (totalAmount / 1.2)) | currency:'EUR' }}</span>
                    </div>
                    <div class="total-row grand-total">
                        <span>TOTAL</span>
                        <span>{{ totalAmount | currency:'EUR' }}</span>
                    </div>
                </div>

                <div class="payment-info">
                    <div class="pay-row" *ngFor="let p of payments">
                        <span>{{ formatMethodName(p.method) | uppercase }}</span>
                        <span>{{ p.amount | currency:'EUR':'symbol':'1.2-2' }}</span>
                    </div>
                    <div class="auth-row" *ngIf="hasTransactionRef()">
                        Réf. paiement validée
                    </div>
                </div>

                <div class="barcode-section">
                    <!-- Simple CSS Barcode simulation -->
                    <div class="barcode"></div>
                    <div class="barcode-num">8 3 9 2 0 1 9 9 3 8 2 2 0 1</div>
                </div>

                <div class="receipt-footer">
                    Thank you for shopping with us!<br>
                    Visit us again soon.
                </div>
            </div>
        </div>

        <!-- Right Side: Delivery Actions -->
        <div class="delivery-actions-section">
            <h2 class="section-title">Receipt Delivery</h2>
            <p class="section-desc">Transaction completed successfully. Choose how the customer would like to receive their receipt.</p>

            <div class="quick-actions">
                <div class="action-label">QUICK ACTIONS</div>
                
                <!-- Format Toggle -->
                <div class="format-toggle" style="display: flex; gap: 8px; margin-bottom: 16px;">
                  <button 
                    [class.active]="printFormat === 'thermal'" 
                    (click)="changeFormat('thermal')"
                    style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #ccc; cursor: pointer; background: white;"
                    [style.background]="printFormat === 'thermal' ? '#EFF6FF' : 'white'"
                    [style.borderColor]="printFormat === 'thermal' ? '#3B82F6' : '#ccc'">
                    Format Thermique
                  </button>
                  <button 
                    [class.active]="printFormat === 'A4'" 
                    (click)="changeFormat('A4')"
                    style="flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #ccc; cursor: pointer; background: white;"
                    [style.background]="printFormat === 'A4' ? '#EFF6FF' : 'white'"
                    [style.borderColor]="printFormat === 'A4' ? '#3B82F6' : '#ccc'">
                    Format A4
                  </button>
                </div>

                <button class="btn-print-large" (click)="onPrintConfirm()">
                    <div class="print-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 9V2H18V9M6 18H18V22H6V18ZM6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18"/>
                        </svg>
                    </div>
                    <div class="print-text">
                        <div class="print-title">Print Receipt</div>
                        <div class="print-subtitle">Send to Star Micronics TSP100</div>
                    </div>
                    <div class="print-arrow">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </div>
                </button>
            </div>

            <div class="email-section">
                <div class="action-label">Email Receipt</div>
                <div class="email-input-group">
                    <div class="input-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2">
                             <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                             <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                    </div>
                    <input type="email" placeholder="customer@example.com" class="email-input">
                    <button class="btn-send">Send</button>
                </div>
                <div class="email-hint">Receipt will be sent immediately via SMTP.</div>
            </div>

            <div class="secondary-actions">
                <button class="btn-secondary" (click)="onDownloadPdf()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Download PDF
                </button>
                <button class="btn-secondary" (click)="onClose()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                    </svg>
                    No Receipt
                </button>
            </div>

            <div class="new-sale-link" (click)="onNewSale()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mr-1">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Start New Sale
            </div>

            <div class="printer-status">
                <div class="status-indicator online"></div>
                Printer Online
                <div class="spacer"></div>
                <span class="help-text">Need Help?</span>
            </div>
        </div>
      </div>
      
      <app-alert-modal
        [isOpen]="isAlertOpen"
        title="Information"
        message="Génération du PDF en cours..."
        type="info"
        (close)="isAlertOpen = false">
      </app-alert-modal>
    </div>
  `,
    styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2100; /* Higher than Success Modal if needed, or equal */
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(3px);
    }

    .modal-wrapper {
      display: flex;
      gap: 32px;
      align-items: center;
    }

    /* --- Receipt Preview (Left) --- */
    .receipt-preview-section {
        /* Perspective for slight floating effect if desired, but flat is good */
    }

    .receipt-paper {
        background: white;
        width: 320px; /* Thermal width */
        padding: 32px 24px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        font-family: 'Courier New', Courier, monospace;
        color: #1F2937;
        font-size: 13px;
        transition: width 0.3s;
    }

    .receipt-paper.receipt-a4 {
        width: 595px; /* A4 aspect ratio representation */
        height: 842px;
        padding: 40px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
    }
    
    @media print {
        body * { visibility: hidden; }
        .receipt-paper, .receipt-paper * { visibility: visible; }
        .receipt-paper { 
            position: absolute; 
            left: 0; 
            top: 0; 
            box-shadow: none; 
            width: 100% !important; 
            height: auto !important; 
        }
    }

    .receipt-header {
        text-align: center;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .store-logo {
        width: 40px;
        height: 40px;
        background: #EFF6FF;
        color: #3B82F6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
    }

    .store-brand {
        font-weight: 800;
        font-size: 16px;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
        text-transform: uppercase;
        font-family: sans-serif; /* Receipt headers often sans */
    }

    .store-details {
        font-size: 11px;
        color: #6B7280;
        line-height: 1.4;
    }

    .receipt-divider-dashed {
        border-top: 1px dashed #D1D5DB;
        margin: 16px 0;
    }

    .receipt-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 11px;
        color: #6B7280;
    }

    .meta-row {
        display: flex;
        justify-content: space-between;
    }

    .receipt-items {
        margin: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .item-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .item-details {
        display: flex;
        flex-direction: column;
    }

    .item-name {
        font-weight: 600;
        margin-bottom: 2px;
    }

    .item-qty {
        font-size: 11px;
        color: #6B7280;
    }

    .item-total {
        font-weight: 600;
    }

    .receipt-totals {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        color: #4B5563;
    }

    .grand-total {
        font-weight: 800;
        font-size: 16px;
        color: #111827;
        margin-top: 8px;
        font-family: sans-serif;
    }

    .payment-info {
        background: #F9FAFB;
        padding: 12px;
        margin: 16px 0;
        border-radius: 4px;
    }

    .pay-row {
        display: flex;
        justify-content: space-between;
        font-weight: 600;
        margin-bottom: 4px;
    }

    .auth-row {
        font-size: 11px;
        color: #9CA3AF;
    }

    .barcode-section {
        margin: 24px 0;
        text-align: center;
    }

    .barcode {
        height: 40px;
        background: repeating-linear-gradient(
          to right,
          #000 0,
          #000 2px,
          #fff 2px,
          #fff 4px,
          #000 4px,
          #000 5px,
          #fff 5px,
          #fff 7px
        );
        width: 100%;
    }

    .barcode-num {
        font-size: 10px;
        letter-spacing: 0.3em;
        margin-top: 4px;
        color: #6B7280;
    }

    .receipt-footer {
        text-align: center;
        font-size: 11px;
        color: #6B7280;
        line-height: 1.5;
    }


    /* --- Delivery Actions (Right) --- */
    .delivery-actions-section {
        background: white;
        width: 480px;
        border-radius: 12px;
        padding: 40px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        font-family: system-ui, -apple-system, sans-serif;
    }

    .section-title {
        font-size: 24px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 8px 0;
    }

    .section-desc {
        color: #6B7280;
        font-size: 14px;
        line-height: 1.5;
        margin: 0 0 32px 0;
    }

    .action-label {
        font-size: 11px;
        font-weight: 600;
        color: #6B7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 12px;
    }

    .btn-print-large {
        width: 100%;
        background: #2563EB; /* Blue */
        border: none;
        border-radius: 8px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        transition: background 0.2s;
        text-align: left;
    }

    .btn-print-large:hover {
        background: #1D4ED8;
    }

    .print-icon-box {
        background: rgba(255, 255, 255, 0.2);
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
    }

    .print-text {
        flex: 1;
        color: white;
    }
    
    .print-title {
        font-weight: 700;
        font-size: 16px;
    }
    
    .print-subtitle {
        font-size: 13px;
        opacity: 0.9;
    }

    .email-section {
        margin: 32px 0;
    }

    .email-input-group {
        display: flex;
        gap: 0;
    }

    .input-icon {
        background: #F9FAFB;
        border: 1px solid #D1D5DB;
        border-right: none;
        border-radius: 6px 0 0 6px;
        padding: 0 12px;
        display: flex;
        align-items: center;
    }

    .email-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #D1D5DB;
        font-size: 14px;
        outline: none;
    }

    .email-input:focus {
        border-color: #2563EB;
    }

    .btn-send {
        background: #2563EB;
        color: white;
        border: 1px solid #2563EB;
        border-radius: 0 6px 6px 0;
        padding: 0 20px;
        font-weight: 600;
        cursor: pointer;
    }
    
    .email-hint {
        font-size: 12px;
        color: #9CA3AF;
        margin-top: 8px;
    }

    .secondary-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 32px;
    }

    .btn-secondary {
        background: white;
        border: 1px solid #E5E7EB;
        padding: 12px;
        border-radius: 8px;
        color: #374151;
        font-weight: 500;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-secondary:hover {
        border-color: #D1D5DB;
        background: #F9FAFB;
    }

    .new-sale-link {
        color: #2563EB;
        font-weight: 600;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-bottom: 32px;
    }
    
    .new-sale-link:hover {
        text-decoration: underline;
    }

    .printer-status {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #9CA3AF;
        border-top: 1px solid #E5E7EB;
        padding-top: 20px;
    }

    .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
    }
    
    .status-indicator.online {
        background-color: #10B981;
    }

    .spacer {
        flex: 1;
    }
    
    .help-text {
        cursor: pointer;
    }
    
    .mr-2 { margin-right: 8px; }
    .mr-1 { margin-right: 4px; }
  `]
})
export class ReceiptPreviewModalComponent {
    @Input() isOpen = false;
    @Input() ticketNumber = '';
    @Input() totalAmount = 0;
    @Input() paymentMethod = 'Cash'; // Legacy fallback
    @Input() payments: any[] = [];
    @Input() transactionDate = new Date();
    @Input() cartItems: CartItem[] = [];
    @Input() printFormat: 'thermal' | 'A4' = 'thermal';

    @Output() close = new EventEmitter<void>();
    @Output() newSale = new EventEmitter<void>();
    @Output() printFormatChange = new EventEmitter<'thermal' | 'A4'>();

    isAlertOpen = false;

    formatMethodName(method: string): string {
        const mapping: Record<string, string> = {
            'CASH': 'Espèces',
            'CARD': 'Carte Bancaire',
            'MOBILE': 'Mobile Money',
            'CHECK': 'Chèque',
            'MIXED': 'Paiement Mixte'
        };
        return mapping[method] || method;
    }

    hasTransactionRef(): boolean {
        return this.payments.some(p => p.reference || p.checkNumber || p.phoneNumber);
    }
    
    changeFormat(format: 'thermal' | 'A4') {
        this.printFormat = format;
        this.printFormatChange.emit(format);
    }

    onPrintConfirm() {
        window.print();
        setTimeout(() => this.newSale.emit(), 1000);
    }

    onDownloadPdf() {
        this.isAlertOpen = true;
    }

    onClose() {
        this.close.emit();
    }

    onNewSale() {
        this.newSale.emit();
    }
}
