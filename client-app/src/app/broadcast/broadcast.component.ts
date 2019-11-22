import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../auth/api.response';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent implements OnInit {

  images: any[];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.images = [];
    // this.http.get<ApiResponse>('image url').subscribe(result => {
    //   this.images = result.result;
    // })
  }

}
