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
    console.log(this.groupSubject.value);
    if (!this.groupSubject.value) {
      return [];
    } else {
      return this.groupSubject.value;
    }
  }

  createGroup(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlGroup + "createFromList", obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  createGroupWithFile(formData: FormData) {
    return this.http
      .post<ApiResponse>(
        "http://localhost:8181/api/group/createFromFile",
        formData
      )
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
        } else {
          this.groupSubject.next([]);
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
    return this.http.post<ApiResponse>(this.baseUrlGroup + "share", obj).pipe(
      (map(data => data), catchError(error => throwError(error))),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  deleteGroup(id: number) {
    this.isLoadingSubject.next(true);
    return this.http
      .delete<ApiResponse>(this.baseUrlGroup + "delete/" + id)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  sendEmail(obj: Object) {
    this.isLoadingSubject.next(true);
    return this.http
      .post<ApiResponse>(this.baseUrlGroup + "sendEmail", obj)
      .pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
  }

  updateGroup(obj: Object, id: number) {
    {
      this.isLoadingSubject.next(true);
      return this.http.put<Object>(this.baseUrlGroup + "edit/" + id, obj).pipe(
        (map(data => data), catchError(error => throwError(error))),
        finalize(() => this.isLoadingSubject.next(false))
      );
    }
  }
}
