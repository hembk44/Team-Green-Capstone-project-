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
      role: ["students",Validators.required]
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
        .registerUsers(
          this.currentFileUpload,
          this.uploadForm.get("role").value
        )
        .subscribe(result => {
          console.log(result);
          if (result) {
            let snackBarRef = this._snackBar.open(
<<<<<<< HEAD
              result.message,
              "",
=======
              "All users are successfully registered!!!",
              "close",
>>>>>>> 21a876d20177b903673a55f9674e8e244c64b05c
              { duration: 5000, panelClass: ["standard"] }
            );

            snackBarRef
              .onAction()
              .subscribe(() => this.router.navigate(["/home/admin"]));
          }
          else{
            this._snackBar.open('Something went wrong.', 'close', {duration: 5000})
          }
        });
      this.uploadForm.reset();
      this.uploadForm.clearAsyncValidators();
      this.uploadForm.clearValidators();
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
      this.invalidExtension = "not supported file type!!!";
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
