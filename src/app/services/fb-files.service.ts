import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class FbFilesService {

    constructor(private fbStorage: AngularFireStorage,
        private loader: LoaderService,) {
    }
    public urlImage: string;
    public uploadPercent: number;
    public async fileupLoad(folder,event):Promise<string> {
        return new Promise((resolve, reject) => {

            this.loader.show();
            if (!Date.now) {
                Date.now = function () { return new Date().getTime(); }
            }
            let time = Date.now()

            let file = event.target.files[0];
            let extArr = file.name.split('.')
            let ext = extArr[extArr.length - 1];
            extArr.pop()
            extArr.join('_');
            let filePath = folder+'/img_'+extArr + time + '.' + ext;
            let ref = this.fbStorage.ref(filePath);
            let task = this.fbStorage.upload(filePath, file);
            console.log("file", file);
            console.log("filePath", filePath);
            console.log("ext", ext);

            // task.percentageChanges();
            task.snapshotChanges().pipe(finalize(() => ref.getDownloadURL().subscribe(
                (refImg) => {
                    this.loader.hide();
                    // console.log("refImg: ", refImg) 
                    resolve(refImg)
                },
                error => { reject(error) }
            ))).subscribe();
        })
    }
}
