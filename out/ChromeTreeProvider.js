"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeTreeProvider = void 0;
const vscode = require("vscode");
class ChromeTreeProvider {
    constructor(data) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.data = [];
        data.forEach(element => {
            this.data.push(new TreeItem(element, "site"));
        });
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        if (element.children === undefined) {
            element.contextValue = "site";
        }
        else {
            element.contextValue = "folder";
        }
        return element;
    }
    getChildren(element) {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}
exports.ChromeTreeProvider = ChromeTreeProvider;
class TreeItem extends vscode.TreeItem {
    constructor(site, contextValue, children) {
        super(site.name, children === undefined ? vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Expanded);
        this.children = children;
        this.contextValue = contextValue;
        this.description = site.url;
        this.command = {
            "title": "Show error",
            "command": "pinnedSites.openSite",
            "arguments": [site]
        };
    }
}
//# sourceMappingURL=ChromeTreeProvider.js.map