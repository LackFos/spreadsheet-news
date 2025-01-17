import Card from '../components/Card';
import query from '../utils/query';
import ucWords from '../utils/ucWords';
import { RouterCallback } from '../types';

const Home = async ({ app, env, url }: RouterCallback) => {
	const { SHEETID } = env as Record<string, string>;
	const category = url.searchParams.get('category') ? url.searchParams.get('category') : null;

	const queryString = category
		? `https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE D = '${category} ORDER BY G DESC LIMIT 20'`
		: `https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * ORDER BY G DESC LIMIT 20`;

	const data = await query(queryString);

	app.addHead(`
		<title>Bloqu | Your Source for Independent News & Media</title>
		<meta property="og:title" content="Bloqu | Your Source for Independent News & Media" />
		<meta property="og:description" content="Stay informed with Bloqu. Discover unbiased reporting, insightful stories, and fresh perspectives from trusted independent voices." />
	`);

	return `
		<div class="card_container">
		${data
			.map((item) =>
				Card({
					nama: item.nama,
					slug: item.slug,
					kategori: ucWords(item.category),
					deskripsi: item.description,
					cover: item.cover,
					created_at: item.created_at,
				})
			)
			.join('')}
		</div>
	`;
};

export default Home;
