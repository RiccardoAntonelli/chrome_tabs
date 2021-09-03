"use strict";
import { log } from "console";
import * as vscode from "vscode";
import { Site } from "./extension";

export class ChromeTreeProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  constructor(
    elements: Site[]
  ) {
    let elementsDone: Site[] = [];
    this.data = [];
    elements.forEach(
      (element: Site) => {
      }
    );
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

  public addTreeItem(site: Site) {
    this.data.push(new TreeItem(site, "site"));
    this.refresh();
  }

  public editTreeItem(previousElement: TreeItem, element: TreeItem) {
    this.data[this.data.indexOf(previousElement)] = element;
    this.refresh();
  }
}

export class TreeItem extends vscode.TreeItem {
  site: Site;
  children: TreeItem[] | undefined;
  constructor(
    site: Site,
    contextValue: string,
    children?: TreeItem[] | undefined
  ) {
    super(
      site.name,
      children === undefined
        ? vscode.TreeItemCollapsibleState.None
        : vscode.TreeItemCollapsibleState.Expanded
    );
    if (this.children === undefined) {
      if (children !== undefined) {
        this.children = children;
      } else {
        this.children = undefined;
      }
    } else if (children !== undefined) {
      this.children = children;
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
