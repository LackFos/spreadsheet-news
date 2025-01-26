import Card from '../components/Card';
import query from '../utils/query';
import ucWords from '../utils/ucWords';
import { RouterCallback } from '../types';

const Home = async ({ app, env, url }: RouterCallback) => {
	const { SHEETID } = env as Record<string, string>;
	const category = url.searchParams.get('category');

	const queryString = category
		? `https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE D = '${category} ORDER BY H DESC'`
		: `https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * ORDER BY H DESC`;

	const data = await query(queryString);

	app.addHead(`
		<title>Bloqu | Your Source for Independent News & Media</title
		<meta name="description" content="Stay informed with Bloqu. Discover unbiased reporting, insightful stories, and fresh perspectives from trusted independent voices." />
		<meta property="og:title" content="Bloqu | Your Source for Independent News & Media" />
		<meta property="og:description" content="Stay informed with Bloqu. Discover unbiased reporting, insightful stories, and fresh perspectives from trusted independent voices." />
	`);

	const totalItems = data.length;
	const itemPerPage = 12;
	const totalPages = Math.ceil(totalItems / itemPerPage);
	const currentPage = Number(url.searchParams.get('page')) || 1;

	const startIndex = (currentPage - 1) * itemPerPage;
	const endIndex = startIndex + itemPerPage;

	const paginatedData = data.slice(startIndex, endIndex);

	const minPage = currentPage - 2 < 1 ? 1 : currentPage - 2;
	const maxPage = Math.min(totalPages, currentPage + 2);

	const pageNumbers = Array.from({ length: maxPage - minPage + 1 }, (_, index) => minPage + index);

	return `
		<div class="card_container">
			${paginatedData
				.map((item) =>
					Card({
						name: item.name,
						slug: item.slug,
						category: ucWords(item.category),
						description: item.description,
						cover: item.cover,
						created_at: item.created_at,
					})
				)
				.join('')}
		</div>

		${
			paginatedData.length > 0
				? `<div class="pagination">
					${pageNumbers
						.map((number) => {
							return `<a href="?page=${number}" class="badge ${number != currentPage ? 'outline' : ''}">${number}</a>`;
						})
						.join('')}
				</div>
			`
				: ''
		}
	`;
};

export default Home;
