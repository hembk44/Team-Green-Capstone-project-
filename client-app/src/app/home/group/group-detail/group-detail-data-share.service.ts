import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GroupDetailDataShareService {
  private groupDetailDataSubject: BehaviorSubject<string> = new BehaviorSubject<
    string
  >("");
  public groupDetailData: Observable<
    string
  > = this.groupDetailDataSubject.asObservable();

  constructor() {}

  passDeletedMessage(message: string) {
    this.groupDetailDataSubject.next(message);
  }

  passSharedMessage(message: string) {
    this.groupDetailDataSubject.next(message);
  }

  passMessageSentMessage(message: string) {
    this.groupDetailDataSubject.next(message);
  }
}
