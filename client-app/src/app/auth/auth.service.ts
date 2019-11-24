import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthLoginInfo } from "./login-info";
import { SignUpInfo } from "./signup-info";
import { ApiResponse } from "./api.response";
import { TokenStorageService } from "./token-storage.service";
import { Router } from "@angular/router";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private loginUrl = "http://localhost:8181/api/auth/signin";
  private signupUrl = "http://localhost:8181/api/auth/signup";
  private userRoleSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private usernameSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private nameSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public userRole: Observable<string> = this.userRoleSubject.asObservable();
  private isLoggedin: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoggedIn: Observable<boolean> = this.isLoggedin.asObservable();
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  get user(): string {
    this.userRoleSubject.next(this.tokenStorage.getAuthority());

    return this.userRoleSubject.value;
  }

  get username(): string {
    this.usernameSubject.next(this.tokenStorage.getUsername());
    return this.usernameSubject.value;
  }

  get name(): string{
    this.nameSubject.next(this.tokenStorage.getName());
    return this.nameSubject.value;
  }

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  attemptAuth(credentials: AuthLoginInfo) {
    return this.http
      .post<ApiResponse>(this.loginUrl, credentials, httpOptions)
      .subscribe((data: ApiResponse) => {
        if (data) {
          console.log(data);
          console.log(data.result);
          this.tokenStorage.saveToken(data.result.accessToken);
          this.tokenStorage.saveUsername(data.result.name);
          this.tokenStorage.saveName(data.result.username);
          this.tokenStorage.saveAuthority(data.result.role);
          this.userRoleSubject.next(this.tokenStorage.getAuthority());
          this.usernameSubject.next(this.tokenStorage.getUsername());
          console.log(data.result.role);
          this.isLoggedin.next(true);
          this.router.navigate(["home"]);
        }
        else{
          this.isLoggedin.next(false);
        }
      });
  }

  signUp(info: SignUpInfo): Observable<string> {
    return this.http
      .post<string>(this.signupUrl, info, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured!";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.error.message;

    // switch (errorRes.error.error.message) {
    //   case "...":
    //     errorMessage = "...";
    // }
    return throwError(errorMessage);
  }

  isUserLoggedIn() {
    return !!this.tokenStorage.getToken();
  }
}
