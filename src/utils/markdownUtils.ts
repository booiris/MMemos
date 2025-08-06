import { Marked, Tokens } from 'marked'

export const createMarkdownRenderer = (): Marked => {
    return new Marked({
        breaks: true,
        pedantic: false,
        gfm: true,
        renderer: {
            link(token: Tokens.Link) {
                return `<a href="${
                    token.href
                }" target="_blank" rel="noopener noreferrer"${
                    token.title ? ` title="${token.title}"` : ''
                }>${token.text}</a>`
            },
        },
    })
}

export const markdownRenderer = createMarkdownRenderer()
