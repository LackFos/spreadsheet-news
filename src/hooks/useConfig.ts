const useConfig = async (SHEETID: string, key: string) => {
	const endpoint = `https://docs.google.com/spreadsheets/d/${SHEETID}/gviz/tq?tqx=out:json&headers=1&gid=1437506307&tq=SELECT * WHERE A = '${key}' limit 1`;
	const response = await fetch(endpoint);

	const toText = await response.text();
	const toJson = JSON.parse(toText.substring(47, toText.length - 2));

	const value = toJson.table.rows[0].c[1].v;
	return value;
};

export default useConfig;
