export {
	encodeQuery,
	buildUrl,
	defaultValTo,
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

function defaultValTo<F, T>(x: F | null | undefined, defaultVal: T, handleVal: (y: F) => T) {
	if (x === null || x === undefined) return defaultVal;
	return handleVal(x);
}

const buildUrl = buildUrlForBase(apiUrl);
