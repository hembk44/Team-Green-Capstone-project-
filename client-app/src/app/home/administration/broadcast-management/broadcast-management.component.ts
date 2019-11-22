import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStorageService } from '../../shared/data-storage.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-broadcast-management',
  templateUrl: './broadcast-management.component.html',
  styleUrls: ['./broadcast-management.component.css']
})
export class BroadcastManagementComponent implements OnInit {

  imageForm: FormGroup;
  validFileExtensions: string[] = ["png","jpg","webp","jpeg"];
  invalidExtension: string;
  isInvalid: boolean = false;

  selectedFiles: FileList;
  currentFileUpload: File;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataStorage: DataStorageService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.imageForm = this.formBuilder.group({
      image: [undefined, Validators.required]
    })
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

  onSubmit() {
    if (this.isInvalid) {
      this.invalidExtension = "not supported file type!!!";
    } else {
      console.log("submitted");
      this.currentFileUpload = this.selectedFiles.item(0);
      console.log(this.currentFileUpload);

      this.dataStorage
        .uploadImage(this.currentFileUpload)
        // .subscribe(result => {
        //   console.log(result);
        //   if (result.status === 201) {
        //     let snackBarRef = this._snackBar.open(
        //       "Image Successfully Uploaded.",
        //       "close",
        //       { duration: 5000, panelClass: ["standard"] }
        //     );
        //     snackBarRef
        //       .onAction()
        //       .subscribe(() => this.router.navigate(["/home/broadcast-management"]));
        //   }
        // });
      this.imageForm.reset();
      this.imageForm.clearAsyncValidators();
      this.imageForm.clearValidators();
      this.router.navigate(["/home/broadcast-management"]);
    }
  }

  deleteImg(){
    console.log('yeet');
  }

}
