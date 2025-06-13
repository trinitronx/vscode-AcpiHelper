# ACPeye

Instant ACPI/ASL documentation tooltips. Hover over any ACPI keyword to see descriptions.

Provides ACPI ASL/AML language help info in the form of hover tooltips, and a command to display help info for the extension.
Mouse hover will triger the hints.

This extension is useful for developers working with ACPI code, such as DSDT/SSDT tables, and UEFI/BIOS development.

Descriptions for ACPI predefine names (methods and PNPID) based on [ACPI Spec version 6.4][1] are provided, and the language definiation is based on CPP.

![demo](https://raw.githubusercontent.com/trinitronx/vscode-AcpiHelper/refs/heads/master/Demo.png)

## Features

- Hover over any ACPI ASL/AML keyword to see its definition
- Command to display help info for this extension.
- Configurable to include user-provided ACPI keyword definitions.
- Command to reload the user-provided config file.

## Usage

- Hover over any ACPI keyword in your code to see the documentation.
- Use the command palette to run `ACPeye: Help` to display help for this extension.
- Use the command pallete to run `ACPeye: Reload Config` to reload the user-provided config file.

## Configuration

- You can include user-provided ACPI keyword definitions by setting `acpeye.includeUserConfig` to true and specifying the path to your JSON config file in `acpeye.configPath`.
- A default config file (`AcpiCfg.json`) is included with the extension, which can be used as a starting point for your own configurations.

### Configuration Properties

The extension can be configured through VS Code settings:

| Property                       | Type      | Default | Description | Notes |
|--------------------------------|-----------|---------|-------------|-------|
| `acpihelper.configPath`        | `string`  | `""`    | Path to a custom JSON configuration file containing additional ACPI keywords and descriptions. If empty, only the built-in ACPI specification keywords will be used. | Format of the file is a JSON list of Object Literals, each having "`KeyWord`" and "`Desc`" keys and values. |
| `acpihelper.includeUserConfig` | `boolean` | `false` | When enabled, the extension will load keywords and descriptions from the custom configuration file specified in `configPath`. When disabled, only the built-in ACPI specification keywords will be shown. | The default is to use the example `AcpiCfg.json` config included with this extension. Set `includeUserConfig` to `true` (checked) and set `configPath` to an empty string `""` (no text) to disable the default config and only use the standard ACPI specification keywords. |

#### Configuration File Format

The custom configuration file should be a JSON array of Object Literals, where each object has the following structure:

```json
[
  {
    "KeyWord": "YOUR_KEYWORD",
    "Desc": "Description of the keyword"
  },
  {
    "KeyWord": "ANOTHER_KEYWORD",
    "Desc": "Another description"
  }
]
```

#### Example Configuration

```json
{
  "acpihelper.configPath": "/path/to/your/acpi-config.json",
  "acpihelper.includeUserConfig": true
}
```

## Known Issues

- The extension currently only supports the keywords defined in [ACPI Spec version 6.4][1]

## Release Notes

### 1.0.0

- Initial re-release of ACPeye (fork of `williamwu-hj.AcpiHelper`) with renovated user-config support, updated dependencies, and added integration tests.
- Currently, the auto-complete is not implemented yet.

## Contributing

Please read our contributing guide if you'd like to help improve ACPeye.

## Contributors

- William Wu (@FirstWilliam)
- James Cuzella (@trinitronx)

## License

This extension is licensed under the MIT License.

[1]: https://uefi.org/specs/ACPI/6.4/
