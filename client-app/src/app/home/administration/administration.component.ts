import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  role: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.role = this.authService.user;
    if(this.role !== 'ROLE_ADMIN'){
      this.router.navigate(['home/dashboard']);
    }
  }

}
