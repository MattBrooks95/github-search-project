## GitHub Search Api

### Installation
- if you have the Nix package manager and direnv installed, `direnv allow` will use direnv and nix to prepare node 18
    - an alternative is to use nvm, and the .nvmrc file. `$cd github-search && nvm use`
- after node is setup, `$npm install` will install Vite
- after `$npm run dev`, the Vite dev server should start up
- go to localhost:5173 in the browser

### Features
- you can specify the number of code search items returned per page by using the number input
- when pagination is active, if the request had link headers, the "Next" and "Previous" buttons can be used to hit that URL, and pull in the results for that page
- the GitHub rate_limit api is hit once a second, and will display how many searches you have remaining before the reset, and the time of the reset
- if 'Requests Remaining' hits 0, the Search button is disabled until the rate limit is reset
- if there was some sort of error as a result of the request, the error message is displayed on the screen instead of the results
- you can run the search by hitting the Enter key

### Bugs
- if you mash the search button in between the rate limit updates, you can get it to send more requests than it should because the rate limit 'requestsRemaining' value isn't set at that time
    - in order to fix it I would need to also use the new rate information that is returned with the search response itself
    - disallowing the Search function from running while we have an unresolved promise from the previous seacrh may also be a good idea
