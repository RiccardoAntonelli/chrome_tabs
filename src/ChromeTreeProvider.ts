"use strict";
import * as vscode from "vscode";

export class ChromeTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  constructor(
    data: Array<{ name: string; url: string; pinned: boolean; path: string }>
  ) {
    this.data = [];
    data.forEach((element) => {
      this.data.push(new TreeItem(element, "site"));
    });
  }

  data: TreeItem[];

  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined> =
    new vscode.EventEmitter<TreeItem | undefined>();

  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    if (element.children === undefined) {
      element.contextValue = "site";
    } else {
      element.contextValue = "folder";
    }
    return element;
  }

  getChildren(
    element?: TreeItem | undefined
  ): vscode.ProviderResult<TreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  public deleteTreeItem(element: TreeItem) {
    delete this.data[this.data.indexOf(element)];
    this.refresh();
  }

  public addTreeItem(site: {
    name: string;
    url: string;
    pinned: boolean;
    path: string;
  }) {
    this.data.push(new TreeItem(site, "site"));
    this.refresh();
  }

  public editTreeItem(previousElement: TreeItem, element: TreeItem) {
    this.data[this.data.indexOf(previousElement)] = element;
    this.refresh();
  }
}

export class TreeItem extends vscode.TreeItem {
  site: { name: string; url: string; pinned: boolean; path: string };
  children: TreeItem[] | undefined;
  constructor(
    site: { name: string; url: string; pinned: boolean; path: string },
    contextValue: string,
    children?: TreeItem[]
  ) {
    super(
      site.name,
      children === undefined
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Expanded
    );
    this.children = children;
    this.contextValue = contextValue;
    this.description = site.url;
    this.command = {
      title: "View site",
      command: "pinnedSites.openSite",
      arguments: [site],
    };
    this.site = site;
  }
}
