import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { User } from "../model/user.model";
import { Observable } from "rxjs/index";
import { ApiResponse } from "../model/api.response";

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}
  baseUrl: string = "http://localhost:8181/";
  userBaseUrl: string = "http://localhost:8181/api/users/";

  login(loginPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.baseUrl + "api/login/generate-token",
      loginPayload
    );
  }

  getUsers(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.userBaseUrl);
  }

  getUserById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  createUser(user: User): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.userBaseUrl+"register" , user);
  }

  updateUser(user: User): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.userBaseUrl + user, user);
  }

  deleteUser(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.userBaseUrl + id);
  }
}
