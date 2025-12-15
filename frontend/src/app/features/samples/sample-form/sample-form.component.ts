import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sample-form',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="page-header">
      <h2>Edit Product</h2>
    </div>

    <div class="card form-container">
       <form>
          <div class="form-group">
             <label>Product Name</label>
             <input type="text" value="Product Name" class="form-control" />
          </div>
          
          <div class="form-group">
             <label>Description</label>
             <textarea class="form-control" rows="4" placeholder="Add a product name, description..."></textarea>
          </div>
          
          <div class="form-group">
             <label>Price</label>
             <input type="number" value="100" class="form-control" />
          </div>
          
          <div class="form-group">
             <label>Category</label>
             <select class="form-control">
                <option>Category</option>
             </select>
          </div>
          
          <div class="form-group">
             <label>Status</label>
             <div class="radio-group">
                <label class="radio-label"><input type="radio" name="status" checked> Radio</label>
                <label class="radio-label"><input type="radio" name="status"> Status</label>
             </div>
          </div>
          
          <div class="form-actions">
             <button type="submit" class="btn-primary">Save</button>
             <button type="button" class="btn-secondary" routerLink="/samples/list">Cancel</button>
          </div>
       </form>
    </div>
  `,
    styles: [`
    .page-header { margin-bottom: 1.5rem; h2 { font-size: 1.5rem; font-weight: 700; }}
    .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); max-width: 800px; }
    
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #334155; }
    
    .form-control {
       width: 100%;
       padding: 0.75rem;
       border: 1px solid #E2E8F0;
       border-radius: 6px;
       font-size: 0.95rem;
       &:focus { border-color: #D4AF37; outline: none; ring: 2px solid rgba(212,175,55,0.2); }
    }
    textarea { resize: vertical; }
    
    .radio-group { display: flex; gap: 1.5rem; }
    .radio-label { display: flex; align-items: center; gap: 0.5rem; font-weight: 400; cursor: pointer; }
    
    .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
    
    .btn-primary { background-color: #0B1E33; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
    .btn-secondary { background-color: #E2E8F0; color: #475569; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; border: none; cursor: pointer; }
  `]
})
export class SampleFormComponent { }
