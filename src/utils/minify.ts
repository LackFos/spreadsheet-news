/**
 * Minifies the given HTML string by removing unnecessary whitespace between tags.
 *
 * @param html - The HTML string to be minified.
 * @returns The minified HTML string with whitespace between tags removed.
 */
function minify(html: string): string {
	return html.trim().replace(/>\s+</g, '><');
}

export default minify;
