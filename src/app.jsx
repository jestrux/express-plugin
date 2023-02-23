import { useState } from "preact/hooks";

export function App() {
	return (
		<div>
			<h1>Vite + Preact</h1>
			<div class="card">
				<button>count is {count}</button>
				<p>
					Edit <code>src/app.jsx</code> and save to test HMR
				</p>
			</div>
			<p class="read-the-docs">
				Click on the Vite and Preact logos to learn more
			</p>
		</div>
	);
}
