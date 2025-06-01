This extension is used to provide description to ACPI predefine names (methods and PNPID). Mouse hover will triger the hints.
![demo](https://dev.azure.com/WilliamSuper/87a3c72c-732f-4c9e-96bf-a02f700f8615/_apis/git/repositories/bbe36879-d9cc-43e1-b8b9-87c624d2e566/items?path=%2FDemo.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=master&resolveLfs=true&%24format=octetStream&api-version=5.0)

This is based on ACPI Spec version 6.4, https://uefi.org/specs/ACPI/6.4/, and the language definiation is based on CPP.

## Configuration Properties

The extension can be configured through VS Code settings:

| Property                       | Type      | Default | Description | Notes |
|--------------------------------|-----------|---------|-------------|-------|
| `acpihelper.configPath`        | `string`  | `""`    | Path to a custom JSON configuration file containing additional ACPI keywords and descriptions. If empty, only the built-in ACPI specification keywords will be used. | Format of the file is a JSON list of Object Literals, each having "`KeyWord`" and "`Desc`" keys and values. |
| `acpihelper.includeUserConfig` | `boolean` | `false` | When enabled, the extension will load keywords and descriptions from the custom configuration file specified in `configPath`. When disabled, only the built-in ACPI specification keywords will be shown. | The default is to use the example `AcpiCfg.json` config included with this extension. Set `includeUserConfig` to `true` (checked) and set `configPath` to an empty string `""` (no text) to disable the default config and only use the standard ACPI specification keywords. |

### Configuration File Format

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

### Example Configuration

```json
{
  "acpihelper.configPath": "/path/to/your/acpi-config.json",
  "acpihelper.includeUserConfig": true
}
```

currently, the auto-complete is not implemented yet.

William Wu

