// import { setStatusCode } from '../libs/Router';
import { RouterCallback } from '../types';
import query from '../utils/query';
import Error404 from './error/Error404';
import Error500 from './error/Error500';

const Post = async ({ app, env, params, setStatusCode }: RouterCallback) => {
	const { SHEETID } = env as Record<string, string>;
	const slug = params?.slug;
	let data = null;

	try {
		data = (
			await query(
				`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE B = '${slug}' limit 1`
			)
		)[0];
	} catch (error) {
		setStatusCode(500);
		return Error500();
	}

	if (!data) {
		setStatusCode(404);
		return Error404();
	}

	app.addHead(`
		<title>${data.nama}</title>
		<meta property="og:title" content="${data.nama}" />
		<meta property="og:description" content="${data.description}" />
		<meta property="og:image" content="${data.cover}" />
	`);

	return `
      <h1 class="article__title">${data.nama}</h1>
	  <article class="article">
		<div class="article__cover">
	    	<img src="${data.cover}" alt="" />
		</div>

	 	${data.content} 
	  </article>
	`;
};

export default Post;
