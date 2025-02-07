import { RouterCallback } from '../types';
import query from '../utils/query';
import RssGenerator from '../libs/RssGenerator';
import useConfig from '../hooks/useConfig';

const Rss = async ({ env, url, params }: RouterCallback) => {
	const SHEETID = (env as Record<string, string>).SHEETID;
	const APP_URL = await useConfig(SHEETID, 'app_url');

	const posts = await query(`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * LIMIT 10`);

	const RssGenarator = new RssGenerator(APP_URL);

	posts.forEach((post) => RssGenarator.addItem(post.name, `/post/${post.slug}`, post.description, new Date(post.created_at)));
	console.log(RssGenarator.generate());

	return RssGenarator.generate();
};

export default Rss;
