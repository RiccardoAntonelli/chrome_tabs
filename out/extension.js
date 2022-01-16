"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const tslib_1 = require("tslib");
const vscode = require("vscode");
const tree_provider_1 = require("./tree_provider");
const local_storage_1 = require("./local_storage");
const site_1 = require("./site");
function activate(context) {
    var localStorage = new local_storage_1.LocalStorageService(context.workspaceState);
    var treeItems;
    treeItems = localStorage.getSites();
    var treeProvider = new tree_provider_1.ChromeTreeProvider(localStorage);
    vscode.window.registerTreeDataProvider("pinnedSites", treeProvider);
    context.subscriptions.push(vscode.commands.registerCommand("pinnedSites.searchSite", () => {
        searchAndOpenSite();
    }));
    context.subscriptions.push(vscode.commands.registerCommand("pinnedSites.refresh", () => {
        treeProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand("pinnedSites.editSite", (node) => {
        const previousElement = node;
        editSite(node, previousElement);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("pinnedSites.deleteSite", (node) => {
        treeProvider.deleteTreeItem(node);
        let deleteIndex = -1;
        for (let i = 0; i < treeItems.length; i++) {
            if (treeItems[i].equals(node)) {
                deleteIndex = i;
                break;
            }
        }
        treeItems.splice(deleteIndex, 1);
        localStorage.saveSites(treeItems);
    }));
    context.subscriptions.push(vscode.commands.registerCommand("pinnedSites.newSite", () => {
        addNewSite();
    }));
    context.subscriptions.push(vscode.commands.registerCommand("pinnedSites.openSite", (item) => {
        openSite(item);
    }));
    const searchAndOpenSite = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        var url = yield vscode.window.showInputBox({
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
        url = "https://" + url + "/";
        openSite(new site_1.TreeItem("", url, false));
    });
    function saveNewSite(name, url, pinned) {
        var site = new site_1.TreeItem(name, url, pinned);
        treeItems.push(site);
        localStorage.saveSites(treeItems);
        treeProvider.addTreeItem(new site_1.TreeItem(name, url, pinned));
    }
    const editSite = (element, previousElement) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let options = ["Rename", "Change url"];
        let result = yield vscode.window.showQuickPick(options);
        switch (result) {
            case "Rename":
                let resultName = yield vscode.window.showInputBox({
                    prompt: "Rename site - ",
                    placeHolder: "Site name",
                    validateInput: (text) => {
                        let validation = "";
                        if (text === undefined || text.length === 0) {
                            validation = "Insert a valid name";
                        }
                        else {
                            for (let treeItem of treeItems) {
                                if (treeItem.name === text) {
                                    validation = "This name already exists";
                                }
                            }
                        }
                        return validation;
                    },
                });
                resultName !== undefined
                    ? ((element.label = resultName), element.set(resultName))
                    : null;
                break;
            case "Change url":
                let resultUrl = yield vscode.window.showInputBox({
                    prompt: "Rename site - ",
                    placeHolder: "Site url | (www.sitename.domain)",
                    validateInput: (text) => {
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
                    element.set(undefined, resultUrl);
                }
                break;
        }
        let editIndex = -1;
        for (let i = 0; i < treeItems.length; i++) {
            if (treeItems[i].get("name") === previousElement.get("name") &&
                treeItems[i].get("url") === previousElement.get("url") &&
                treeItems[i].get("pinned") === previousElement.get("pinned")) {
                editIndex = i;
                break;
            }
        }
        treeItems[editIndex] = element;
        console.log("Edit Site: " + element);
        treeProvider.editTreeItem(previousElement, element);
        localStorage.saveSites(treeItems);
    });
    const addNewSite = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        let name = yield vscode.window.showInputBox({
            prompt: "New site - ",
            placeHolder: "Site name",
            validateInput: (text) => {
                let validation = "";
                if (text === undefined || text.length === 0) {
                    validation = "Insert a valid name";
                }
                else {
                    for (let treeItem of treeItems) {
                        if (treeItem.name === text) {
                            validation = "This name already exists";
                        }
                    }
                }
                return validation;
            },
        });
        if (name === undefined) {
            return;
        }
        vscode.window.showInformationMessage(name);
        let url = yield vscode.window.showInputBox({
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
        saveNewSite(name, url, true);
    });
    const openSite = (site) => {
        if (site.get("url") === "" || site.get("url") === undefined) {
        }
        else {
            let currentPanel = vscode.window.createWebviewPanel(site.get("name") === "" ? "Search results" : site.get("name"), site.get("name") === "" ? "Search results" : site.get("name"), vscode.ViewColumn.One, {});
            currentPanel.webview.html = getWebViewContent(site.get("url"));
        }
    };
    const getWebViewContent = (url) => {
        return (`<!DOCTYPE html>
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
		</html>`);
    };
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map