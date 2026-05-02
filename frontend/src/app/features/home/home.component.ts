import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(private oauthService: OAuthService) { }

    login() {
        this.oauthService.initLoginFlow();
    }

    createShop() {
        this.oauthService.initLoginFlow(); // Or specific registration flow if available
    }
}
