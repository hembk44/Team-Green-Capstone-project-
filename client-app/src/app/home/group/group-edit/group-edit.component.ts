import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { GroupDataStorageService } from '../group-data-storage.service';
import { Group } from '../models-group/group';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit {

  id: number;
  group: Group;
  groupForm: FormGroup;
  email = new FormControl("", [Validators.required, Validators.email]);
  emails: string[] = [];

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
    })
    this.dataStorage.displayGroupDetails(this.id).subscribe(result => {
      this.group = result.result;
      console.log(this.group);
    });
    this.groupForm = this.formBuilder.group({
      title: [this.group.name, Validators.required],
      description: [this.group.description, Validators.required],
      groupType: [this.group.groupType, Validators.required],
      email: this.email,
      semesterTerm: [this.group.semesterTerm, Validators.required],
      semesterYear: [this.group.semesterYear, Validators.required],
      majorControl: ["", Validators.required]
    });
  }

}
