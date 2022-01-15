"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const { stringify, parse } = require("flatted");
const site_1 = require("./site");
class LocalStorageService {
    constructor(storage) {
        this.storage = storage;
        // Used to delete all data in json
        // this.storage.update("Sites", "");
    }
    saveSites(data) {
        let json = "[";
        if (data !== [] && data !== undefined) {
            for (let item of data) {
                json += stringify(item);
                json += ";";
            }
            json = json.substring(0, json.length - 2);
        }
        json = json + "]";
        console.log(json);
        this.storage.update("Sites", json);
    }
    getSites() {
        let sites = [];
        let json = this.storage.get("Sites", "");
        let jsons;
        if (json === "[]" || json === "") {
            return [];
        }
        if (json.includes(";")) {
            jsons = json.substring(1, json.length).split(";");
        }
        else {
            jsons = [json.substring(1, json.length)];
        }
        console.log(jsons.toString());
        jsons.forEach((value, index) => {
            let result = Object.assign(new site_1.TreeItem(), parse(value));
            result.set();
            sites[index] = result;
            console.log(result);
        });
        return sites;
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=local_storage.js.map