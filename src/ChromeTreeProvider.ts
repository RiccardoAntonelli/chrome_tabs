import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ChromeTreeProvider implements vscode.TreeDataProvider<TreeItem> {

    constructor(data: Array<{name: string, url: string, pinned: boolean, path: string}>) {
      this.data = [];
      data.forEach(element => {
        this.data.push(new TreeItem(element, "site"));
      });
    }

    data: TreeItem[];

    private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined> = new vscode.EventEmitter<TreeItem | undefined>();

    readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined> = this._onDidChangeTreeData.event;

    refresh(): void {
      this._onDidChangeTreeData.fire(undefined);
    }


    getTreeItem(element: TreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
      if (element.children === undefined) {
        element.contextValue = "site";
      }
      else {
        element.contextValue = "folder";
      }
      return element;
    }

  
    getChildren(element?: TreeItem|undefined): vscode.ProviderResult<TreeItem[]> {
      if (element === undefined) {
        return this.data;
      }
      return element.children;
    }
}

class TreeItem extends vscode.TreeItem {
  children: TreeItem[]|undefined;

  constructor(site: {name: string, url: string, pinned: boolean, path: string}, contextValue: string, children?: TreeItem[],) {
    super(
        site.name,
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
    this.contextValue = contextValue;
    this.description = site.url;
    this.command  = {
      "title": "Show error",
      "command": "pinnedSites.openSite",
      "arguments": [site]
    };
  }
}