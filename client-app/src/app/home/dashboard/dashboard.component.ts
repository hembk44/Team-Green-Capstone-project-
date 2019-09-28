import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit() {}

  backend() {
    this.http
      .get<any>("/api/auth/test")
      .subscribe(result => console.log(result));
  }
}
