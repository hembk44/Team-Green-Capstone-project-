import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-update-roles',
  templateUrl: './update-roles.component.html',
  styleUrls: ['./update-roles.component.css','../register-users/register-users.component.css']
})
export class UpdateRolesComponent implements OnInit {

  users = [
    {
      name: "Andrew Moore",
      email: "andrew.moore9497@gmail.com",
      role: "admin"
    },
    {
      name: "andrew",
      email: "ocsmoore@gmail.com",
      role: "student"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
