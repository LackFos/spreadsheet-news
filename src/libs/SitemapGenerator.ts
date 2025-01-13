interface Page {
	path: string;
	lastmod: string;
	priority?: number;
}

class SitemapGenerator {
	private domain: string;
	private isIndex: boolean;
	private pages: Page[] = [];
	private pagePerFile: number = 1000;
	private pageChunks: Page[][] = [];

	constructor(domain: string, isIndex: boolean = false) {
		this.domain = domain;
		this.isIndex = isIndex;
	}

	addUrl(path: string, lastmod: string, priority?: number): void {
		this.pages.push({ path, lastmod, priority });
	}

	getSitemapMetadata(): { sitemapCount: number; sitemapUrls: string[] } {
		const sitemapCount = Math.ceil(this.pages.length / this.pagePerFile);
		const sitemapUrls = Array.from({ length: sitemapCount }, (_, index) => `/sitemap${index + 1}.xml`);
		return { sitemapCount, sitemapUrls };
	}

	splitPagesIntoChunks(): void {
		this.pageChunks = [];
		for (let i = 0; i < this.pages.length; i += this.pagePerFile) {
			this.pageChunks.push(this.pages.slice(i, i + this.pagePerFile));
		}
	}

	generate(pagenumber?: number): string {
		const { sitemapCount, sitemapUrls } = this.getSitemapMetadata();
		this.splitPagesIntoChunks();

		for (let i = 0; i < sitemapCount; i++) {
			this.pageChunks.push();
		}

		if (this.isIndex) {
			const sitemaps = sitemapUrls.reduce((acc, url, index) => {
				const lastmod = this.pageChunks[index].reduce(
					(latest, page) => (new Date(page.lastmod) > new Date(latest) ? page.lastmod : latest),
					this.pageChunks[index][0].lastmod
				);

				return acc + `<sitemap><loc>${this.domain}${url}</loc><lastmod>${lastmod}</lastmod></sitemap>`;
			}, '');
			return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemaps}</sitemapindex>`;
		} else {
			if (pagenumber !== -1) {
				const pages = this.pageChunks[pagenumber ?? 0].reduce(
					(acc, url) =>
						acc +
						`<url>
								<loc>${this.domain}${url.path}</loc>
								${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
								${url.priority ? `<priority>${url.priority}</priority>` : ''}
						</url>`,
					''
				);
				return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages}</urlset>`;
			} else {
				return '';
			}
		}
	}
}

export default SitemapGenerator;
