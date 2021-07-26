"use strict";

import { Memento } from "vscode";

export class LocalStorageService {
  constructor(private storage: Memento) {
    // Used to delete all data in json
    //this.storage.update("Sites", "");
  }

  public saveSites(
    id: string,
    data: Array<{ name: string; url: string; pinned: boolean; path: string }>
  ) {
    let json = "";
    data.forEach((site) => {
      json += JSON.stringify(site) + ";";
      console.log("Save: " + JSON.stringify(site));
    });
    json = json.substring(0, json.length - 1);
    this.storage.update(id, json);
  }

  public getValue(
    id: string
  ): Array<{ name: string; url: string; pinned: boolean; path: string }> {
    let json = this.storage.get<string>(id, "");
    if (json === "") {
      return [];
    }
    let split = json.split(";");

    let sites: any[] = [];

    split.forEach((element) => {
      console.log("Load: " + element);
      let site = JSON.parse(element);
      sites.push(site);
    });

    return sites;
  }
}
