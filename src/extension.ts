"use strict";
import * as vscode from "vscode";
import { ChromeTreeProvider } from "./ChromeTreeProvider";
import { LocalStorageService } from "./LocalStorage";
import { TreeItem } from "./ChromeTreeProvider";
import { log } from "console";

export function activate(context: vscode.ExtensionContext) {
  //let currentPanel: vscode.WebviewPanel | undefined = undefined;
  var localStorage = new LocalStorageService(context.workspaceState);

  var sites: Array<{
    name: string;
    url: string;
    pinned: boolean;
    path: string;
  }>;
  sites = localStorage.getValue("Sites");

  var treeProvider = new ChromeTreeProvider(sites);

  vscode.window.registerTreeDataProvider("pinnedSites", treeProvider);

  console.log('Congratulations, your extension "chrome-tabs" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand("chrome-tabs.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World from Chrome Tabs!");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("latestSites.searchSite", () => {
      searchAndOpenSite();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pinnedSites.refresh", () => {
      treeProvider.refresh();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "pinnedSites.editSite",
      (node: TreeItem) => {
        const previousSite = node.site;
        const previousElement = node;
        let element = editSite(node, previousElement);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "pinnedSites.deleteSite",
      (node: TreeItem) => {
        treeProvider.deleteTreeItem(node);
        let deletedSite: {
          name: string;
          url: string;
          pinned: boolean;
          path: string;
        } = {
          name: node.site.name,
          url: node.site.url,
          pinned: node.site.pinned,
          path: node.site.path,
        };
        let deleteIndex = -1;
        for (let i = 0; i < sites.length; i++) {
          if (
            sites[i].name === deletedSite.name &&
            sites[i].url === deletedSite.url &&
            sites[i].pinned === deletedSite.pinned &&
            sites[i].path === deletedSite.path
          ) {
            deleteIndex = i;
            break;
          }
        }
        delete sites[deleteIndex];
        console.log("Deleted site: " + deletedSite);
        localStorage.saveSites("Sites", sites);
        //vscode.window.showInformationMessage("Delete Site");
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pinnedSites.newSite", () => {
      addNewSite();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pinnedSites.pinSite", () => {
      vscode.window.showInformationMessage("Pin Site");
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("pinnedSites.openSite", (item: any) => {
      openSite(item);
    })
  );

  const searchAndOpenSite = async (): Promise<void> => {
    var url = await vscode.window.showInputBox({
      prompt: "Search site - ",
      placeHolder: "Site url | (www.sitename.domain)",
      validateInput: (text) => {
        //return text.includes("www.") ? "" : "Add www.";
        var validation = "";
        text.includes("www.")
          ? ""
          : (validation = validation.concat("Add www."));
        text.substring(4, text.length).includes(".")
          ? ""
          : validation.length === 0
          ? (validation = validation.concat("Add domain"))
          : (validation = validation.concat(" | Add domain"));
        return validation;
      },
    });
    if (url === undefined) {
      return;
    }
    url = "http://" + url + "/";
    openSite({ name: "", url: url, pinned: false, path: "" });
  };

  function saveNewSite(
    name: string,
    url: string,
    path: string,
    pinned: boolean
  ) {
    var site = {
      name: name,
      url: url,
      pinned: pinned,
      path: path,
    };
    sites.push(site);
    localStorage.saveSites("Sites", sites);
    treeProvider.refresh();
  }

  const editSite = async (element: TreeItem, previousElement: TreeItem) => {
    let options = ["Rename", "Change url", "Change path - TODO"];
    let result = await vscode.window.showQuickPick(options);
    switch (result) {
      case "Rename":
        let resultName = await vscode.window.showInputBox({
          prompt: "Rename site - ",
          placeHolder: "Site name",
        });
        resultName !== undefined
          ? ((element.label = resultName), (element.site.name = resultName))
          : null;
        break;
      case "Change url":
        let resultUrl = await vscode.window.showInputBox({
          prompt: "Rename site - ",
          placeHolder: "Site url | (www.sitename.domain)",
          validateInput: (text) => {
            //return text.includes("www.") ? "" : "Add www.";
            var validation = "";
            text.includes("www.")
              ? ""
              : (validation = validation.concat("Add www."));
            text.substring(4, text.length).includes(".")
              ? ""
              : validation.length === 0
              ? (validation = validation.concat("Add domain"))
              : (validation = validation.concat(" | Add domain"));
            return validation;
          },
        });
        if (resultUrl !== undefined) {
          resultUrl = "https://" + resultUrl + "/";
          element.description = resultUrl;
          element.site.url = resultUrl;
        }
        break;
      case "Change path - TODO":
        let path: string = element.site.path;
        let resultPath = await vscode.window.showInputBox({
          prompt: "Edit path - ",
          placeHolder: "Site path",
          value: path,
          validateInput: (text) => {
            //return text.includes("www.") ? "" : "Add www.";
            let validation = "";
            text.endsWith("/")
              ? (validation = "Can't end with '/'")
              : (validation = "");
            return validation;
          },
        });
        if (resultPath !== undefined) {
          element.site.path = resultPath;
        }
        break;
    }
    /*do {
          isSelecting = true;
          options = getPathPickerOptions(path);
          log(options);
          let value = path;
          const quickPick = vscode.window.createQuickPick();
          quickPick.value = path;
          quickPick.placeholder = "Enter site path";
          quickPick.title = "Select site path";
          quickPick.buttons = [vscode.QuickInputButtons.Back];
          quickPick.items = options.map((label) => ({ label }));
          quickPick.onDidChangeSelection(([{ label }]) => {
            //log(value.substring(0, value.length - 1));
            //log(path);
            if (
              label !== undefined &&
              label !== path &&
              label.split("/")[label.split("/").length - 1] !== "type a folder"
            ) {
              log(isLast);
              log(isBreak);
              value = label + "/";
              quickPick.value = value;
              if (
                value.substring(0, value.length - 1) === path &&
                isLast === false
              ) {
                log("a");
                value = value.substring(0, value.length - 1);
                isLast = true;
              } else if (
                value.substring(0, value.length - 1) === path &&
                isLast
              ) {
                log("b");
                value = value.substring(0, value.length - 1);
                isBreak = true;
                isLast = false;
              } else {
                log("c");
                isLast = false;
                path = value;
                isBreak = false;
              }
              isSelecting = false;
              quickPick.hide();
              log(path);
            }
          });
          quickPick.onDidChangeValue((changedValue: string) => {
            value = changedValue;
            options = getPathPickerOptions(changedValue);
            options[0] = value;
            quickPick.items = options.map((label) => ({ label }));
          });
          quickPick.onDidHide(() => {
            isSelecting = false;
            quickPick.dispose();
          });
          quickPick.show();
          log("restart");
        } while (!isBreak && !isSelecting);
        element.site.path = path;
        break;
    }*/
    let editIndex = -1;
    for (let i = 0; i < sites.length; i++) {
      if (
        sites[i].name === previousElement.site.name &&
        sites[i].url === previousElement.site.url &&
        sites[i].pinned === previousElement.site.pinned &&
        sites[i].path === previousElement.site.path
      ) {
        editIndex = i;
        break;
      }
    }
    sites[editIndex] = element.site;
    console.log("Edit Site: " + element.site);
    treeProvider.editTreeItem(previousElement, element);
    localStorage.saveSites("Sites", sites);
  };

  const getPathPickerOptions = (path: string): string[] => {
    let folders: string[] = path.split("/");
    let options: string[] = [];
    if (path !== "") {
      sites.forEach((site) => {
        let siteFolders: string[] = site.path.split("/");
        let i: number = 0;

        log(folders);
        log(siteFolders);

        for (let index = 0; index < folders.length; index++) {
          let equal = true;
          if (
            index === folders.length - 1 &&
            folders[index] === siteFolders[index] &&
            equal
          ) {
            if (siteFolders[index + 1] !== undefined) {
              options.push(siteFolders[index + 1]);
            }
          } else if (folders[index] === siteFolders[index] && equal) {
          } else {
            equal = false;
          }
        }
      });
    }
    options.push("type a folder");
    return options;
  };

  const addNewSite = async (): Promise<any> => {
    let name = await vscode.window.showInputBox({
      prompt: "New site - ",
      placeHolder: "Site name",
    });
    if (name === undefined) {
      return;
    }
    vscode.window.showInformationMessage(name);
    let url = await vscode.window.showInputBox({
      prompt: "New site - ",
      placeHolder: "Site url | (www.sitename.domain)",
      validateInput: (text) => {
        //return text.includes("www.") ? "" : "Add www.";
        let validation = "";
        text.includes("www.")
          ? ""
          : (validation = validation.concat("Add www."));
        text.substring(4, text.length).includes(".")
          ? ""
          : validation.length === 0
          ? (validation = validation.concat("Add domain"))
          : (validation = validation.concat(" | Add domain"));
        return validation;
      },
    });
    if (url === undefined) {
      return;
    }
    url = "https://" + url + "/";
    let path = await vscode.window.showInputBox({
      prompt: "Edit path - ",
      placeHolder: "Site path",
      validateInput: (text) => {
        //return text.includes("www.") ? "" : "Add www.";
        let validation = "";
        text.endsWith("/")
          ? (validation = "Can't end with '/'")
          : (validation = "");
        return validation;
      },
    });
    if (path === undefined) {
      return;
    }
    /*var path;
		while (true) {
			var folder = await vscode.window.showInputBox({prompt: "New site - ", placeHolder: "Site path", value: path});
			if (folder === undefined) {return;}
			else {
				
			}
		}*/
    saveNewSite(name, url, path, true);
    treeProvider.addTreeItem({
      name: name,
      url: url,
      pinned: true,
      path: path,
    });
  };

  const openSite = (site: {
    name: string;
    url: string;
    pinned: boolean;
    path: string;
  }) => {
    if (site.url === "" || site.url === undefined) {
    } else {
      let currentPanel = vscode.window.createWebviewPanel(
        site.name === "" ? "Search results" : site.name,
        site.name === "" ? "Search results" : site.name,
        vscode.ViewColumn.One,
        {}
      );
      currentPanel.webview.html = getWebViewContent(site.url);
    }
  };

  const getWebViewContent = (url: string) => {
    return (
      `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title></title>
			<style>
				body, html
				  {
					margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #fff;
				  }
			  </style>
		</head>
		<body>    
		<iframe src="` +
      url +
      `" width="100%" height="100%" ></iframe>
		</body>
		</html>`
    );
  };
}

export function deactivate() {}
