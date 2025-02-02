import { BrowserModule } from '@angular/platform-browser';
import { inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DemoComponent } from './demo/demo.component';

import {
  SocialLoginModule,
  FacebookLoginProvider,
  AmazonLoginProvider,
  VKLoginProvider,
  MicrosoftLoginProvider,
  SocialAuthServiceConfig,
} from 'lib';
import { OAuthModule } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { GoogleOidcLoginProviderService } from './google-oidc-login-provider.service';

@NgModule({
  declarations: [AppComponent, NavbarComponent, DemoComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    SocialLoginModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleOidcLoginProviderService.PROVIDER_ID,
            provider: GoogleOidcLoginProviderService,
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('561602290896109'),
          },
          {
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider(
              'amzn1.application-oa2-client.f074ae67c0a146b6902cc0c4a3297935'
            ),
          },
          {
            id: VKLoginProvider.PROVIDER_ID,
            provider: new VKLoginProvider('7624815'),
          },
          {
            id: MicrosoftLoginProvider.PROVIDER_ID,
            provider: new MicrosoftLoginProvider(
              '0611ccc3-9521-45b6-b432-039852002705'
            ),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
