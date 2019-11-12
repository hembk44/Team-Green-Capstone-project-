import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete-users',
  templateUrl: './delete-users.component.html',
  styleUrls: ['./delete-users.component.css','../register-users/register-users.component.css']
})
export class DeleteUsersComponent implements OnInit {

  users = [
    {
      name: "Andrew Moore",
      email: "andrew.moore9497@gmail.com",
      role: "ROLE_ADMIN"
    },
    {
      name: "andrew",
      email: "ocsmoore@gmail.com",
      role: "ROLE_USER"
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
