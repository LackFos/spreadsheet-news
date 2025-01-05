import { googleSheetResponse } from '../types';
import slugify from './slugify';

const mapColumnAndRow = (response: googleSheetResponse) => {
	const result: Record<string, string>[] = [];
	const columns = response.table.cols.map((cell) => slugify(cell.label, '_')); // Use first row as headers

	response.table.rows.forEach((row, index) => {
		let rowData: Record<string, string> = {};

		const cells = row.c;
		cells.forEach((cell, index) => {
			rowData[columns[index]] = cell?.v ?? '';
		});

		result.push(rowData);
	});

	return result;
};

export default mapColumnAndRow;
