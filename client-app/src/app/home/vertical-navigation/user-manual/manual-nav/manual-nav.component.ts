import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-manual-nav',
  templateUrl: './manual-nav.component.html',
  styleUrls: ['./manual-nav.component.css']
})
export class ManualNavComponent implements OnInit {

  currentRole: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.currentRole = this.authService.user;
  }

  admin(){
    this.router.navigate(["home/user-manual/administration"])
  }

  appointment(){
    this.router.navigate(["home/user-manual/appointments"])
  }

  calendar(){
    this.router.navigate(["home/user-manual/calendar"])
  }

  broadcast(){
    this.router.navigate(["home/user-manual/broadcast"])
  }

  groups(){
    this.router.navigate(["home/user-manual/groups"])
  }

}
