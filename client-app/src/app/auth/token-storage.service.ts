import { Injectable } from "@angular/core";

const TOKEN_KEY = "AuthToken";
const USERNAME_KEY = "AuthUsername";
// const AUTHORITIES_KEY = "AuthAuthorities";
const AUTHORITY_KEY = "AuthAuthorities";

@Injectable({
  providedIn: "root"
})
export class TokenStorageService {
  // private roles: Array<string> = [];
  // tokenExists: boolean;
  constructor() {}

  signOut() {
    window.localStorage.clear();
    // this.tokenExists = false;
  }

  public saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
    // this.tokenExists = true;
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveUsername(username: string) {
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, username);
  }

  public getUsername(): string {
    return localStorage.getItem(USERNAME_KEY);
  }

  public saveAuthority(authority: string) {
    window.localStorage.removeItem(AUTHORITY_KEY);
    window.localStorage.setItem(AUTHORITY_KEY, authority);
  }

  public getAuthority(): string {
    return localStorage.getItem(AUTHORITY_KEY);
  }

  // public saveAuthorities(authorities: string[]) {
  //   window.sessionStorage.removeItem(AUTHORITIES_KEY);
  //   window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  // }

  // public getAuthorities(): string[] {
  //   this.roles = [];

  //   if (sessionStorage.getItem(TOKEN_KEY)) {
  //     JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
  //       this.roles.push(authority.authority);
  //     });
  //   }

  //   return this.roles;
  // }
}
