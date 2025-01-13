import App from './libs/App';

export interface googleSheetResponse {
	version: string;
	reqId: string;
	table: {
		cols: { id: string; label: string; type: string }[];
		rows: { c: { v: string }[] }[];
		parsedNumHeaders: number;
	};
}

export interface RouterCallback {
	app: App;
	url: URL;
	env: Env;
	setStatusCode: (code: number) => void;
	params?: Record<string, any>;
}
