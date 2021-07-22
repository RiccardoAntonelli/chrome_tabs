'use strict';
import * as vscode from 'vscode';
import { ChromeTreeProvider } from './ChromeTreeProvider';
import { LocalStorageService } from './LocalStorage';

export function activate(context: vscode.ExtensionContext) {
	//let currentPanel: vscode.WebviewPanel | undefined = undefined;
	var localStorage = new LocalStorageService(context.workspaceState);

	var sites: Array<{ name: string, url: string, pinned: boolean, path: string }>;
	sites = localStorage.getValue("Sites");

	var treeProvider = new ChromeTreeProvider(sites);

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

	context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.openSite', (site: any) => {
		openSite(site);
	}));


	const searchAndOpenSite = async (): Promise<void> => {
		var url = await vscode.window.showInputBox({
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
		if (url === undefined) { return; }
		url = "http://" + url + "/";
		openSite({ name: "", url: url, pinned: false, path: "" });
	};

	function saveNewSite(name: string, url: string, path: string, pinned: boolean) {
		var site = {
			name: name,
			url: url,
			pinned: pinned,
			path: path
		};
		sites.push(site);
		localStorage.saveSites("Sites", sites);
		treeProvider.refresh();
	};

	const addNewSite = async (): Promise<any> => {
		var name = await vscode.window.showInputBox({ prompt: "New site - ", placeHolder: "Site name" });
		if (name === undefined) { return; }
		vscode.window.showInformationMessage(name);
		var url = await vscode.window.showInputBox({
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
		if (url === undefined) { return; }
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
	};

	const openSite = (site: { name: string, url: string, pinned: boolean, path: string }) => {
		let currentPanel = vscode.window.createWebviewPanel(
			site.name === "" ? "Search results" : site.name,
			site.name === "" ? "Search results" : site.name,
			vscode.ViewColumn.One,
			{}
		);
		currentPanel.webview.html = getWebViewContent(site.url);
	};

	const getWebViewContent = (url: string) => {
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

export function deactivate() { }