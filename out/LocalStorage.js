"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
const { stringify, parse } = require("flatted");
const Site_1 = require("./Site");
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
            json = json.substring(0, json.length - 1);
        }
        json += "]";
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
            jsons = json.substring(1).split(";");
        }
        else {
            jsons = [json.substring(1)];
        }
        jsons.forEach((value, index) => {
            let result = Object.assign(new Site_1.TreeItem(), parse(value)[0]);
            result.set();
            sites[index] = result;
        });
        return sites;
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=LocalStorage.js.map