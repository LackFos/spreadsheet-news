// import { setStatusCode } from '../libs/Router';
import Card from '../components/Card';
import { RouterCallback } from '../types';
import query from '../utils/query';
import ucWords from '../utils/ucWords';
import Error404 from './error/Error404';
import Error500 from './error/Error500';
import slugify from '../utils/slugify';
import { format } from 'date-fns';

const Post = async ({ app, env, params, setStatusCode }: RouterCallback) => {
	const { SHEETID } = env as Record<string, string>;
	const slug = params?.slug;

	let data = null;
	const randomRelatedContent: Record<string, string>[] = [];
	const randomRelatedContentCount = 9;

	try {
		data = (
			await query(
				`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE B = '${slug}' limit 1`
			)
		)[0];

		const relatedContent = await query(
			`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE D = '${data.category}'`
		);

		const randomIndex =
			relatedContent.length > 0
				? Array.from({ length: Math.min(relatedContent.length, randomRelatedContentCount) }, () =>
						Math.floor(Math.random() * relatedContent.length)
				  )
				: [];

		randomIndex.forEach((index) => {
			randomRelatedContent.push(relatedContent[index]);
		});
	} catch (error) {}

	if (!data) {
		setStatusCode(404);
		return Error404();
	}

	const tags: string[] = JSON.parse(data.tags);
	const hasTags = tags && tags.length > 0;

	const createdAt = new Date(data.created_at);
	const formattedDate = format(createdAt, 'EEEE, dd MMMM yyyy');

	app.addHead(`
		<title>${data.name}</title>
		<meta name="description" content="${data.description}" />
		<meta property="og:title" content="${data.name}" />
		<meta property="og:description" content="${data.description}" />
		<meta property="og:image" content="${data.cover}" />
	`);

	return `
		<ul class="breadcrumb">
			<ol><a href="/">Bloqu</a></ol>
			<ol class="disabled">Post</ol>
			<ol class="disabled">7 Devastating Kebakaran: Unveiling the Untold Stories</ol>
		</ul>

	  	<article itemscope itemtype="https://schema.org/NewsArticle" class="article">
			<h1 itemprop="headline" class="article__title">${data.name}</h1>

			<div class="article__extra">
				<div class="article__extra-items">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 19.1115C5 16.6984 6.69732 14.643 9.00404 14.2627L9.21182 14.2284C11.0589 13.9239 12.9411 13.9239 14.7882 14.2284L14.996 14.2627C17.3027 14.643 19 16.6984 19 19.1115C19 20.1545 18.1815 21 17.1719 21H6.82813C5.81848 21 5 20.1545 5 19.1115Z" stroke="currentColor" stroke-width="2"/><path d="M16.0834 6.9375C16.0834 9.11212 14.2552 10.875 12 10.875C9.74486 10.875 7.91669 9.11212 7.91669 6.9375C7.91669 4.76288 9.74486 3 12 3C14.2552 3 16.0834 4.76288 16.0834 6.9375Z" stroke="currentColor" stroke-width="2"/></svg>
					<span itemprop="author">Nancy Chen</span>
				</div>
			
				<div class="article__extra-items">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2025 15.3439C14.9297 15.1787 15.5991 14.874 16.1795 14.4601L17.3264 18.9669C17.6708 20.3201 16.2233 21.4446 14.9341 20.8255L13.0013 19.8972C12.3704 19.5943 11.6296 19.5943 10.9987 19.8972L9.0659 20.8255C7.77673 21.4446 6.32924 20.3201 6.67359 18.9669L7.82046 14.46C8.40085 14.874 9.0703 15.1787 9.79754 15.3439M14.2025 15.3439C12.7538 15.673 11.2462 15.673 9.79754 15.3439M14.2025 15.3439C16.2084 14.8882 17.7746 13.3712 18.2451 11.4285C18.585 10.0254 18.585 8.56527 18.2451 7.16223C17.7746 5.21947 16.2084 3.70254 14.2025 3.24683C12.7538 2.91772 11.2462 2.91772 9.79753 3.24683C7.79162 3.70254 6.22538 5.21947 5.75486 7.16223C5.41505 8.56527 5.41505 10.0254 5.75486 11.4285C6.22538 13.3712 7.79162 14.8882 9.79754 15.3439" stroke="currentColor" stroke-width="2"/></svg>
					<span>${data.category}</span>
				</div>
			
				<div class="article__extra-items">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.83327 15.2485L4.808 15.0251L3.83327 15.2485ZM3.83327 9.35323L4.808 9.57664L3.83327 9.35323ZM20.1667 9.35323L19.192 9.57664L20.1667 9.35323ZM20.1667 15.2485L19.192 15.0251L20.1667 15.2485ZM14.8801 20.6589L15.1136 21.6313L14.8801 20.6589ZM9.11986 20.6589L9.35329 19.6865L9.11986 20.6589ZM9.11985 3.94279L9.35329 4.91517L9.11985 3.94279ZM14.8801 3.94279L15.1136 2.97042L14.8801 3.94279ZM9.07008 3C9.07008 2.44772 8.62236 2 8.07008 2C7.5178 2 7.07008 2.44772 7.07008 3H9.07008ZM7.07008 5.51375C7.07008 6.06603 7.5178 6.51375 8.07008 6.51375C8.62236 6.51375 9.07008 6.06603 9.07008 5.51375H7.07008ZM16.9299 3C16.9299 2.44772 16.4822 2 15.9299 2C15.3776 2 14.9299 2.44772 14.9299 3H16.9299ZM14.9299 5.51375C14.9299 6.06603 15.3776 6.51375 15.9299 6.51375C16.4822 6.51375 16.9299 6.06603 16.9299 5.51375H14.9299ZM4.808 15.0251C4.39733 13.2333 4.39733 11.3684 4.808 9.57664L2.85855 9.12982C2.38048 11.2156 2.38048 13.3861 2.85855 15.4719L4.808 15.0251ZM19.192 9.57664C19.6027 11.3684 19.6027 13.2333 19.192 15.0251L21.1415 15.4719C21.6195 13.3861 21.6195 11.2156 21.1415 9.12983L19.192 9.57664ZM14.6467 19.6866C12.9058 20.1045 11.0942 20.1045 9.35329 19.6865L8.88643 21.6313C10.9343 22.1229 13.0657 22.1229 15.1136 21.6313L14.6467 19.6866ZM9.35329 4.91517C11.0942 4.49723 12.9058 4.49723 14.6467 4.91517L15.1136 2.97042C13.0658 2.47881 10.9343 2.47881 8.88642 2.97042L9.35329 4.91517ZM9.35329 19.6865C7.10919 19.1478 5.34073 17.3494 4.808 15.0251L2.85855 15.4719C3.55643 18.5168 5.88428 20.9106 8.88643 21.6313L9.35329 19.6865ZM15.1136 21.6313C18.1157 20.9106 20.4436 18.5167 21.1415 15.4719L19.192 15.0251C18.6593 17.3494 16.8908 19.1478 14.6467 19.6866L15.1136 21.6313ZM14.6467 4.91517C16.8908 5.45389 18.6593 7.25234 19.192 9.57664L21.1415 9.12983C20.4436 6.08497 18.1157 3.69113 15.1136 2.97042L14.6467 4.91517ZM8.88642 2.97042C5.88428 3.69113 3.55642 6.08497 2.85855 9.12982L4.808 9.57664C5.34073 7.25233 7.10918 5.45389 9.35329 4.91517L8.88642 2.97042ZM4.14016 9.27886H19.8598V7.27886H4.14016V9.27886ZM7.07008 3V5.51375H9.07008V3H7.07008ZM14.9299 3V5.51375H16.9299V3H14.9299Z" fill="currentColor"/></svg>
					<span itemprop="dateCreated">${formattedDate}</span>
				</div>
			</div>
			
			<div class="article__cover">
				<img itemprop="image" src="${data.cover}" alt="" />
			</div>
			
			<div itemprop="articleBody">
				${data.content}
			</div>

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
