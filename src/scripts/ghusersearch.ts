import {fetchGet} from './fetch';
import gsap from 'gsap'

export class GHUserSearch {
	public root: any;
	public apiUrl: string | undefined;
	public searchString: string | undefined;
	public userData: any;
	public messageWrapper: any;
	public messageString: string | undefined;
	public messageStatus: string | undefined;
	public animSpeed: number | undefined;
	public animFunc: string | undefined;
	public card: any;
	public input: any;
	public button: any;

	constructor(element: any) {
		if (!element) return

		this.root = element;
		this.apiUrl = "https://api.github.com/users/";
		this.searchString = '';
		this.userData = false;

		this.messageWrapper = this.root.querySelector('.field__messages');
		this.messageString = '';
		this.messageStatus = 'info';

		this.card = this.root.querySelector('.ghuser__card');
		this.input = this.root.querySelector('input');
		this.button = this.root.querySelector('button');

		this.animSpeed = 0.5;
		this.animFunc = 'power3.out';

		this.init();
	}

	public init() {
		const storedData = localStorage.getItem('ghdata') ?? null;

		if (storedData) {
			this.userData = JSON.parse(storedData);
			this.populateCard();
			this.showCard();
		}

		this.input.addEventListener("keyup", (e: { code: string; }) => {
			if (e.code === 'Enter') {
				this.button.click();
			}
		});

		this.button.addEventListener('click', async () => {
			if (this.button.classList.contains('-loading')) return;

			this.searchString = this.input.value;

			// Remove any messages currently displayed
			this.resetMessage();

			// Empty string? Can't do much with that
			if (!this.searchString || this.searchString == '') {
				this.messageString = 'Username required. Obviously. 😒';
				this.messageStatus = 'error';
				await this.displayMessage();
				return;
			}

			// Already displaying that user? Save on API requests then
			if (this.searchString === this.userData.login) {
				this.messageString = 'Already displaying this users details';
				this.messageStatus = 'info';
				await this.displayMessage();
				return;
			}

			this.button.classList.add('-loading');

			// Reset data
			this.userData = false;

			// Perform the fetch using our custom function
			await fetchGet(this.apiUrl + this.searchString)
				.then(async (data: { message: string; name: null; login: any; followers: any; public_repos: any; avatar_url: any; }) => {
					// No user? output a message and kill it
					if (data.message === 'Not Found') {
						this.hideCard();
						await this.resetMessage();
						this.messageStatus = 'error';
						this.messageString = 'User not found 😖';
						await this.displayMessage();
						return;
					}

					// Store the data
					this.userData = data;
				})
				.catch(async (error: string) => {
					console.error('Error finding user: ' + error);
					this.messageString = error;
					this.messageStatus = 'error';
					this.hideCard();
					await this.resetMessage();
					await this.displayMessage();
				});

			// Populate and show the card if there is data
			if (this.userData) {
				await fetchGet(`https://api.github.com/users/${this.searchString}/repos?sort=updated&direction=desc&per_page=4&page=1`)
					.then(async (data) => {
						this.userData._repos = data;
						this.button.classList.remove('-loading');

						this.setStorage();
					})
					.catch(async (error: string) => {
						console.error('Error finding repos: ' + error);
						this.messageString = error;
						this.messageStatus = 'error';
						this.hideCard();
						await this.resetMessage();
						await this.displayMessage();
					});

				// Wait until we've successfully retrieved the data
				await this.hideCard();
				await this.populateCard();
				await this.showCard();
			}
			else {
				this.button.classList.remove('-loading');
			}
		});
	}

	public resetMessage() {
		return new Promise<void>(resolve => {
			this.messageString = '';
			this.messageStatus = 'info';

			if (this.messageWrapper.querySelectorAll('p').length) {
				this.messageWrapper.querySelectorAll('p').forEach((el: any) => {
					gsap.to(el, {
						duration: this.animSpeed,
						ease: this.animFunc,
						opacity: 0,
						y: 10,
						onComplete: () => {
							el.remove();
							resolve();
						}
					});
				});
			}
			else {
				resolve();
			}
		});
	}

	public displayMessage() {
		return new Promise<void>(resolve => {

			gsap.set(this.messageWrapper, {
				opacity: 0,
				y: 10
			});

			const html = `<p class="field__messages--${this.messageStatus}">${this.messageString}</p>`;
			this.messageWrapper.innerHTML = html;

			gsap.to(this.messageWrapper, {
				duration: this.animSpeed,
				ease: this.animFunc,
				delay: 0.25,
				opacity: 1,
				y: 0,
				onComplete: () => {
					resolve();
				}
			});
		});
	}

	public populateCard() {
		return new Promise<void>(resolve => {
			// Store the data and define fallbacks
			const name = this.userData.name ?? 'Not found';
			const login = this.userData.login ?? 'Not found';
			const followersCount = this.userData.followers ?? 'Not found';
			const repoCount = this.userData.public_repos ?? 'Not found';
			const image = this.userData.avatar_url ?? "https://picsum.photos/id/237/100/100";

			// The structured data
			const html = `
				<figure class="ghuser__avatar">
					<img src="${image}" alt="${name}'s avatar" />
				</figure>

				<div class="ghuser__meta">
					<p class="ghuser__meta--name">${name}</p>
					<p class="ghuser__meta--username">${login}</p>
					<p class="ghuser__meta--count">${followersCount} <i>followers</i></p>
					<p class="ghuser__meta--count">${repoCount} <i>public repos</i></p>
				</div>

				<div class="ghuser__repos">
					<p>Latest repositories:</p>
					<ol></ol>
				</div>
			`;

			// Inject it
			this.card.innerHTML = html;

			// Add top 4 repos to list
			for (let index = 0; index < this.userData._repos.length; index++) {
				if (index == 4) break;

				const el = this.userData._repos[index];
				const li = document.createElement('li');
				const a = document.createElement('a');
				a.setAttribute('href', el.html_url);
				a.innerText = el.name;
				li.appendChild(a);
				this.card.querySelector('ol').appendChild(li);
			}

			resolve();
		});
	}

	public showCard() {
		return new Promise<void>(resolve => {
			this.card.classList.remove('-inactive');
			setTimeout(() => {
				resolve();
			}, 500);
		});
	}

	public hideCard() {
		return new Promise<void>(resolve => {
			this.card.classList.add('-inactive');
			setTimeout(() => {
				this.card.innerHTML = '';
				resolve();
			}, 500);
		});
	}

	public setStorage() {
		localStorage.setItem('ghdata', JSON.stringify(this.userData));
	}
}
