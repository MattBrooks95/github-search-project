export {
	exceedsCharacterLimit,
	matchQualifiers,
}
//https://docs.github.com/en/rest/search?apiVersion=2022-11-28#about-search
//Limitations on query length
//
//You cannot use queries that:
//
//    are longer than 256 characters (not including operators or qualifiers).
//    have more than five AND, OR, or NOT operators.
//
//These search queries will return a "Validation failed" error message.

//search syntax:
//https://docs.github.com/en/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax

/**
* remove operators and qualifiers, then check the string length
* length < 256 -> false
* length > 256 -> true
**/
function exceedsCharacterLimit(search: string): boolean {
	return search
		.replace(operatorsPattern, "")
		.replace(qualifiersPattern, "").length > 256;
}

/**
* match the qualifiers in a string
* for example: 'something in:readme' would match 'in:readme'
**/
function matchQualifiers(search: string): RegExpMatchArray | null {
	return search.match(qualifiersPattern);

}

/** match 'searchKeyword:[search criteria]' */
const qualifiersPattern: RegExp = new RegExp(/[^ ]+:[^ ]/, "g");

/** match 'searchKeyword:[operator][search criteria] */
const operatorsPattern: RegExp = new RegExp(/[^ ]+:(<=|>=|>|<|)[^ ]+/);
