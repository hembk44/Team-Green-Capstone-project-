import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GroupCreateNavigationService {
  private groupTypeSubject: BehaviorSubject<string> = new BehaviorSubject<
    string
  >("nodata");

  public groupType: Observable<string> = this.groupTypeSubject.asObservable();

  constructor() {}

  changeGroupType(status: string) {
    this.groupTypeSubject.next(status);
  }
}
