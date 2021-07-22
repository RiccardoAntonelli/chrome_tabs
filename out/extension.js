'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const ChromeTreeProvider_1 = require("./ChromeTreeProvider");
const LocalStorage_1 = require("./LocalStorage");
function activate(context) {
    //let currentPanel: vscode.WebviewPanel | undefined = undefined;
    var localStorage = new LocalStorage_1.LocalStorageService(context.workspaceState);
    var sites;
    sites = localStorage.getValue("Sites");
    var treeProvider = new ChromeTreeProvider_1.ChromeTreeProvider(sites);
    vscode.window.registerTreeDataProvider('pinnedSites', treeProvider);
    console.log('Congratulations, your extension "chrome-tabs" is now active!');
    context.subscriptions.push(vscode.commands.registerCommand('chrome-tabs.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Chrome Tabs!');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('latestSites.searchSite', () => {
        searchAndOpenSite();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.refresh', () => {
        treeProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.editSite', () => {
        vscode.window.showInformationMessage('Edit Site');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.deleteSite', () => {
        vscode.window.showInformationMessage('Delete Site');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.newSite', () => {
        addNewSite();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.pinSite', () => {
        vscode.window.showInformationMessage('Pin Site');
    }));
    context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.openSite', (site) => {
        openSite(site);
    }));
    const searchAndOpenSite = () => __awaiter(this, void 0, void 0, function* () {
        var url = yield vscode.window.showInputBox({
            prompt: "Search site - ",
            placeHolder: "Site url | (www.sitename.domain)",
            validateInput: text => {
                //return text.includes("www.") ? "" : "Add www.";
                var validation = "";
                text.includes("www.") ? "" : validation = validation.concat("Add www.");
                text.substring(4, text.length).includes(".") ? "" : validation.length === 0 ? validation = validation.concat("Add domain") : validation = validation.concat(" | Add domain");
                return validation;
            }
        });
        if (url === undefined) {
            return;
        }
        url = "http://" + url + "/";
        openSite({ name: "", url: url, pinned: false, path: "" });
    });
    function saveNewSite(name, url, path, pinned) {
        var site = {
            name: name,
            url: url,
            pinned: pinned,
            path: path
        };
        sites.push(site);
        localStorage.saveSites("Sites", sites);
        treeProvider.refresh();
    }
    ;
    const addNewSite = () => __awaiter(this, void 0, void 0, function* () {
        var name = yield vscode.window.showInputBox({ prompt: "New site - ", placeHolder: "Site name" });
        if (name === undefined) {
            return;
        }
        vscode.window.showInformationMessage(name);
        var url = yield vscode.window.showInputBox({
            prompt: "New site - ",
            placeHolder: "Site url | (www.sitename.domain)",
            validateInput: text => {
                //return text.includes("www.") ? "" : "Add www.";
                var validation = "";
                text.includes("www.") ? "" : validation = validation.concat("Add www.");
                text.substring(4, text.length).includes(".") ? "" : validation.length === 0 ? validation = validation.concat("Add domain") : validation = validation.concat(" | Add domain");
                return validation;
            }
        });
        if (url === undefined) {
            return;
        }
        url = "http://" + url + "/";
        saveNewSite(name, url, "", true);
        //TODO: add part of path
        /*var path;
        while (true) {
            var folder = await vscode.window.showInputBox({prompt: "New site - ", placeHolder: "Site path", value: path});
            if (folder === undefined) {return;}
            else {
                
            }
        }*/
    });
    const openSite = (site) => {
        let currentPanel = vscode.window.createWebviewPanel(site.name === "" ? "Search results" : site.name, site.name === "" ? "Search results" : site.name, vscode.ViewColumn.One, {});
        currentPanel.webview.html = getWebViewContent(site.url);
    };
    const getWebViewContent = (url) => {
        return `<!DOCTYPE html>
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
		<iframe src="` + url + `" width="100%" height="100%" ></iframe>
		</body>
		</html>`;
    };
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map