import SitemapGenerator from '../libs/SitemapGenerator';
import { RouterCallback } from '../types';
import query from '../utils/query';

const Sitemap = async ({ env, url, params }: RouterCallback) => {
	const { APP_URL, SHEETID } = env as Record<string, string>;
	const isIndex = params?.isIndex;

	const sitemapGenerator = isIndex ? new SitemapGenerator(APP_URL, true) : new SitemapGenerator(APP_URL);

	const posts = await query(`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT *`);
	posts.forEach((post) => sitemapGenerator.addUrl(`/post/${post.slug}`, new Date(post.created_at.replaceAll('_', '/')).toISOString()));

	const { sitemapUrls } = sitemapGenerator.getSitemapMetadata();

	if (isIndex) {
		return sitemapGenerator.generate();
	}

	let sitemapNumber = sitemapUrls.findIndex((sitemapUrl) => sitemapUrl === url.pathname);

	return sitemapGenerator.generate(sitemapNumber);
};

export default Sitemap;
