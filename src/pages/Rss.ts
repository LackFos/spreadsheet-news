import { RouterCallback } from '../types';
import query from '../utils/query';
import RssGenerator from '../libs/RssGenerator';

const Rss = async ({ env, url, params }: RouterCallback) => {
	const { APP_URL, SHEETID } = env as Record<string, string>;

	const posts = await query(`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * LIMIT 50`);

	const RssGenarator = new RssGenerator(APP_URL);
	posts.forEach((post) => RssGenarator.addItem(post.name, `/post/${post.slug}`, post.description, new Date(post.created_at)));
	return RssGenarator.generate();
};

export default Rss;
