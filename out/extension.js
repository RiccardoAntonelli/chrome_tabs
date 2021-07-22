"use strict";
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
function activate(context) {
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
    function saveNewSite(name, url, folder) {
    }
    const addNewSite = () => __awaiter(this, void 0, void 0, function* () {
        var name = yield vscode.window.showInputBox({ prompt: "New site", placeHolder: "Site name" });
        if (name === undefined) {
            return;
        }
        vscode.window.showInformationMessage(name);
        var url = yield vscode.window.showInputBox({ prompt: "New site", placeHolder: "Site url" });
        if (url === undefined) {
            return;
        }
        var folder;
        var path;
        while (folder !== undefined) {
            folder = yield vscode.window.showInputBox({ prompt: "New site", placeHolder: "Site path", value: path });
        }
    });
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map