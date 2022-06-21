import { OAuthService } from 'angular-oauth2-oidc';
import { BaseLoginProvider, SocialUser } from 'lib';
import { first, firstValueFrom } from 'rxjs';

export class GoogleOidcLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID = 'GOOGLE_OIDC' as const;

  constructor(
    private readonly _clientId: string,
    private readonly _scopes: string | string[],
    private readonly _oAuthService: OAuthService
  ) {
    super();
  }

  async initialize(autoLogin?: boolean): Promise<void> {
    let ourUrl = window.location.origin + window.location.pathname;
    if (ourUrl.endsWith('/')) {
      ourUrl = ourUrl.substring(0, ourUrl.length - 1);
    }

    this._oAuthService.configure({
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      redirectUri: ourUrl,
      silentRefreshRedirectUri: ourUrl + '/silent-refresh.html',
      useSilentRefresh: true,
      clientId: this._clientId,
      scope:
        this._scopes instanceof Array
          ? this._scopes.filter((s) => s).join(' ')
          : this._scopes,
    });

    await this._oAuthService.loadDiscoveryDocument();
    if (autoLogin) {
      await this._oAuthService.tryLoginImplicitFlow();
    }
  }

  async getLoginStatus(): Promise<SocialUser> {
    if (this._oAuthService.hasValidIdToken()) {
      return this.createUser(this._oAuthService.getIdToken());
    } else {
      throw `No user is currently logged in with ${GoogleOidcLoginProvider.PROVIDER_ID}`;
    }
  }

  async refreshToken(): Promise<SocialUser | null> {
    if (this._oAuthService.hasValidIdToken()) {
      await this._oAuthService.revokeTokenAndLogout(true, true);
      return null;
    }
  }

  async signIn(): Promise<SocialUser> {
    // subscribe before anything else to the Subject under OAuthService.events
    const idTokenPromise = firstValueFrom(
      this._oAuthService.events.pipe(first((e) => e.type === 'token_received'))
    );

    await this._oAuthService.initImplicitFlowInPopup();
    await idTokenPromise;

    return this.createUser(this._oAuthService.getIdToken());
  }

  async signOut(revoke?: boolean): Promise<void> {
    if (revoke) {
      this._oAuthService.revokeTokenAndLogout(true, true);
    } else {
      this._oAuthService.logOut(true);
    }
  }

  private createUser(idToken: string): SocialUser {
    const user = new SocialUser();
    const payload = JSON.parse(window.atob(idToken.split('.')[1]));
    user.idToken = idToken;
    user.id = payload.sub;
    user.name = payload.name;
    user.email = payload.email;
    user.photoUrl = payload.picture;
    user.firstName = payload['given_name'];
    user.lastName = payload['family_name'];
    return user;
  }
}
