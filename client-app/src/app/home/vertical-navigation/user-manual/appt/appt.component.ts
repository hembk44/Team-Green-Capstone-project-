import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-appt',
  templateUrl: './appt.component.html',
  styleUrls: ['./appt.component.css','../user-manual.component.css']
})
export class ApptComponent implements OnInit {

  role:string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.role = this.authService.user;
  }

}
