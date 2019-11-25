import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { GroupDataStorageService } from "../../group/group-data-storage.service";

@Component({
  selector: "app-upload-major",
  templateUrl: "./upload-major.component.html",
  styleUrls: ["./upload-major.component.css"]
})
export class UploadMajorComponent implements OnInit {
  uploadForm: FormGroup;
  validFileExtensions: string[] = ["xlsx", "csv"];
  invalidExtension: string;
  isInvalid: boolean = false;
  selectedFiles: FileList;
  currentFileUpload: File;
  currentRole: string;
  allMajors: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private dataStorage: DataStorageService,
    private role: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private groupDataStorage: GroupDataStorageService
  ) {}

  ngOnInit() {
    this.groupDataStorage.getAllMajors();
    this.groupDataStorage.isLoading.subscribe(loading => {
      if (!loading) {
        this.allMajors = this.groupDataStorage.majors;
        console.log(this.allMajors);
      }
    });
    this.currentRole = this.role.user;
    console.log(this.role.user);
    this.uploadForm = this.formBuilder.group({
      uploadFile: [undefined, [Validators.required]],
      major: ["", [Validators.required]]
    });
  }
  onSubmit() {
    if (this.isInvalid) {
      this.invalidExtension = "not supported file type";
    } else {
      console.log("submitted");
      this.currentFileUpload = this.selectedFiles.item(0);
      console.log(this.currentFileUpload);
      const formData = new FormData();
      formData.append("major", this.uploadForm.value.major);
      formData.append("file", this.currentFileUpload);
      this.dataStorage.uploadMajors(formData).subscribe(result => {
        console.log(result);
        if (result.status === 200) {
          let snackBarRef = this._snackBar.open(
            result.message,
            "",
            { duration: 5000, panelClass: ["standard"] }
          );
          snackBarRef
            .onAction()
            .subscribe(() => this.router.navigate(["/home/admin"]));
        }
      });
      this.router.navigate(["/home/admin"]);
    }
  }

  upload(event: any) {
    this.selectedFiles = event.target.files;
    this.isInvalid = false;
    if (!this.validateFile(this.selectedFiles[0].name)) {
      this.isInvalid = true;
      this.invalidExtension = "not supported file type. Upload .xlsx file!";
      console.log(this.invalidExtension);
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
