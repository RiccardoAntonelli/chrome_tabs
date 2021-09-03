"use strict";

import { Memento } from "vscode";
import { Site } from "./extension";

export class LocalStorageService {
  constructor(private storage: Memento) {
    // Used to delete all data in json
    // this.storage.update("Sites", "");
  }

  public saveSites(id: string, data: Site[]) {
    let json = JSON.stringify(data);
    this.storage.update(id, json);
  }

  public getValue(id: string): Site[] {
    let json = this.storage.get<string>(id, "");
    return JSON.parse(json);
  }
}
