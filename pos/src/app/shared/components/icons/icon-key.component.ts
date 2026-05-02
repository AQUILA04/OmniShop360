import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-icon-key',
    standalone: true,
    imports: [CommonModule],
    template: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 2L12 11M21 2H15M21 2V8M10 11.5C10 12.1934 9.86343 12.8799 9.59809 13.5204C9.33276 14.161 8.94389 14.7429 8.45355 15.2332C7.96321 15.7236 7.38131 16.1124 6.7408 16.3778C6.10029 16.6431 5.41378 16.7797 4.72044 16.7797C4.0271 16.7797 3.34059 16.6431 2.70008 16.3778C2.05957 16.1124 1.47767 15.7236 0.987332 15.2332C0.496994 14.7429 0.108125 14.161 -0.157209 13.5204C-0.422543 12.8799 -0.559109 12.1934 -0.559109 11.5C-0.559109 8.58629 1.80257 6.22415 4.72044 6.22415C6.17188 6.22415 7.48599 6.81238 8.45355 7.76685L10 6.22044L12 8.22044L10 10.2204L10 11.5Z"
        stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10 11C10 14.866 6.866 18 3 18C2.25 18 1.5 17.8 0.8 17.5" stroke="white" stroke-width="0" />
      <path
        d="M15.5 5.5L11.5 9.5C10.7483 8.74832 9.77121 8.27581 8.73031 8.13627M8.13627 8.73031C8.27581 9.77121 8.74832 10.7483 9.5 11.5C9.5 11.5 11 10 12 9"
        stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <path
        d="M7 11C7 13.2091 5.20914 15 3 15C0.790861 15 -1 13.2091 -1 11C-1 8.79086 0.790861 7 3 7C5.20914 7 7 8.79086 7 11Z"
        stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="3" cy="11" r="1" fill="#4B5563" />
      <path d="M11 7L13 9" stroke="#4B5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `,
    styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class IconKeyComponent { }
