import { setStatusCode } from '../libs/Router';
import { RouterCallback } from '../types';
import query from '../utils/query';
import Error404 from './error/Error404';

const Post = async ({ env, params }: RouterCallback) => {
	const { SHEETID } = env as Record<string, string>;
	const slug = params?.slug;

	const data = (
		await query(`https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&tq=SELECT * WHERE B = '${slug}' limit 1`)
	)[0];

	if (!data) {
		setStatusCode(404);
		return Error404();
	}

	return `
      <h1 class="article__title">${data.nama}</h1>
	  <article class="article">
	    <img class="article__cover" src="${data.cover}" alt="" />

	 	${data.content} 
	  </article>
	`;
};

export default Post;
