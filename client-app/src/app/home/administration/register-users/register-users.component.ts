import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
// import { FileValidator } from "ngx-material-file-input";

@Component({
  selector: "app-register-users",
  templateUrl: "./register-users.component.html",
  styleUrls: ["./register-users.component.css"]
})
export class RegisterUsersComponent implements OnInit {
  uploadForm: FormGroup;
  validFileExtensions: string[] = ["xlsx", "csv"];
  invalidExtension: string;
  isInvalid: boolean = false;

  selectedFiles: FileList;
  currentFileUpload: File;

  // selectedFiles: FileList;
  // currentFile: File;

  currentRole: string;

  constructor(
    private formBuilder: FormBuilder,
    private dataStorage: DataStorageService,
    private role: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    this.uploadForm = this.formBuilder.group({
      uploadFile: [undefined, [Validators.required]],
      role: [Validators.required]
    });
  }

  // selectFile(event: any) {
  //   this.selectedFiles = event.target.files;
  // }

  // upload() {
  //   this.currentFile = this.selectedFiles.item(0);
  //   this.dataStorage.registerUsers(this.currentFile).subscribe(response => {
  //     console.log(response);
  //   });
  // }

  onSubmit() {
    if (this.isInvalid) {
      this.invalidExtension = "not supported file type!!!";
    } else {
      console.log("submitted");
      this.currentFileUpload = this.selectedFiles.item(0);
      console.log(this.currentFileUpload);
      this.dataStorage
        .registerUsers(this.currentFileUpload, this.uploadForm.get('role').value)
        .subscribe(result => {
          console.log(result);
          if (result.status === 201) {
            let snackBarRef = this._snackBar.open(
              "All users are successfully registered!!!",
              "close",
              { duration: 10000, panelClass: ["standard"] }
            );
            snackBarRef
              .onAction()
              .subscribe(() => this.router.navigate(["/home/admin"]));
            // this.groupDetailDataShare.passSharedMessage(result.message);
            // this._snackBar.openFromComponent(SnackBarGroup, {
            //   duration: 5000
            // });
          }
        });
      this.router.navigate(["/home/admin"]);
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
