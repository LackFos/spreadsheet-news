import Router from './libs/Router';
import Home from './pages/Home';
import Post from './pages/Post';

const routes = new Router();
routes.addRoute('/', Home);
routes.addRoute('/post/{slug}', Post);

export default routes;
