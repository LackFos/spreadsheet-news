class App {
	public html: string = '';
	public header: string = '';
	public head: string = '';
	public body: string = '';

	constructor() {
		this.initHead();
		this.initStyle();
		this.initHeader();
	}
	private initHead() {
		this.addHead(`
        <meta charset="UTF-8"> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <title>News App</title> 
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> 
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
        `);
	}

	private initStyle() {
		this.addHead(
			`<style>.logo,a,a.badge{text-decoration:none}.badge,.flex,.header{display:flex}.container,.header__inner{max-width:1140px;width:100%}.card__summary,.card__title{-webkit-box-orient:vertical;overflow:hidden}*{margin:0;padding:0;box-sizing:border-box;font-family:Poppins,sans-serif;font-size:16px}h1{font-size:1.5rem}h2{font-size:1.25rem}body{color:rgba(0,0,0,.8);background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.05)'><path d='M0 .5H31.5V32'/></svg>")}a{color:inherit;font-size:inherit}.logo{color:#000;font-size:24px;font-weight:700}.badge,.logo.white{color:#fff}.badge{padding:2px 8px;font-size:.625rem;background-color:rgba(0,0,0,.8);border-radius:4px}.card,.header{background-color:#fff}.badge.pill{border-radius:16px}.small_text{color:rgba(0,0,0,.6);font-size:.625rem}.header{justify-content:center;height:64px;border-bottom:1px solid #e5e5e5}.header__inner{padding:0 16px;display:flex;align-items:center}.container{padding:16px;margin:24px auto}.card_container{display:grid;grid-template-columns:repeat(4,1fr);gap:40px 16px}.card{overflow:hidden;width:100%;display:flex;flex-direction:column;border:2px solid #e5e5e5;border-radius:24px;box-shadow:rgba(149,157,165,.2) 0 8px 24px}.card__img{width:100%;height:160px;object-fit:cover}.card__title{font-size:1.125rem;line-height:1.25;display:-webkit-box;line-clamp:3;-webkit-line-clamp:3}.card__content{padding:16px 20px;display:flex;flex-direction:column;align-items:start;gap:8px}.card__summary{font-size:.625rem;display:-webkit-box;text-align:justify;line-clamp:3;-webkit-line-clamp:3;color:rgba(0,0,0,.8)}.card__extra{margin-top:8px;width:100%;display:flex;gap:8px;align-items:center}.article__title{margin-bottom:24px}.article__cover{width:60%;border-radius:32px}.article h2,.article h3,.article h4,.article h5,.article h6{margin-top:40px;margin-bottom:8px}.article p{color:rgba(0,0,0,.7);margin-bottom:16px}</style>`
		);
	}

	private initHeader() {
		this.header = `
			<header class="header">
				<div class="header__inner">
					<a href="/" class="logo">bloqu</a>
				</div>
			</header>
        `;
	}

	public addHead(html: string): void {
		this.head += html;
	}

	public addBody(html: string): void {
		this.body += html;
	}

	public minify(html: string): string {
		return html.trim().replace(/>\s+</g, '><');
	}

	public render(): string {
		const head = this.minify(this.head);
		const header = this.minify(this.header);
		const body = this.minify(this.body);

		return `<!DOCTYPE html> <html lang="en"> <head> ${head} </head> <body> ${header} <main class="container">${body}</main> </body> </html>`;
	}
}

export default App;