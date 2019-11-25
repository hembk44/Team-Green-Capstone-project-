import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MatDialog, MatChipInputEvent } from '@angular/material';
import { GroupSelection } from '../../shared/group-selection';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'share-event',
    templateUrl: 'share-event.html',
    styleUrls: ['./event-detail.component.css']
})
export class ShareEvent implements OnInit{
    shareForm: FormGroup;
    emails: string[];
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        private ref: MatDialogRef<ShareEvent>,
        private dialog: MatDialog,
        private authService: AuthService
    ){}

    role:string;

    ngOnInit(){
        this.emails = []
        this.shareForm = new FormGroup({
            recipients: new FormControl("", [Validators.required])
        });
        this.role = this.authService.user;
    }

    groupSelect(){
        const dialogRef = this.dialog.open(GroupSelection, {
          width: "500px"
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          this.emails = this.emails.concat(result);
          // for(let email of result){
          //   console.log(email);
          //   this.emails.push(email);
            
          // }
        })
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;
    
        // Add emails
        if (value.trim()) {
          this.emails.push(value.trim());
        }
    
        // Reset the input value
        if (input) {
          input.value = "";
        }
      }
    
      remove(email: string): void {
        const index = this.emails.indexOf(email);
    
        if (index >= 0) {
          this.emails.splice(index, 1);
        }
      }

    close(){
        this.ref.close('cancel');
    }

    onSubmit(){
        this.ref.close(this.emails);
    }
}