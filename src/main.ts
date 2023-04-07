import './style.scss'
import FontFaceObserver from 'fontfaceobserver'
import {GHUserSearch} from './scripts/ghusersearch'
import { nightmode } from './scripts/nightmode';

// Execute on load
window.onload = () => {
	const fontLato = new FontFaceObserver('Lato');
	const fontAbril = new FontFaceObserver('Abril Fatface');
	const nightmodeToggle = document.querySelector('.nightmode');

	if (!!nightmodeToggle) nightmode(nightmodeToggle);
	new GHUserSearch(document.querySelector('.ghuser'));

	// Only initialise after window and fonts have loaded
	Promise.all([fontLato.load(), fontAbril.load()]).then(async() => {
		// Add class which fades in content for a bit of niceness
		document.body.classList.add('-initiated');

		/*
		// The wrapper element that will display user data
		const ghuserWrapper = document.querySelector('.ghuser');

		// No wrapper? Can't do much without it
		if (!ghuserWrapper) return;

		document.querySelector('button')?.addEventListener('click', async () => {
			const userString = document.querySelector('input')?.value;
			console.log(userString)

			// API base url
			let baseUrl = "https://api.github.com/users/";
			// Base URL + the ${username} we're searching for
			let url = `${baseUrl}${userString}`;
			// Empty variable used to store response later
			let userData: any;

			// Perform the fetch using our custom function
			await fetchGet(url)
				.then((data: { message: string; name: null; login: any; followers: any; public_repos: any; avatar_url: any; }) => {
					// No user? output a message and kill it
					if (data.message === 'Not Found') {
						displayMessage('User not found 😖', 'error');
						return;
					}

					// Store the data
					userData = data;
				})
				.catch((error: string) => {
					console.error('Error: ' + error);
					displayMessage(error, 'error');
				});

			// Wait until we've successfully retrieved the data
			await (() => {
				return new Promise<void>(resolve => {
					// Store the data and define fallbacks
					const name = userData.name ?? 'Not found';
					const login = userData.login ?? 'Not found';
					const followersCount = userData.followers ?? 'Not found';
					const repoCount = userData.public_repos ?? 'Not found';
					const image = userData.avatar_url ?? "https://picsum.photos/id/237/100/100";

					// The structured data
					const html = `
						<figure class="ghuser__avatar">
							<img src="${image}" alt="${name}'s avatar" />
						</figure>

						<div class="ghuser__meta">
							<p class="ghuser__meta--name">${name}</p>
							<p class="ghuser__meta--username">${login}</p>
							<p class="ghuser__meta--followers"><i>${followersCount}</i> followers</p>
							<p class="ghuser__meta--repos"><i>${repoCount}</i> public repos</p>
						</div>

						<div class="ghuser__repos">
							<p>Top 4 repositories:</p>

							<ol>
								<li>
									<a href="">Repo 1</a>
								</li>
								<li>
									<a href="">Repo 2</a>
								</li>
								<li>
									<a href="">Repo 3</a>
								</li>
								<li>
									<a href="">Repo 4</a>
								</li>
							</ol>
						</div>
					`;

					// Inject it
					ghuserWrapper.innerHTML = html;

					resolve();
				});
			})()

			await (() => {
				return new Promise<void>(resolve => {
					setTimeout(() => {
						ghuserWrapper.classList.remove('-inactive')
						resolve();
					}, 500)
				});
			})();
		})
		*/
	});
}
