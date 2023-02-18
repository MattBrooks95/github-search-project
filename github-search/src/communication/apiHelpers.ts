export {
	encodeQuery,
	buildUrl,

}

function encodeQuery(q: string): string {
	return `?q=${encodeURIComponent(q)}`;
}

const apiUrl = "https://api.github.com/";


function buildUrlForBase(urlBase: string): (urlParts: string[]) => (searchString: string) => string {
	return (urlParts: string[]) => (searchString: string) => {
		return [
			urlBase,
			urlParts.join("/"),
			searchString,
		].filter(section => section !== undefined).join('');
	}
}

const buildUrl = buildUrlForBase(apiUrl);
