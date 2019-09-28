import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { AuthLoginInfo } from "./login-info";
import { SignUpInfo } from "./signup-info";
import { ApiResponse } from "./api.response";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private loginUrl = "http://localhost:8181/api/auth/signin";
  private signupUrl = "http://localhost:8181/api/auth/signup";

  constructor(private http: HttpClient) {}

  attemptAuth(credentials: AuthLoginInfo): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.loginUrl, credentials, httpOptions);
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
}
