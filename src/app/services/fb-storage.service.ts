import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { eCollections } from '../class/firebase.model';
import { LoaderService } from './loader.service';

@Injectable({
    providedIn: 'root'
})
export class FbStorageService {
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

    constructor(
        private loader: LoaderService,
        private firestore: AngularFirestore) { }

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
                querySnapshot => {
                    querySnapshot.forEach(doc => {
                        // list.push(doc.data());
                        list.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    })
                    // console.log("Listado:", list);
                    this.loader.hide();
                    resolve(list)
                },
                error => {
                    // console.log("Error Listado:", error, list);
                    this.loader.hide();
                    reject(error);
                }
            )
        })
    }
    public readOne(collection: eCollections, id: string) {
        this.loader.show();
        return this.firestore.collection(collection).doc(id).get().toPromise()
            .then((doc) => {
                this.loader.hide();
                if (doc.exists) {
                    // console.log("Document data:", doc.data());
                    return doc.data();
                } else {
                    // doc.data() will be undefined in this case
                    // console.log("No such document!");
                    return false
                }
            }).catch((error) => {
                this.loader.hide();
            });
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
}
