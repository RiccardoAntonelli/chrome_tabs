"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeTreeProvider = void 0;
const vscode = require("vscode");
const site_1 = require("./site");
class ChromeTreeProvider {
    constructor(localStorage) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.data = localStorage.getSites();
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element === undefined) {
            return this.data;
        }
        return element.get("children");
    }
    deleteTreeItem(element) {
        delete this.data[this.data.indexOf(element)];
        this.refresh();
    }
    addTreeItem(site) {
        this.data.push(new site_1.TreeItem(site.get("name"), site.get("url"), site.get("pinned")));
        this.refresh();
    }
    editTreeItem(previousElement, element) {
        this.data[this.data.indexOf(previousElement)] = element;
        this.refresh();
    }
}
exports.ChromeTreeProvider = ChromeTreeProvider;
//# sourceMappingURL=tree_provider.js.map