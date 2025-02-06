import App from './App';
import { RouterCallback } from '../types';
import Error404 from '../pages/error/Error404';
import { useState } from '../utils/useState';
import Sitemap from '../pages/Sitemap';
import Rss from '../pages/Rss';
import useConfig from '../hooks/useConfig';

class Router {
	public routes: { path: string; callback: (data: RouterCallback) => Promise<string> }[] = [];

	public addRoute(route: string, callback: (data: RouterCallback) => Promise<string>): void {
		this.routes.push({ path: route, callback });
	}

	public async mount(app: App, url: URL, env: Env) {
		const SHEETID = (env as Record<string, string>).SHEETID;
		const INDEXNOW = await useConfig(SHEETID, 'index_now');

		let isNotFound = true;
		const [getStatusCode, setStatusCode] = useState(200);

		// Indexnow handler
		if (url.pathname === `/${INDEXNOW}.txt`) {
			return new Response(INDEXNOW, { headers: { 'content-type': 'text/plain' }, status: 200 });
		}

		// Favicons handler
		if (url.pathname === '/favicon.svg') {
			return new Response(
				`<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="48" height="48" rx="8" fill="black"/><path d="M11.66 21.42C11.98 20.9 12.44 20.48 13.04 20.16C13.64 19.84 14.3267 19.68 15.1 19.68C16.02 19.68 16.8533 19.9133 17.6 20.38C18.3467 20.8467 18.9333 21.5133 19.36 22.38C19.8 23.2467 20.02 24.2533 20.02 25.4C20.02 26.5467 19.8 27.56 19.36 28.44C18.9333 29.3067 18.3467 29.98 17.6 30.46C16.8533 30.9267 16.02 31.16 15.1 31.16C14.3133 31.16 13.6267 31.0067 13.04 30.7C12.4533 30.38 11.9933 29.96 11.66 29.44V31H8.24V16.2H11.66V21.42ZM16.54 25.4C16.54 24.5467 16.3 23.88 15.82 23.4C15.3533 22.9067 14.7733 22.66 14.08 22.66C13.4 22.66 12.82 22.9067 12.34 23.4C11.8733 23.8933 11.64 24.5667 11.64 25.42C11.64 26.2733 11.8733 26.9467 12.34 27.44C12.82 27.9333 13.4 28.18 14.08 28.18C14.76 28.18 15.34 27.9333 15.82 27.44C16.3 26.9333 16.54 26.2533 16.54 25.4ZM25.2342 16.2V31H21.8142V16.2H25.2342ZM27.0327 25.44C27.0327 24.3333 27.2593 23.3467 27.7127 22.48C28.1793 21.6133 28.7993 20.94 29.5727 20.46C30.3593 19.9667 31.2127 19.72 32.1327 19.72C32.8393 19.72 33.4727 19.8467 34.0327 20.1C34.5927 20.34 35.046 20.68 35.3927 21.12V19.84H38.8127V36.32H35.3927V29.6C35.006 30.0667 34.5327 30.44 33.9727 30.72C33.426 31 32.7993 31.14 32.0927 31.14C31.186 31.14 30.346 30.9 29.5727 30.42C28.7993 29.94 28.1793 29.2667 27.7127 28.4C27.2593 27.5333 27.0327 26.5467 27.0327 25.44ZM35.3927 25.42C35.3927 24.82 35.2727 24.32 35.0327 23.92C34.806 23.5067 34.506 23.2 34.1327 23C33.7593 22.7867 33.366 22.68 32.9527 22.68C32.5527 22.68 32.166 22.7867 31.7927 23C31.4193 23.2 31.1127 23.5067 30.8727 23.92C30.6327 24.3333 30.5127 24.84 30.5127 25.44C30.5127 26.04 30.6327 26.5467 30.8727 26.96C31.1127 27.36 31.4193 27.6667 31.7927 27.88C32.166 28.08 32.5527 28.18 32.9527 28.18C33.3527 28.18 33.7393 28.08 34.1127 27.88C34.4993 27.6667 34.806 27.3533 35.0327 26.94C35.2727 26.5267 35.3927 26.02 35.3927 25.42Z" fill="white"/></svg>`,
				{ headers: { 'content-type': 'image/svg+xml' }, status: 200 }
			);
		}

		// Sitemap handler
		if (url.pathname.match(/^\/sitemap.*\.xml$/)) {
			let sitemap = null;

			if (url.pathname === '/sitemap.xml') {
				sitemap = await Sitemap({ app, env, url, setStatusCode, params: { isIndex: true } });
			} else {
				sitemap = await Sitemap({ app, env, url, setStatusCode });
			}

			return new Response(sitemap, {
				headers: { 'content-type': 'text/xml;charset=UTF-8' },
				status: 200,
			});
		}

		if (url.pathname === '/rss.xml') {
			const rss = await Rss({ app, env, url, setStatusCode });
			return new Response(rss, { headers: { 'content-type': 'text/xml;charset=UTF-8' }, status: 200 });
		}

		// Developers defined route handler
		for (const route of this.routes) {
			const dynamicPath = route.path.match(/\{([^{}]+)\}/g)?.map((key) => key.slice(1, -1)) ?? []; // Return: ['postid', 'imageid']

			if (dynamicPath.length > 0) {
				const matchedUrlRegex = new RegExp(route.path.replace(/\{([^{}]+)\}/g, '(.*)')); // Return: /posts\/(.*)\/images\/(.*)

				if (matchedUrlRegex.test(url.pathname)) {
					const matches = url.pathname.match(matchedUrlRegex)?.slice(1) ?? [];
					const params = matches.reduce((acc, match, index) => ({ ...acc, [dynamicPath[index]]: match }), {}); // Return: { postid: '1', imageid: '2' }
					app.addBody(await route.callback({ app, env, url, setStatusCode, params }));
					isNotFound = false;
				}
			} else {
				if (route.path === url.pathname) {
					app.addBody(await route.callback({ app, env, url, setStatusCode }));
					isNotFound = false;
				}
			}
		}

		if (isNotFound) {
			setStatusCode(404);
			app.addBody(Error404());
		}

		return new Response(app.render(), { headers: { 'content-type': 'text/html;charset=UTF-8' }, status: getStatusCode() });
	}
}

export default Router;
