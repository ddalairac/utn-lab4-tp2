import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class FbStorageService {

    constructor(private fbStorage: AngularFireStorage) { }

    onAvatarLoad(event) {
        if (!Date.now) {
            Date.now = function () { return new Date().getTime(); }
        }
        let time = Date.now()

        let file = event.target.files[0];
        let extArr = file.name.split('.')
        let ext = extArr[extArr.length - 1];
        let filePath = 'users/avatar_' + time + '.' + ext;
        let ref = this.fbStorage.ref(filePath);
        let task = this.fbStorage.upload(filePath, file);
        console.log("file", file);
        console.log("filePath", filePath);
        console.log("ext", ext);
    }
}
