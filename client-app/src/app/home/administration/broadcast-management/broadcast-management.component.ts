import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataStorageService } from '../../shared/data-storage.service';
import { MatSnackBar } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-broadcast-management',
  templateUrl: './broadcast-management.component.html',
  styleUrls: ['./broadcast-management.component.css']
})
export class BroadcastManagementComponent implements OnInit,OnDestroy{

  imageForm: FormGroup;
  images: any;
  validFileExtensions: string[] = ["png","jpg","webp","jpeg","PNG","JPG","WEBP","JPEG","jfif"];
  invalidExtension: string;
  isInvalid: boolean = false;
  tempArr;

  public userFile: any = File;

  selectedFiles: FileList;
  currentFileUpload: File[];
  previewUrl: string | ArrayBuffer;
  uploadString: any;
  newImgs: any;
  url:any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataStorage: DataStorageService,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.images = [];
    this.tempArr = [];
    this.newImgs = [];
    
    this.dataStorage.getImages().subscribe(result => {
      this.images = result.result;
      for(let img of this.images){
        const date = new Date().valueOf();
        const newUrl = this.dataURItoBlob(img);
        let text = '';
        const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
          text += possibleText.charAt(Math.floor(Math.random() *    possibleText.length));
        }
        // Replace extension according to your media type
        const imageName = date + '.' + text + '.jpeg';
        const imageFile = new File([newUrl], imageName, { type: 'image/jpeg' });
        this.tempArr.push(imageFile);
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = (_event) => { 
          this.newImgs.push(reader.result);
        }
      }
      console.log(this.newImgs);
    })

    this.imageForm = this.formBuilder.group({
      image: [undefined, Validators.required]
    })
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });    
    return blob;
 }

  upload(event: any) {
    
    const files = <File[]>event.target.files;
    for(let file of files){
      if(this.validateFile(file.name)){
        const reader = new FileReader();
        this.tempArr.push(file);
        console.log(this.tempArr);
        reader.readAsDataURL(file);
        reader.onloadend = (_event) => { 
          this.newImgs.push(reader.result);
        }
        console.log(file);
        this.userFile = file;
      }
      
    }
    

  }

  delete(index: number){
    this.newImgs.splice(index, 1);
    this.tempArr.splice(index, 1);
  }

  validateFile(name: String) {
    var fileExt = name.substring(name.lastIndexOf(".") + 1);
    for (let ext of this.validFileExtensions) {
      if (fileExt.toLowerCase() == ext) {
        return true;
      }
    }
    return false;
  }

  onSubmit() {
    this.dataStorage.uploadImage(this.tempArr).subscribe(result =>{
      this._snackBar.open(result.message, '', {duration:5000})
    });
  }


  saveForm(submitForm: FormGroup){
    if(submitForm.valid){
      this.dataStorage.uploadImage(this.tempArr).subscribe(result => {
        this._snackBar.open(result.message, '',{duration:5000})
      })
    } 
  }

  ngOnDestroy(){
    this.dataStorage.uploadImage(this.tempArr);
  }

}
