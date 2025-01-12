import App from './App';
import { RouterCallback } from '../types';
import Error404 from '../pages/error/Error404';
import { useState } from '../utils/useState';

class Router {
	public routes: { path: string; callback: (data: RouterCallback) => Promise<string> }[] = [];

	public addRoute(route: string, callback: (data: RouterCallback) => Promise<string>): void {
		this.routes.push({ path: route, callback });
	}

	public async mount(app: App, url: URL, env: Env) {
		const [getStatusCode, setStatusCode] = useState(200);

		let isNotFound = true;

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
