import * as sourcegraph from 'sourcegraph'
import * as path from 'path'

const supportedEditors: {[editor: string]: {urlPattern: string}} = {
    vscode: {
        urlPattern: 'vscode://file%file:%line:%col',
    },
    idea: {
        urlPattern: 'idea://open?file=%file&line=%line&column=%col',
    },
    sublime: {
        urlPattern: 'subl://open?url=%file&line=%line&column=%col',
    },
    custom: {
        urlPattern: '',
    },
}

function getOpenUrl(textDocumentUri: URL): URL {
    const basePath: unknown = sourcegraph.configuration.get().value['openineditor.basePath'] as unknown
    const editor: unknown = sourcegraph.configuration.get().value['openineditor.editor'] as unknown
    const customUrlPattern: unknown = sourcegraph.configuration.get().value['openineditor.customUrlPattern'] as unknown

    if (typeof basePath !== 'string') {
        throw new TypeError(
            'Setting `openineditor.basePath` must be set in your [user settings](/user/settings) to open files.'
        )
    }
    if (!path.isAbsolute(basePath)) {
        throw new Error(
            `\`openineditor.basePath\` value \`${basePath}\` is not an absolute path. Please correct the error in your [user settings](/user/settings).`
        )
    }

    if (typeof editor !== 'string') {
        throw new TypeError(
            'Setting `openineditor.editor` must be set in your [user settings](/user/settings) to open files.'
        )
    }
    if (!Object.prototype.hasOwnProperty.call(supportedEditors, editor)) {
        throw new TypeError(
            'Setting `openineditor.editor` must be set to a valid value in your [user settings](/user/settings) to open files. Supported editors: ' +
            Object.keys(supportedEditors).join(',')
        )
    }
    if (editor === 'custom' && typeof customUrlPattern !== 'string') {
        throw new TypeError(
            'Setting `openineditor.customUrlPattern` must be set for custom editor in your [user settings](/user/settings) to open files.'
        )
    }

    const rawRepoName = decodeURIComponent(textDocumentUri.hostname + textDocumentUri.pathname)
    // TODO support different folder layouts, e.g. repo nested under owner name
    const repoBaseName = rawRepoName.split('/').pop() ?? ''
    const relativePath = decodeURIComponent(textDocumentUri.hash.slice('#'.length))
    const absolutePath = path.join(basePath, repoBaseName, relativePath)
    let line = 1;
    let column = 1;

    if (sourcegraph.app.activeWindow?.activeViewComponent?.type === 'CodeEditor') {
        const selection = sourcegraph.app.activeWindow?.activeViewComponent?.selection
        if (selection) {
            line = selection.start.line + 1
            if (selection && selection.start.character !== 0) {
                column = selection.start.character + 1
            }
        }
    }

    const urlPattern = getEditorUrlPattern(editor, customUrlPattern as string)
        .replace('%file', absolutePath)
        .replace('%line', `${line}`)
        .replace('%col', `${column}`)

    const openUrl = new URL(urlPattern)

    console.log(openUrl.href)
    return openUrl
}

export function activate(context: sourcegraph.ExtensionContext): void {
    context.subscriptions.add(
        sourcegraph.commands.registerCommand('openineditor.open.file', async (uri?: string) => {
            if (!uri) {
                const viewer = sourcegraph.app.activeWindow?.activeViewComponent
                uri = viewerUri(viewer)
            }
            if (!uri) {
                throw new Error('No file currently open')
            }
            const openUrl = getOpenUrl(new URL(uri))
            await sourcegraph.commands.executeCommand('open', openUrl.href)
        })
    )
}

function viewerUri(viewer: sourcegraph.ViewComponent | undefined): string | undefined {
    switch (viewer?.type) {
        case 'CodeEditor':
            return viewer.document.uri
        case 'DirectoryViewer':
            return viewer.directory.uri.href
        default:
            return undefined
    }
}

function getEditorUrlPattern(editor: string, customUrlPattern: string): string {
    if (editor === 'custom') {
        return customUrlPattern
    }
    return supportedEditors[editor].urlPattern
}
