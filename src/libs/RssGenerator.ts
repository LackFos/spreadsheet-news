import { format } from 'date-fns';
import minify from '../utils/minify';

interface Item {
	title: string;
	link: string;
	description: string;
	pubDate: string;
}

class RssGenerator {
	private domain: string;
	private items: Item[] = [];

	constructor(domain: string) {
		this.domain = domain;
	}

	addItem(title: string, link: string, description: string, pubDate: Date): void {
		const date = new Date(pubDate);
		const formattedDate = format(date, 'EEE, dd MMM yyyy HH:mm:ss xx');
		this.items.push({ title, link: this.domain + link, description, pubDate: formattedDate });
	}

	generate(): string {
		const rss = `
		<?xml version="1.0" encoding="UTF-8"?>
		<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
		   <channel>
				<title>Bloqu</title>
				<link>${this.domain}</link>
				<atom:link href="${this.domain}/rss.xml" rel="self" type="application/rss+xml"/>
				<description>Stay informed with Bloqu. Discover unbiased reporting, insightful stories, and fresh perspectives from trusted independent voices.</description>
				${this.items
					.map(
						(item) =>
							`<item>
								<title>${item.title}</title>
								<link>${item.link}</link>
								<description>${item.description}</description>
								<pubDate>${item.pubDate}</pubDate>
								<guid>${item.link}</guid>
							</item>`
					)
					.join('')}  
		   </channel>
		</rss>`;

		return minify(rss);
	}
}

export default RssGenerator;
