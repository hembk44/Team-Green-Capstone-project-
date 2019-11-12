import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GroupDataStorageService } from '../group-data-storage.service';
import { Group } from '../models-group/group';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css','../create-group/create-group.component.css']
})
export class GroupEditComponent implements OnInit {

  id: number;
  group: any;
  groupForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  emails: string[] = [];
  semesterTerm: string[] = ["Fall", "Spring"];
  semesterYear: number[] = [2019, 2020, 2021];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataStorage: GroupDataStorageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      console.log(this.id);
    });
    this.dataStorage.displayGroupDetails(this.id).subscribe(result => {
      this.dataStorage.isLoading.subscribe((loading) => {
        if(!loading){
          this.group=result.result;
          console.log(this.group);
        }
      })
    });
    
    this.emails = this.group.members;
    console.log(this.emails)
    this.groupForm = new FormGroup({
      title: new FormControl(this.group.name, [Validators.required]),
      description: new FormControl(this.group.description, [Validators.required]),
      groupType: new FormControl([Validators.required]),
      email: this.email,
      semesterTerm: new FormControl([Validators.required]),
      semesterYear: new FormControl([Validators.required]),
      majorControl: new FormControl([Validators.required])
    });
  }

  onSubmit(){
    console.log(this.groupForm.value);
  }

  cancel(){
    this.router.navigate(['home/group/', this.id])
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

}
