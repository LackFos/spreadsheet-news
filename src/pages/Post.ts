// import { setStatusCode } from '../libs/Router';
import Card from '../components/Card';
import { RouterCallback } from '../types';
import query from '../utils/query';
import ucWords from '../utils/ucWords';
import Error404 from './error/Error404';
import Error500 from './error/Error500';
import slugify from '../utils/slugify';

const Post = async ({ app, env, params, setStatusCode }: RouterCallback) => {
	const { SHEETID } = env as Record<string, string>;
	const slug = params?.slug;

	let data = null;
	const randomRelatedContent: Record<string, string>[] = [];
	const randomRelatedContentCount = 8;

	try {
		data = (
			await query(
				`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE B = '${slug}' limit 1`
			)
		)[0];

		const relatedContent = (
			await query(
				`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE D = '${data.category}'`
			)
		)

		const randomIndex = relatedContent.length > 0
				? Array.from({ length: Math.min(relatedContent.length, randomRelatedContentCount) }, () => Math.floor(Math.random() * relatedContent.length))
				: [];

		randomIndex.forEach((index) => {
			randomRelatedContent.push(relatedContent[index]);
		});

	} catch (error) {
		setStatusCode(500);
		return Error500();
	}

	if (!data) {
		setStatusCode(404);
		return Error404();
	}

	const tags = JSON.parse(data.tags);
	const hasTags = tags && tags.length > 0;

	app.addHead(`
		<title>${data.name}</title>
		<meta name="description" content="${data.description}" />
		<meta property="og:title" content="${data.name}" />
		<meta property="og:description" content="${data.description}" />
		<meta property="og:image" content="${data.cover}" />
	`);

	return `
      <h1 class="article__title">${data.name}</h1>

	  	<article class="article">
				<div class="article__cover">
						<img src="${data.cover}" alt="" />
				</div>

				${data.content}

				${
						hasTags
						? `
							<div>
								<h4>Tags:</h4>
								${tags.map((tag) => `<a href="/tags/${slugify(tag)}">${tag}</a>`).join('&nbsp;&nbsp;')}
							</div>
							`
						: ''
				}
			</article>

	  	<section class="related__content">
				<h3>You may also like</h3>

				<div class="card_container">
					${randomRelatedContent
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
			</section>
	`;
};

export default Post;
