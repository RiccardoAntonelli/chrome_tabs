"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeItem = void 0;
const vscode = require("vscode");
const path = require("path");
class TreeItem extends vscode.TreeItem {
    constructor(name, url, pinned) {
        super(name !== null && name !== void 0 ? name : "", vscode.TreeItemCollapsibleState.None);
        this.name = name !== null && name !== void 0 ? name : "";
        this.url = url !== null && url !== void 0 ? url : "";
        this.pinned = pinned !== null && pinned !== void 0 ? pinned : false;
        this.contextValue = "site";
        this.description = url !== null && url !== void 0 ? url : "";
        this.command = {
            title: "View site",
            command: "pinnedSites.openSite",
            arguments: [this],
        };
        this.iconPath = {
            light: path.join(__filename, "..", "..", "resources", "light", "globe.svg"),
            dark: path.join(__filename, "..", "..", "resources", "dark", "globe.svg"),
        };
    }
    get(key) {
        switch (key) {
            case "name":
                return this.name;
            case "url":
                return this.url;
            case "pinned":
                return this.pinned;
        }
    }
    set(name, url, pinned) {
        this.name = name !== null && name !== void 0 ? name : this.name;
        this.url = url !== null && url !== void 0 ? url : this.url;
        this.pinned = pinned !== null && pinned !== void 0 ? pinned : this.pinned;
        this.contextValue = "site";
        this.description = url !== null && url !== void 0 ? url : this.url;
        this.command = {
            title: "View site",
            command: "pinnedSites.openSite",
            arguments: [this],
        };
        this.iconPath = {
            light: path.join(__filename, "..", "..", "resources", "light", "globe.svg"),
            dark: path.join(__filename, "..", "..", "resources", "dark", "globe.svg"),
        };
        super.label = name !== null && name !== void 0 ? name : this.name;
        super.collapsibleState = vscode.TreeItemCollapsibleState.None;
    }
    equals(other) {
        if (this.name === other.name &&
            this.url === other.url &&
            this.pinned === other.pinned) {
            return true;
        }
        return false;
    }
}
exports.TreeItem = TreeItem;
//# sourceMappingURL=site.js.map