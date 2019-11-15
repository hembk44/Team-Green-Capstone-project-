import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DataStorageService } from '../../shared/data-storage.service';

@Component({
  selector: 'app-update-roles',
  templateUrl: './update-roles.component.html',
  styleUrls: ['./update-roles.component.css','../register-users/register-users.component.css']
})
export class UpdateRolesComponent implements OnInit {

  updates: any[];
  updateEmails: string[];
  users = [
    {
      name: "Andrew Moore",
      email: "moorea1@warhawks.ulm.edu",
      role: "ROLE_ADMIN"
    },
    {
      name: "andrew",
      email: "ocsmoore@gmail.com",
      role: "ROLE_USER"
    },
    {
      name: "Hem BK",
      email: "baralhems12@gmail.com",
      role: "ROLE_PM"
    },
    {
      name: "Andrew Moore",
      email: "andrew.moore9497@gmail.com",
      role: "ROLE_ADMIN"
    },
    {
      name: "andrew",
      email: "ocsmoore@gmail.com",
      role: "ROLE_USER"
    },
    {
      name: "Hem BK",
      email: "baralhems12@gmail.com",
      role: "ROLE_PM"
    },
    {
      name: "Andrew Moore",
      email: "andrew.moore9497@gmail.com",
      role: "ROLE_ADMIN"
    },
    {
      name: "andrew",
      email: "ocsmoore@gmail.com",
      role: "ROLE_USER"
    },
    {
      name: "Hem BK",
      email: "baralhems12@gmail.com",
      role: "ROLE_PM"
    }
  ]

  constructor(
    private dialog: MatDialog,
    private dataStorage: DataStorageService
  ) { }

  ngOnInit() {
    this.updates = [];
    this.updateEmails = [];
    // this.dataStorage.fetchUsers();
    // this.dataStorage.isLoading.subscribe((loading => {
    //   if(!loading){
    //     this.users = this.dataStorage.users;
    //   }
    // }));
    this.users.sort((a, b) => a.name.toLowerCase() < b.name.toLowerCase() ? -1 : a.name.toLowerCase() > b.name.toLowerCase() ? 1 : 0);
  }

  addUser(name: string, email:string, role:string){
    
    if(this.updateEmails.includes(email)){
      this.updates.splice(this.updateEmails.indexOf(email),1);
      this.updates.push({
        name: name,
        email: email,
        role: role
      });
    } else{
      this.updates.push({
        name: name,
        email: email,
        role: role
      });
      this.updateEmails.push(email);
    }

    console.log(this.updateEmails);
    console.log(this.updates);
    
  }

  onSubmit(){
    console.log(this.updateEmails.length);
    if(this.updateEmails.length !== 0){
      const dialogRef = this.dialog.open(RoleConfirm, {
        width: "650px",
        height: "400px",
        data: this.updates
      })

      dialogRef.afterClosed().subscribe(result => {
        if(result === 'confirmed'){
          this.dataStorage.updateRoles(this.updates);
          this.updateEmails = [];
          this.updates = [];
          console.log(this.updates);
          console.log(this.updateEmails);
        }
      })
    }else{
      alert('Please make some changes first');
    }
    
  }

}

@Component({
  selector:'role-confirm-dialog',
  templateUrl: 'role-confirm.html',
  styleUrls: ['role-confirm.css','update-roles.component.css','../register-users/register-users.component.css']
})
export class RoleConfirm{
  constructor(
    private dialog: MatDialogRef<RoleConfirm>,
    @Inject(MAT_DIALOG_DATA)private data: any[]
  ){}

  confirm(){
    console.log(this.data);
    this.dialog.close('confirmed');
  }

  cancel(){
    this.dialog.close('cancel');
  }

}
