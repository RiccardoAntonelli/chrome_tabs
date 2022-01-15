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
        /*let treeItems : TreeItem [] = [];
        for (let element of elements) {
          if (element.children !== null && element.children !== []) {
            let startItem: TreeItem = new TreeItem(new Site(), 'folder', []);
            let item: TreeItem = startItem;
            let children: Site[] = element.children;
            let hasChildren: boolean = true;
            let items: TreeItem[][] = [];
            let index = 0;
            while (hasChildren) {
              if (children.length === 1) {
                if (children[0] !== items[index][0].site) {
                  if (children[0].children === null || children[0].children === []) {
                    let treeItem = new TreeItem(children[0], 'site', []);
                    index --;
                  }
                  items[index] = [treeItem];
                  item.children?.push(treeItem);
                  children = children[0].children;
                }
                else {
    
                }
              }
              else if (children.length === 0) {
                index --;
              }
              else {
                for (let child of children) {
                }
                index ++;
              }
            }
          }
          else {
            treeItems.push(new TreeItem(element, 'site', []));
          }
        }
    
        this.data = treeItems;*/
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
        this.data.push(new site_1.TreeItem(site.get("name"), site.get("url"), site.get("pinned"), site.get("children")));
        this.refresh();
    }
    editTreeItem(previousElement, element) {
        this.data[this.data.indexOf(previousElement)] = element;
        this.refresh();
    }
}
exports.ChromeTreeProvider = ChromeTreeProvider;
//# sourceMappingURL=ChromeTreeProvider.js.map