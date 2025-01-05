import { googleSheetResponse } from '../types';
import mapColumnAndRow from './mapColumnAndRow';

const query = async (queryString: string) => {
	const contents = await fetch(queryString);
	const response = await contents.text();
	const toJson: googleSheetResponse = JSON.parse(response.substring(47, response.length - 2));

	return mapColumnAndRow(toJson);
};

export default query;
