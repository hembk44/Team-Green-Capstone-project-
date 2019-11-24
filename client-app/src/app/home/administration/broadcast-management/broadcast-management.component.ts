import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStorageService } from '../../shared/data-storage.service';
import { MatSnackBar } from '@angular/material';
import { arrayToHash } from '@fullcalendar/core/util/object';

@Component({
  selector: 'app-broadcast-management',
  templateUrl: './broadcast-management.component.html',
  styleUrls: ['./broadcast-management.component.css']
})
export class BroadcastManagementComponent implements OnInit,OnDestroy {

  imageForm: FormGroup;
  images: any;
  validFileExtensions: string[] = ["png","jpg","webp","jpeg"];
  invalidExtension: string;
  isInvalid: boolean = false;

  selectedFiles: FileList;
  currentFileUpload: File[];
  previewUrl: string | ArrayBuffer;
  uploadString: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataStorage: DataStorageService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.images = [];
    this.dataStorage.getImages().subscribe(result => {
      this.images = result.result;
    });

    this.imageForm = this.formBuilder.group({
      image: [undefined, Validators.required]
    })
  }

  upload(event: any) {
    const reader = new FileReader();
    const fileData = <File>event.target.files[0];

    reader.readAsDataURL(fileData);
    reader.onload = (_event) => { 
      this.images.push(reader.result);
    }

  }

  delete(index: number){
    this.images.splice(index, 1);
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
    this.dataStorage.uploadImage(this.images).subscribe(result =>{
      console.log(result);
    });
  }

  deleteImg(){
    console.log('yeet');
  }

  ngOnDestroy() {
    this.onSubmit();
  }

}
