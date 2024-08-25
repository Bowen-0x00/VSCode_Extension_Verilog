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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const child_process_1 = require("child_process");
const path = require("path");
// Function to run the Python script and copy output to clipboard
function runPythonScript(scriptPath, filePath) {
    return new Promise((resolve, reject) => {
        let command = `python ${scriptPath} ${filePath}`;
        (0, child_process_1.exec)(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                vscode.window.showErrorMessage('Error generating instance.');
                reject(error.message);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                vscode.window.showErrorMessage('Error generating instance.');
                reject(stderr);
                return;
            }
            resolve(stdout);
        });
    });
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "verilog-testbench-instance" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.instance', () => {
        // The code can get the document name and then it activates python code to generate instance
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'instance' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}\\vInstance_Gen.py ${editor.document.fileName}`);
        // Display a message box to the user
        vscode.window.showInformationMessage('Generate instance successfully!');
    });
    context.subscriptions.push(disposable);
    let instance_clipboard = vscode.commands.registerCommand('extension.instance_clipboard', () => __awaiter(this, void 0, void 0, function* () {
        // The code can get the document name and then it activates python code to generate instance
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let scriptPath = path.join(__dirname, 'vInstance_Gen.py');
        let filePath = editor.document.fileName;
        let result = yield runPythonScript(scriptPath, filePath);
        vscode.env.clipboard.writeText(result).then(() => {
            vscode.window.showInformationMessage('Instance copied to clipboard successfully!');
        });
        // Display a message box to the user
        vscode.window.showInformationMessage('Generate instance successfully!');
    }));
    context.subscriptions.push(instance_clipboard);
    let testbench = vscode.commands.registerCommand('extension.testbench', () => {
        // The code can get the document name and then it activates python code to generate testbench
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let ter1 = vscode.window.createTerminal({ name: 'testbench' });
        ter1.show(true);
        ter1.sendText(`python ${__dirname}\\vTbgenerator.py ${editor.document.fileName}`);
        // Display a message box to the user
        vscode.window.showInformationMessage('Generate testbench successfully!');
    });
    context.subscriptions.push(testbench);
    let testbench_clipboard = vscode.commands.registerCommand('extension.testbench_clipboard', () => __awaiter(this, void 0, void 0, function* () {
        // The code can get the document name and then it activates python code to generate testbench
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let scriptPath = path.join(__dirname, 'vTbgenerator.py');
        let filePath = editor.document.fileName;
        let result = yield runPythonScript(scriptPath, filePath);
        vscode.env.clipboard.writeText(result).then(() => {
            vscode.window.showInformationMessage('Instance copied to clipboard successfully!');
        });
        // Display a message box to the user
        vscode.window.showInformationMessage('Generate testbench successfully!');
    }));
    context.subscriptions.push(testbench_clipboard);
    let select_and_instance_clipboard = vscode.commands.registerCommand('extension.select_and_instance_clipboard', () => __awaiter(this, void 0, void 0, function* () {
        const options = {
            canSelectMany: false,
            openLabel: 'Select',
            filters: {
                'Verilog Files': ['v', 'sv']
            }
        };
        let fileUri = yield vscode.window.showOpenDialog(options);
        if (fileUri && fileUri[0]) {
            let scriptPath = path.join(__dirname, 'vInstance_Gen.py');
            let filePath = fileUri[0].fsPath;
            let result = yield runPythonScript(scriptPath, filePath);
            let editor = vscode.window.activeTextEditor;
            if (editor) {
                editor.edit(editBuilder => {
                    editBuilder.insert(editor.selection.active, result);
                }).then(() => {
                    vscode.window.showInformationMessage('Instance inserted successfully!');
                });
            }
        }
    }));
    context.subscriptions.push(select_and_instance_clipboard);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map