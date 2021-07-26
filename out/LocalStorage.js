"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
class LocalStorageService {
    constructor(storage) {
        this.storage = storage;
        // Used to delete all data in json
        //this.storage.update("Sites", "");
    }
    saveSites(id, data) {
        let json = "";
        data.forEach((site) => {
            json += JSON.stringify(site) + ";";
            console.log("Save: " + JSON.stringify(site));
        });
        json = json.substring(0, json.length - 1);
        this.storage.update(id, json);
    }
    getValue(id) {
        let json = this.storage.get(id, "");
        if (json === "") {
            return [];
        }
        let split = json.split(";");
        let sites = [];
        split.forEach((element) => {
            console.log("Load: " + element);
            let site = JSON.parse(element);
            sites.push(site);
        });
        return sites;
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=LocalStorage.js.map