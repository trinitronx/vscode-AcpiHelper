import * as assert from 'assert';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as fs from 'fs';
import * as path from 'path';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import rewire = require("rewire");
let acpihelper = rewire("../../extension");

let mockOutputChannel: sinon.SinonStubbedInstance<vscode.OutputChannel>;
let mockLogOutputChannel: sinon.SinonStubbedInstance<vscode.LogOutputChannel>;

suite('Extension Test Suite', function (this: Mocha.Suite) {
    // TODO: Remove Debug timeout
    // this.timeout(30000);

    let sandbox: sinon.SinonSandbox;
    const extension = vscode.extensions.getExtension('WilliamWu-HJ.acpihelper');

    suiteSetup(() => {
        console.log('Setting up test suite...');
        console.log('Before rewire: Is extension active:', extension?.isActive);

        sandbox = sinon.createSandbox();

        // Create a mock output channel object
        mockOutputChannel = {
            append: sandbox.stub(),
            appendLine: sandbox.stub(),
            clear: sandbox.stub(),
            dispose: sandbox.stub(),
            hide: sandbox.stub(),
            show: sandbox.stub()
        } as sinon.SinonStubbedInstance<vscode.OutputChannel>;

        mockLogOutputChannel = {
            ...mockOutputChannel,
            // Add LogOutputChannel properties
            logLevel: vscode.LogLevel.Info,
            onDidChangeLogLevel: sandbox.stub(),
            trace: sandbox.stub(),
            debug: sandbox.stub(),
            info: sandbox.stub(),
            warn: sandbox.stub(),
            error: sandbox.stub()
        } as sinon.SinonStubbedInstance<vscode.LogOutputChannel>;

        // Stub the createOutputChannel method to return our mocks
        (sandbox.stub(vscode.window, 'createOutputChannel') as unknown as sinon.SinonStub).callsFake((name: string, options?: { log: boolean }) => {
            if (options?.log) {
                return mockLogOutputChannel;
            }
            return mockOutputChannel;
        });

        // Manually stub the 'show' method to handle its overloaded nature

        // This allows you to test both signatures
        //sandbox.stub(mockOutputChannel, 'show').callsFake((column?: vscode.ViewColumn | boolean, preserveFocus?: boolean) => {
        //    // Handle different call signatures based on arguments
        //    if (typeof column === 'boolean') {
        //        // Called with show(preserveFocus: boolean)
        //        console.log('Mock show called with preserveFocus:', column);
        //    } else if (column !== undefined) {
        //        // Called with show(column: ViewColumn, preserveFocus?: boolean)
        //        console.log('Mock show called with column:', column, 'preserveFocus:', preserveFocus);
        //    } else {
        //        // Called with show()
        //        console.log('Mock show called without arguments');
        //    }
        //    // You can add assertions here or store call data for later assertions
        //});

        console.log('After mocking - createOutputChannel identity:', vscode.window.createOutputChannel.prototype);
        console.log('End of suiteSetup(): Is extension active:', extension?.isActive);
    });

    suiteTeardown(() => {
        console.log('Tearing down test suite...');
        mockOutputChannel.dispose();
        mockLogOutputChannel.dispose();
        sandbox.restore();
    });

    setup(function setupHook() {
        // Reset the outputChannel mocks before each test
        mockOutputChannel.appendLine.resetHistory();
        mockLogOutputChannel.appendLine.resetHistory();
    });

    teardown(() => {
        // Clean up after each test
        mockOutputChannel.appendLine.resetHistory();
        mockLogOutputChannel.appendLine.resetHistory();
    });

    // Tests Activation of the extension via ASL file
    // Also retreives the extension instance for use in subsequent tests
    //
    // Side Effect: suite-global extension is set to the extension instance
    test('Extension is loaded', async () => {
        // const allExtensions = vscode.extensions.all;
        // console.log('All loaded extensions:', allExtensions.map(ext => ({
        // 	id: ext.id,
        // 	isActive: ext.isActive
        // })));


        // Activate the extension
        // await extension?.activate();
        // Create a temporary EASL file to trigger activation
        const tempFile = await vscode.workspace.openTextDocument({
            content: '// Test EASL file',
            language: 'EASL'
        });
        await vscode.window.showTextDocument(tempFile);

        // Add a small delay to see if the extension is activated
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // Wait for the extension to be activated
        let attempts = 0;
        const maxAttempts = 20;
        while (!extension?.isActive && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }

        // console.log('Extension:', extension);
        // console.log('Extension ID:', extension?.id);
        // console.log('Extension package:', extension?.packageJSON);
        // console.log('Extension active:', extension?.isActive);

        let configManager = extension?.exports.configManager;

        // Log the initial state of the arrays in the extension
        console.log('Initial extension arrays:', {
            configKey: configManager.configKey,
            configDesc: configManager.configDesc
        });

        const commands = await vscode.commands.getCommands();
        // console.log('Available commands:', commands.find((str, idx) => { str.includes('acpihelper.reloadConfig') ? true : false; }));
        // console.log('Available commands:', commands);
        // Activate the extension by executing one of its commands
        await vscode.commands.executeCommand('acpihelper.Help');
        console.log('acpihelper commands:', commands.filter(name => name.startsWith("acpi")));
        assert.ok(commands.includes('acpihelper.reloadConfig'), 'Extension reloadConfig command should be available');
        assert.ok(commands.includes('acpihelper.Help'), 'Extension HelpInfo command should be available');
    });

    test('Config path explicitly disabled', async () => {
        console.log('Running test: Config path explicitly disabled');
        try {
            // TODO: Remove this
            // Add debug logging for mock state
            // console.log('Mock state before reload:', {
            // 	appendLineCalled: mockOutputChannel.appendLine.called,
            // 	appendLineCalls: mockOutputChannel.appendLine.getCalls().map(call => call.args)
            // });

            // Set config to disabled state
            // (Triggers automatic config reload)
            await vscode.workspace.getConfiguration('acpihelper').update('configPath', '', true);
            await vscode.workspace.getConfiguration('acpihelper').update('includeUserConfig', true, true);

            await vscode.commands.executeCommand('workbench.panel.output.focus');

            // Add a small delay to allow output to be captured
            // await new Promise(resolve => setTimeout(resolve, 30000));
            // await new Promise(resolve => setTimeout(resolve, 1000));

            // Verify output messages
            assert.ok(mockOutputChannel.appendLine.called, 'appendLine should have been called');
            ['Config path disabled.',
                'Only standard keywords in ACPI specification will be shown.'].forEach(
                expectedMessage => {
                    assert.ok(mockOutputChannel.appendLine.calledWith(expectedMessage),
                        `Expected '${expectedMessage}' message, got calls: ${JSON.stringify(mockOutputChannel.appendLine.getCalls().map(call => call.args))}`);
                }
            );

        } catch (error) {
            console.error('Test failed:', error);
            throw error;
        }
    });

    test('User-defined config path', async () => {
        assert.ok(extension, 'Extension should be found');
        console.log('Beginning of test(\'User-defined config path\'): Is extension active:', extension?.isActive);
        assert.ok(extension.isActive, 'Extension should be active');

        console.log("Extension exports: ", extension.exports);
        const configManager = extension.exports.configManager;
        assert.ok(configManager, 'configManager should be exported');
        console.log('configManager instance:', configManager);
        console.log('configManager constructor:', configManager.constructor.name);


        console.log('extension.exports configManager instance:', configManager);

        // Now we can use this instance for our tests
        console.log('Before config reload:', {
            configManager
        });

        // Get path to test fixture
        const testConfigPath = path.join(__dirname, '../../test/fixtures/AcpiCfg-test.json');
        const expectedConfig = JSON.parse(fs.readFileSync(testConfigPath).toString());

        // TODO: Remove this
        // Add debug logging for mock state before settings reload
        console.log('Mock state before user-defined config reload:', {
            appendLineCalled: mockOutputChannel.appendLine.called,
            appendLineCalls: mockOutputChannel.appendLine.getCalls().map(call => call.args)
        });

        // Create a promise that resolves when the "Finished loading config!" message is logged
        const configLoadedPromise = new Promise<void>((resolve) => {
            const checkForMessage = () => {
                // Check for only the most recent calls
                const recentCalls = mockOutputChannel.appendLine.getCalls().slice(-3);
                if (recentCalls.some(call => call.args[0] === 'Finished loading config!')) {
                    resolve();
                } else {
                    setTimeout(checkForMessage, 100);
                }
            };
            checkForMessage();
        });

        // Set config to use test fixture
        // (Triggers automatic config reload)
        await vscode.workspace.getConfiguration('acpihelper').update('configPath', testConfigPath, true);
        await vscode.workspace.getConfiguration('acpihelper').update('includeUserConfig', true, true);

        // Wait for the config to finish loading, and for result arrays to be populated
        await configLoadedPromise;

        // Add debug logging for mock state after settings reload
        console.log('Mock state after user-defined config reload:', {
            appendLineCalled: mockOutputChannel.appendLine.called,
            appendLineCalls: mockOutputChannel.appendLine.getCalls().map(call => call.args)
        });

        console.log('configManager Arrays after config load:', {
            configKey: configManager.configKey,
            configDesc: configManager.configDesc
        });

        // Verify output messages
        [sinon.match((arg: string) => arg.startsWith('User-defined config path')),
            'Extra user-defined keywords and those in the ACPI specification will be shown.'].forEach(
            expectedMessage => {
                assert.ok(mockOutputChannel.appendLine.calledWith(expectedMessage),
                    `Expected '${expectedMessage}' message, got calls: ${JSON.stringify(mockOutputChannel.appendLine.getCalls().map(call => call.args))}`);
            }
        );


        // Verify arrays contain unique test fixture data
        assert.strictEqual(configManager.configDesc.length, 6);
        assert.strictEqual(configManager.configKey[0], 'CUST');
        assert.strictEqual(configManager.configDesc[0], 'CUSTOM Keyword Test');

        // Verify that test arrays contain the entire expected values
        // TODO

    });

    test('Default config path', async () => {
        // Set config to use default path
        await vscode.workspace.getConfiguration('acpihelper').update('configPath', '', true);
        await vscode.workspace.getConfiguration('acpihelper').update('includeUserConfig', false, true);

        // Verify output messages
        [sinon.match((arg: string) => arg.startsWith('Default extension-provided config path')),
            'Extra keywords defined by this extension and those in the ACPI specification will be shown.'].forEach(
            expectedMessage => {
                assert.ok(mockOutputChannel.appendLine.calledWith(expectedMessage),
                    `Expected '${expectedMessage}' message, got calls: ${JSON.stringify(mockOutputChannel.appendLine.getCalls().map(call => call.args))}`);
            }
        );

        // Gather results
        // Verify arrays contain default config data
        // TODO
    });
});