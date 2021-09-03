"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
class LocalStorageService {
    constructor(storage) {
        this.storage = storage;
        // Used to delete all data in json
        // this.storage.update("Sites", "");
    }
    saveSites(id, data) {
        let json = JSON.stringify(data);
        this.storage.update(id, json);
    }
    getValue(id) {
        let json = this.storage.get(id, "");
        return JSON.parse(json);
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=LocalStorage.js.map