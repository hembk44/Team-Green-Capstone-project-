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
export class BroadcastManagementComponent implements OnInit{

  imageForm: FormGroup;
  images: any;
  validFileExtensions: string[] = ["png","jpg","webp","jpeg","PNG","JPG","WEBP","JPEG"];
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
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = (_event) => { 
          this.newImgs.push(reader.result);
        }
      }
      console.log(this.newImgs);
    })

    // this.dataStorage.isLoading.subscribe(loading => {
    //   if(!loading){
    //     for(let img of this.images){
    //       this.dataStorage.getImageByName(img).subscribe(result => {
    //         this.newImgs.push(result);
    //       })
    //     }
    //   }
    // })

    
    //console.log(this.newImgs);

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
    const blob = new Blob([int8Array], { type: 'image/jpeg' });    
    return blob;
 }

  upload(event: any) {
    const reader = new FileReader();
    const file = <File>event.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = (_event) => { 
      this.newImgs.push(reader.result);
    }
    console.log(file);
    this.userFile = file;

  }

  delete(index: number){
    this.newImgs.splice(index, 1);
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
    this.dataStorage.uploadImage(this.newImgs).subscribe(result =>{
      console.log(result);
    });
  }

  // ngOnDestroy() {
  //   this.onSubmit();
  // }

  saveForm(submitForm: FormGroup){
    if(submitForm.valid){
      //this.tempArr.push(this.userFile);
      const formData: FormData = new FormData();
      for(let img of this.newImgs){
        //this.tempArr.push(img);
      }
      console.log(this.tempArr);
      //formData.append('file', this.tempArr);
      console.log(formData.get('file'));
      console.log(formData)
      // this.dataStorage.uploadImage(formData).subscribe(result => {
      //   console.log(result);
      // });
    } 
  }

}
