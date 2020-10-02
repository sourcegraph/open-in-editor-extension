# open-in-editor (Sourcegraph extension)

Adds a button at the top of files in both Sourcegraph app and code hosts like GitHub (when the Sourcegraph browser extension is installed) that will open the current file in your editor of choice. 

![Screenshot](https://user-images.githubusercontent.com/6304497/94799074-dcfd1d80-03e2-11eb-86fc-e55e03380154.png)

## Installing

For Sourcegraph.com, it can be enabled here: https://sourcegraph.com/extensions/sourcegraph/open-in-editor

Otherwise, follow instructions here to publish it privately: https://docs.sourcegraph.com/extensions/authoring/publishing

## Settings

- Add `openineditor.editor` to your user settings to open files in the editor. Copy one of the following lines depending on the editor you would like to use. This extension only supports opening in one editor at a time. Supported editors:
  - `vscode` (Visual Studio Code): `"openineditor.editor": "vscode"`
  - `idea` (JetBrains IntelliJ IDEA): `"openineditor.editor": "idea"`
  - `sublime` (Sublime Text, requires a URL handler installed such as [this one for macOS](https://github.com/inopinatus/sublime_url))
  - `custom` (requires also setting `openineditor.customUrlPattern`): `"openineditor.editor": "custom"`
- `openineditor.basePath`: The absolute path on your computer where your git repositories live. This extension requires all git repos to be already cloned under this path with their original names. `"/Users/yourusername/src"` is a valid absolute path, while `"~/src"` is not.
- `openineditor.customUrlPattern`: If you set `openineditor.editor` to `custom`, this must be set. Use placeholders `%file`, `%line`, and `%col` to mark where the file path, line number, and column number must be replaced. Example URL for IntelliJ IDEA: `idea://open?file=%file&line=%line&column=%col`
