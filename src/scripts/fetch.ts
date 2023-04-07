export async function fetchGet(url: any, format = 'json') {
	console.log('Getting...');
	const response = await fetch(url);
	const data = (format === 'text') ? await response.text() : await response.json();
	return data;
}
