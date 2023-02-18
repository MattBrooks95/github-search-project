import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


async function main() {
	ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	  //turn off react strict mode so it won't hit the github api twice
	  //when the additional rerender is ran
	  //<React.StrictMode>
		<App />
	  //</React.StrictMode>,
	)
}

main();
