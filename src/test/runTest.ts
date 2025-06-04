import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../');

		// The path to test runner
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		console.log('Starting tests...');
		console.log('Extension path:', extensionDevelopmentPath);
		console.log('Test path:', extensionTestsPath);

		// Download VS Code, unzip it and run the integration test
		await runTests({
			extensionDevelopmentPath, extensionTestsPath,
			// launchArgs: ['--disable-extensions'],
			// launchArgs: ['--enable-proposed-api nativeWindowHandle'],
			// extensionTestsEnv: {
			// 	VSCODE_DEBUG_MODE: 'true',
			// 	VSCODE_EXTENSION_TESTS: 'true'
			// }
		 });
	} catch (err) {
		console.error('Failed to run tests');
		console.error('Test run failed with error:', err);
		process.exit(1);
	}
}

main();
