import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DataStorageService } from "../../shared/data-storage.service";
import { AuthService } from "src/app/auth/auth.service";
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
  currentRole: string;

  constructor(
    private formBuilder: FormBuilder,
    private dataStorage: DataStorageService,
    private role: AuthService
  ) {}

  ngOnInit() {
    this.currentRole = this.role.user;
    console.log(this.role.user);
    this.uploadForm = this.formBuilder.group({
      uploadFile: [undefined, [Validators.required]]
    });
  }
  onSubmit() {
    if (this.isInvalid) {
      this.invalidExtension = "not supported file type!!!";
    } else {
      console.log("submitted");
      // console.log(this.uploadForm);
      this.currentFileUpload = this.selectedFiles.item(0);
      console.log(this.currentFileUpload);

      this.dataStorage
        .registerUsers(this.currentFileUpload)
        .subscribe(result => console.log(result));
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
        // console.log("true");
        // console.log(ext);
        return true;
      }
    }
    // console.log("false");
    return false;
  }
}
