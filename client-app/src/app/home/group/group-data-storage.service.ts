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

  // groupChanged = new Subject<GroupModel[]>();
  // constructor() {}
  // private group: GroupModel[] = [
  //   new GroupModel(1, "CSCI 4060", "Software Engineering of Fall 2019", [
  //     "bkhb@warhawks.ulm.edu",
  //     "borenbl@warhawks.ulm.edu",
  //     "byanjay@warhawks.ulm.edu",
  //     "dahala1@warhawks.ulm.edu",
  //     "fontannr@warhawks.ulm.edu",
  //     "guptaa@warhawks.ulm.edu",
  //     "jangs@warhawks.ulm.edu",
  //     "karkin2@warhawks.ulm.edu",
  //     "khadkal@warhawks.ulm.edu",
  //     "laura@warhawks.ulm.edu",
  //     "lemonsdm@warhawks.ulm.edu",
  //     "maharjr@warhawks.ulm.edu",
  //     "moorea1@warhawks.ulm.edu",
  //     "pearsolp@warhawks.ulm.edu",
  //     "peterses@warhawks.ulm.edu",
  //     "rayc@warhawks.ulm.edu",
  //     "sangras@warhawks.ulm.edu",
  //     "shrests3@warhawks.ulm.edu",
  //     "vogtap@warhawks.ulm.edu"
  //   ]),
  //   new GroupModel(2, "ACM", "Students in ACM ULM", [
  //     "hem@warhawks.ulm.edu",
  //     "baral@gmail.com"
  //   ]),
  //   new GroupModel(3, "Nepali Students", "Nepalese CS students", [
  //     "nitesh@warhawks.ulm.edu",
  //     "rohan@gmail.com"
  //   ])
  // ];
  // getGroups() {
  //   return this.group.slice();
  // }
  // getGroup(index: number) {
  //   return this.group[index];
  // }
}
