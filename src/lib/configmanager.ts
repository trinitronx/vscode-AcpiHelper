import * as vscode from 'vscode';

class ConfigManager {
    private _configPath: string;
    private _configKey: string[] = [];
    private _configDesc: string[] = [];

    constructor(path: string) {
        this._configPath = path;
    }

    set configPath(path: string) {
        this._configPath = path;
    }

    get configKey(): string[] {
        return [...this._configKey];
    }

    get configDesc(): string[] {
        return [...this._configDesc];
    }

    resetConfig() {
        this._configKey = [];
        this._configDesc = [];
    }

    push(key: string, desc: string) {
        this._configKey.push(key);
        this._configDesc.push(desc);
    }

    loadConfig(output?: vscode.OutputChannel | vscode.LogOutputChannel): Promise<void> | PromiseLike<void> {
        return vscode.workspace.openTextDocument(this._configPath)
            .then((document) => {
                if (output) {
                    output.appendLine('Initial array state - this._configKey:' + this._configKey);
                    output.appendLine('Initial array state - this._configDesc:' + this._configDesc);
                    output.appendLine('Parse Ext ACPI Cfg File!');
                }
                const config = JSON.parse(document.getText());
                this.resetConfig();
                for (const item of config) {
                    if (output) {
                        output.appendLine('Before pushing - this._configKey:' + this._configKey);
                        output.appendLine('Before pushing - this._configDesc:' + this._configDesc);
                    }
                    this.push(item.KeyWord, item.Desc);
                    if (output) {
                        output.appendLine(item.KeyWord);
                        output.appendLine(item.Desc);
                    }
                }
                if (output) {
                    output.appendLine('Final state - this._configKey:' + this._configKey);
                    output.appendLine('Final state - this._configDesc:' + this._configDesc);
                }
            });
    }
}

// Export the class
export { ConfigManager };
