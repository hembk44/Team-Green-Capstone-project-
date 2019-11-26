import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-upload-courses",
  templateUrl: "./upload-courses.component.html",
  styleUrls: ["./upload-courses.component.css"]
})
export class UploadCoursesComponent implements OnInit {
  uploadForm: FormGroup;
  validFileExtensions: string[] = ["xlsx", "csv"];
  invalidExtension: string;
  isInvalid: boolean = false;

  selectedFiles: FileList;
  currentFileUpload: File;

  currentRole: string;

  majors: string[];

  constructor(
    private formBuilder: FormBuilder,
    private dataStorage: DataStorageService,
    private role: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.majors = [];
    this.dataStorage.getMajors();
    this.dataStorage.isLoading.subscribe(loading => {
      if (!loading) {
        this.majors = this.dataStorage.majors;
      }
    });
    this.currentRole = this.role.user;
    console.log(this.role.user);
    this.uploadForm = this.formBuilder.group({
      uploadFile: [undefined, [Validators.required]],
      major: ["", Validators.required]
    });
    console.log(this.majors);
  }

  onSubmit() {
    if (this.isInvalid) {
      this.invalidExtension = "not supported file type!!!";
    } else {
      console.log("submitted");
      this.currentFileUpload = this.selectedFiles.item(0);
      console.log(this.currentFileUpload);
      const formData = new FormData();
      formData.append("major", this.uploadForm.value["major"]);
      formData.append("file", this.currentFileUpload);
      this.dataStorage.addCourses(formData).subscribe(result => {
        console.log(result);
        if (result) {
          this._snackBar.open(result.message, "close", {
            duration: 5000,
            panelClass: ["standard"]
          });
        }
      });
    }
  }

  upload(event: any) {
    this.selectedFiles = event.target.files;
    this.isInvalid = false;
    //check file is valid
    if (!this.validateFile(this.selectedFiles[0].name)) {
      this.isInvalid = true;
      // console.log('Selected file format is not supported');
      // this.invalidExtension = "not supported file type!!!";
      console.log(this.invalidExtension);
      // return this.invalidExtension;
      // return this.isInvalid;
    }
  }

  validateFile(name: String) {
    var fileExt = name.substring(name.lastIndexOf(".") + 1);
    console.log("Input files extension: " + fileExt);
    for (let ext of this.validFileExtensions) {
      if (fileExt.toLowerCase() == ext) {
        return true;
      }
    }
    return false;
  }
}
