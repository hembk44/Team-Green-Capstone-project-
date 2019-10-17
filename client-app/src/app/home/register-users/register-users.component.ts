import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      uploadFile: [undefined, [Validators.required]]
    });
  }
  onSubmit() {
    if (this.isInvalid) {
      this.invalidExtension = "not supported file type!!!";
    } else {
      console.log(this.uploadForm.value.uploadFile);
    }
  }

  upload(event: any) {
    let files = event.target.files;
    this.isInvalid = false;
    //check file is valid
    if (!this.validateFile(files[0].name)) {
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
