# open-in-editor (Sourcegraph extension)

Adds a button to the Sourcegraph's extension panel and at the top of files in code hosts like GitHub (when the Sourcegraph browser extension is installed) that will open the current file in your editor of choice.

## Settings

**This extension requires all git repos to be already cloned under the base path with their original names.**

- Add `openineditor.editor` to your user settings to open files in the editor. Copy one of the following lines depending on the editor you would like to use. This extension only supports opening in one editor at a time. Supported editors:
  - `vscode` (Visual Studio Code): `"openineditor.editor": "vscode"`
  - `idea` (JetBrains IntelliJ IDEA): `"openineditor.editor": "idea"`
  - `sublime` (Sublime Text, requires a URL handler installed such as [this one for macOS](https://github.com/inopinatus/sublime_url))
  - `custom` (requires also setting `openineditor.customUrlPattern`): `"openineditor.editor": "custom"`
- `openineditor.basePath`: The absolute path on your computer where your git repositories live. This extension requires all git repos to be already cloned under this path with their original names. `"/Users/yourusername/src"` is a valid absolute path, while `"~/src"` is not.
- `openineditor.customUrlPattern`: If you set `openineditor.editor` to `custom`, this must be set. Use placeholders `%file`, `%line`, and `%col` to mark where the file path, line number, and column number must be replaced. Example URL for IntelliJ IDEA: `idea://open?file=%file&line=%line&column=%col`

## Examples

### IntelliJ IDEA on Mac

To open repository files in your Documents directory:

```json
{
  "extensions": {
    "sourcegraph/open-in-editor": true,
  },
  "openineditor.editor" : "idea",
  "openineditor.basePath": "/Users/USERNAME/Documents/"
}
```

### IntelliJ IDEA on Windows

The `idea://` protocol handler is currently not supported on Windows. As a workaround, Windows user can use the Intellij's built-in REST API to open files directly from a URL with extra configuration steps.

1. In the Intellij's Settings panel, go to `Build, Execution, Deployment`

1. Click on the `Debugger` tab and mark the box next to `Allow unsigned requests` as checked. This allows requests to be made to the built-in server from outside IntelliJ IDEA as stated in their [docs](https://www.jetbrains.com/help/idea/php-built-in-web-server.html#configuring-built-in-web-server)

1. Add the following settings to your User Settings on Sourcegraph to open repository files in your user's IdeaProjects directory. **Intellij IDEA must be remained open for this workaround to work.**

```json
{
  "extensions": {
    "sourcegraph/open-in-editor": true,
  },
  "openineditor.editor" : "custom",
  "openineditor.basePath": "/C:/Users/USERNAME/IdeaProjects/",
  "openineditor.customUrlPattern" : "http://localhost:63342/api/file%file&line=%line&column=%col"
}
```

### VS Code on Mac

To open repository files in your Documents directory:

```json
{
  "extensions": {
    "sourcegraph/open-in-editor": true,
  },
  "openineditor.editor" : "vscode",
  "openineditor.basePath": "/Users/USERNAME/Documents/"
}
```

### VS Code on Windows

To open repository files in your Documents directory:

```json
{
  "extensions": {
    "sourcegraph/open-in-editor": true,
  },
  "openineditor.editor" : "vscode",
  "openineditor.basePath": "/Users/USERNAME/Documents/"
}
```

### VS Code on WSL

To open repository files in your Home directory:

```json
{
  "extensions": {
    "sourcegraph/open-in-editor": true,
  },
  "openineditor.basePath": "//wsl$/Ubuntu-18.04/home",
  "openineditor.editor" : "custom",
  "openineditor.customUrlPattern" : "vscode://file/%file&line=%line&column=%col"
}
```

### VS Code Insider on Mac

To open repository files in your Documents directory:

```json
{
  "extensions": {
    "sourcegraph/open-in-editor": true,
  },
  "openineditor.basePath": "/Users/USERNAME/Documents/",
  "openineditor.editor" : "custom",
  "openineditor.customUrlPattern" : "vscode-insiders://file%file&line=%line&column=%col"
}
```

## Development

1. Run `yarn && yarn run serve` and keep the Parcel bundler process running
1. [Sideload the extension](https://docs.sourcegraph.com/extensions/authoring/local_development) (at the URL http://localhost:1234 by default) on your Sourcegraph instance or Sourcegraph.com

When you edit a source file in your editor, Parcel will recompile the extension. Reload the Sourcegraph web page to use the updated extension.