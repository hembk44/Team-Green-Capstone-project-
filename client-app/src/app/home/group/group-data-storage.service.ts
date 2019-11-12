import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject, Observable, throwError } from "rxjs";
import { Group } from "./models-group/group";
import { AuthService } from "src/app/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { map, catchError, finalize } from "rxjs/operators";
import { ApiResponse } from "src/app/auth/api.response";

@Injectable({
  providedIn: "root"
})
export class GroupDataStorageService {
  private baseUrlGroup = "http://localhost:8181/api/group/";

  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);
  public isLoading: Observable<boolean> = this.isLoadingSubject.asObservable();

  private groupSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private authService: AuthService) {}

  get groupLists(): Group[] {
    return this.groupSubject.value;
  }

  createGroup(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<Object>(this.baseUrlGroup + "createFromList", obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  fetchGroup() {
    this.isLoadingSubject.next(true);
    this.http
      .get<ApiResponse>(this.baseUrlGroup + "fetch")
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      )
      .subscribe((result: ApiResponse) => {
        console.log("Group received!");
        console.log(result);
        if (result.status == 200 && result.result) {
          this.groupSubject.next(result.result);
        }
      });
  }

  displayGroupDetails(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .get<ApiResponse>(this.baseUrlGroup + "getDetails/" + id)
      .pipe(
        (map(data => data),
        catchError(error => throwError(error)),
        finalize(() => this.isLoadingSubject.next(false)))
      );
  }

  shareGroup(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http.post<Object>(this.baseUrlGroup + "share", obj).pipe(
      (map(data => data), catchError(error => throwError(error))),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteGroup(id: number) {
    this.isLoadingSubject.next(true);
    return this.http.delete<Object>(this.baseUrlGroup + "delete/" + id).pipe(
      (map(data => data), catchError(error => throwError(error))),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  sendEmail(obj: Object){
    this.isLoadingSubject.next(true);
    return this.http.post<Object>(this.baseUrlGroup + "sendEmail", obj).pipe(
      (map(data => data), catchError(error => throwError(error))),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
}
