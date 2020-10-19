import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Profesional, Patient, Admin } from '../class/data.model';
import { eCollections } from '../class/firebase.model';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class FbStorageService {

    constructor(
        private loader: LoaderService,
        private firestore: AngularFirestore) { }


    /** Fetch resource */
    public async get(resource) {
        // console.log("%crestFetch.get", "color:blue;");
        this.loader.show();
        return new Promise((resolve, reject) => {
            fetch(resource)
                .then((res) => {
                    return res.json()
                })
                .then((data) => {
                    // console.log("%cResponse: ", "color:blue", data);
                    this.loader.hide();
                    resolve(data)
                })
                .catch((err) => {
                    // console.error("Error get: " + resource, err);
                    this.loader.hide();
                    // reject(err);
                    resolve(null);
                    // ? MAnejo el error dentro del metodo por eso no retorno el reject()
                    alert("No se pudieron obtener los datos");
                })
        })
    }

    // Fire Base CRUD Metods //

    public async create(collection: eCollections, data: any): Promise<DocumentReference> {
        this.loader.show();
        let res = await this.firestore.collection(collection).add(Object.assign({}, data));
        this.loader.hide();
        return res;
    }
    public async createFromUserId(collection: eCollections, id: string, data: any): Promise<void> {
        this.loader.show();
        let res = await this.firestore.collection(collection).doc(id).set(Object.assign({}, data));
        this.loader.hide();
        return res;
    }
    public async readAll(collection: eCollections): Promise<any> {
        this.loader.show();
        let list = [];
        return new Promise((resolve, reject) => {
            this.firestore.collection(collection).get().subscribe(
                (docs) => {
                    docs.forEach(doc => {
                        list.push({ id: doc.id, ...doc.data() });
                    })
                    resolve(list)
                },
                error => {
                    // console.log("Error Listado:", error, list);
                    reject(error);
                },
                () => this.loader.hide()
            )
        })
    }
    public readOne(collection: eCollections, id: string) {
        this.loader.show();
        return this.firestore.collection(collection).doc(id).get().toPromise()
            .then((doc) => {
                if (doc.exists) {
                    return { id: doc.id, ...doc.data() }
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                    return null
                }
            }).catch((error) => {
                console.log("readOne error:", error);

            }).finally(() => this.loader.hide());
    }
    public async update(collection: eCollections, id: string, data: any): Promise<void> {
        this.loader.show();
        let res = await this.firestore.collection(collection).doc(id).set(Object.assign({}, data));
        this.loader.hide();
        return res;
    }
    public async delete(collection: eCollections, id: string): Promise<void> {
        this.loader.show();
        let res = await this.firestore.collection(collection).doc(id).delete();
        this.loader.hide();
        return res;
    }

    // Fire Base Search //

    public async getUserInfoByUid(uid: string): Promise<Profesional | Patient | Admin> {
        this.loader.show();
        return new Promise((resolve, reject) => {
            this.firestore.collection(eCollections.users, ref => ref.where('uid', '==', uid).limit(1)).get().subscribe(
                (docs) => {
                    let item: Profesional | Patient | Admin
                    docs.forEach(doc => {
                        item = { id: doc.id, ...doc.data() } as Profesional | Patient | Admin;
                    })
                    resolve(item)
                },
                error => {
                    console.log("Error seachByUid:", error);
                    reject(error);
                },
                () => this.loader.hide()
            )
        })
    }

    // img Storage //
    /* 
    service firebase.storage {
        match /b/{bucket}/o {
            match /{allPaths=**} {
            allow read, write: if request.auth != null;
            }
        }
    } */
}
