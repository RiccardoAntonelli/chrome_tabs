import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class ChromeTreeProvider implements vscode.TreeDataProvider<Dependency> {
    constructor() {}

    onDidChangeTreeData?: vscode.Event<void | Dependency | null | undefined> | undefined;
    getChildren(element?: Dependency): vscode.ProviderResult<Dependency[]> {
        throw new Error('Method not implemented.');
    }

    getTreeItem (element: Dependency): vscode.TreeItem {
        return element;
    }
}

class Dependency extends vscode.TreeItem {
    constructor(
      public readonly label: string,
      public readonly url: string,
      private version: string,
      public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
      super(label, collapsibleState);
      this.tooltip = `${this.label}-${this.version}`;
      this.description = this.version;
    }
}