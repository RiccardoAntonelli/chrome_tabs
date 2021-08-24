"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeItem = exports.ChromeTreeProvider = void 0;
const vscode = require("vscode");
class ChromeTreeProvider {
    constructor(elements) {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.data = [];
        elements.forEach((element) => {
            let treeItem;
            if (element.path !== "") {
                let folders;
                folders = element.path.split("/");
                let treeItem = new TreeItem(element, "site");
                for (let i = folders.length - 1; i >= 0; i--) {
                    treeItem = new TreeItem({ name: folders[i], url: "", pinned: true, path: "" }, "folder", treeItem);
                }
                this.data.push(treeItem);
            }
            else {
                treeItem = new TreeItem(element, "site");
                this.data.push(treeItem);
            }
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
    deleteTreeItem(element) {
        delete this.data[this.data.indexOf(element)];
        this.refresh();
    }
    addTreeItem(site) {
        this.data.push(new TreeItem(site, "site"));
        this.refresh();
    }
    editTreeItem(previousElement, element) {
        this.data[this.data.indexOf(previousElement)] = element;
        this.refresh();
    }
}
exports.ChromeTreeProvider = ChromeTreeProvider;
class TreeItem extends vscode.TreeItem {
    constructor(site, contextValue, children) {
        super(site.name, children === undefined
            ? vscode.TreeItemCollapsibleState.None
            : vscode.TreeItemCollapsibleState.Expanded);
        if (this.children === undefined) {
            if (children !== undefined) {
                this.children = [children];
            }
            else {
                this.children = undefined;
            }
        }
        else if (children !== undefined) {
            this.children.push(children);
        }
        this.contextValue = contextValue;
        this.description = site.url;
        this.site = site;
        this.command = {
            title: "View site",
            command: "pinnedSites.openSite",
            arguments: [this.site],
        };
    }
}
exports.TreeItem = TreeItem;
//# sourceMappingURL=ChromeTreeProvider.js.map