import { Component, OnInit } from '@angular/core';

import { GoogleLoginProvider, SocialAuthService } from 'lib';
import { SocialUser } from 'lib';
import {
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider,
  MicrosoftLoginProvider,
} from 'lib';
import { GoogleOidcLoginProviderService } from '../google-oidc-login-provider.service';

@Component({
  selector: 'lib-app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css'],
})
export class DemoComponent implements OnInit {
  user: SocialUser | undefined;
  GoogleLoginProvider = GoogleLoginProvider;
  GoogleOidcLoginProvider = GoogleOidcLoginProviderService;

  constructor(private readonly _authService: SocialAuthService) {}

  ngOnInit() {
    this._authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  signInWithGoogle(): void {
    this._authService.signIn(GoogleOidcLoginProviderService.PROVIDER_ID);
  }

  signInWithFB(): void {
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithAmazon(): void {
    this._authService.signIn(AmazonLoginProvider.PROVIDER_ID);
  }

  signInWithVK(): void {
    this._authService.signIn(VKLoginProvider.PROVIDER_ID);
  }

  signInWithMicrosoft(): void {
    this._authService.signIn(MicrosoftLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this._authService.signOut();
  }

  refreshGoogleToken(providerId: string): void {
    this._authService.refreshAuthToken(providerId);
  }
}
