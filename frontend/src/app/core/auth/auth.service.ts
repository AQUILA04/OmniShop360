import { Injectable, inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

export interface UserProfile {
  name: string;
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private oauthService = inject(OAuthService);
  private router = inject(Router);

  constructor() {
    // Initialisation déjà faite dans app.config ou app.component normalement
    // Mais on peut forcer le chargement ici si besoin
  }

  login() {
    this.oauthService.initCodeFlow();
  }

  logout() {
    this.oauthService.logOut();
    this.router.navigate(['/']);
  }

  get identityClaims(): any {
    return this.oauthService.getIdentityClaims();
  }

  get userProfile(): UserProfile | null {
    const claims = this.identityClaims;
    if (!claims) return null;

    return {
      name: claims['name'] || claims['given_name'] || 'User',
      email: claims['email'] || '',
      username: claims['preferred_username'] || 'user'
    };
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
