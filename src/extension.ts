import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let sites = [];

	console.log('Congratulations, your extension "chrome-tabs" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('chrome-tabs.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Chrome Tabs!');

	}));

	context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.newSite', () => {
		vscode.window.showInformationMessage('Hello World from Chrome Tabs!');
		addNewSite();
		}));

	context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.editSite', () => {
		vscode.window.showInformationMessage('Edit Site');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('pinnedSites.pinSite', () => {
		vscode.window.showInformationMessage('Pin Site');
	}));

	function saveNewSite (name: string, url: string, folder: string) {

	}

	const addNewSite = async ():Promise<any> => {
		var name = await vscode.window.showInputBox({prompt: "New site", placeHolder: "Site name"});
		if (name === undefined) {return;}
		vscode.window.showInformationMessage(name);
		var url = await vscode.window.showInputBox({prompt: "New site", placeHolder: "Site url"});
		if (url === undefined) {return;}
		var folder;
		var path;
		while (folder !== undefined) {
			folder = await vscode.window.showInputBox({prompt: "New site", placeHolder: "Site path", value: path});
		}
	};
}

export function deactivate() {}
