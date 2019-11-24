import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../auth/api.response';
import { DataStorageService } from '../home/shared/data-storage.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent implements OnInit {

  images: any[];
  newImgs;

  constructor(
    private dataStorage: DataStorageService
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

}
