'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageService = void 0;
class LocalStorageService {
    constructor(storage) {
        this.storage = storage;
    }
    getValue(id) {
        return this.storage.get(id, "");
    }
    setValue(id, json) {
        this.storage.update(id, json);
    }
}
exports.LocalStorageService = LocalStorageService;
//# sourceMappingURL=LocalStorage.js.map