import { format } from 'date-fns';
import minify from '../utils/minify';

interface Item {
	title: string;
	link: string;
	description: string;
	pubDate: string;
}

class RssGenerator {
	private items: Item[] = [];

	addItem(title: string, link: string, description: string, pubDate: Date): void {
		const date = new Date(pubDate);
		const formattedDate = format(date, 'EEEE, dd MMMM yyyy');
		this.items.push({ title, link, description, pubDate: formattedDate });
	}

	generate(): string {
		const rss = `
		<?xml version="1.0" encoding="UTF-8"?>
		<rss version="2.0">
		    <title>Bloqu</title>
		    <link>https://www.bloqu.com</link>
			<description>Stay informed with Bloqu. Discover unbiased reporting, insightful stories, and fresh perspectives from trusted independent voices.</description>

			${this.items
				.map(
					(item) =>
						`<item>
							<title>${item.title}</title>
							<link>${item.link}</link>
							<description>${item.description}</description>
							<pubDate>${item.pubDate}</pubDate>
						</item>`
				)
				.join('')}
		</rss>`;

		return minify(rss);
	}
}

export default RssGenerator;
