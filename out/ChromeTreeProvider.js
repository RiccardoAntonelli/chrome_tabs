"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeTreeProvider = void 0;
const vscode = require("vscode");
class ChromeTreeProvider {
    constructor() { }
    getChildren(element) {
        throw new Error('Method not implemented.');
    }
    getTreeItem(element) {
        return element;
    }
}
exports.ChromeTreeProvider = ChromeTreeProvider;
class Dependency extends vscode.TreeItem {
    constructor(label, url, version, collapsibleState) {
        super(label, collapsibleState);
        this.label = label;
        this.url = url;
        this.version = version;
        this.collapsibleState = collapsibleState;
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }
}
//# sourceMappingURL=ChromeTreeProvider.js.map