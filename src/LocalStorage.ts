'use strict';

import { Memento } from "vscode";

export class LocalStorageService {
    
    constructor(private storage: Memento) { }   
    
    public getValue(id : string) : string{
        return this.storage.get<string>(id, "");
    }

    public setValue(id : string, json : string){
        this.storage.update(id, json);
    }
}