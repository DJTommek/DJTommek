/**
 * On page load
 */
document.addEventListener('DOMContentLoaded', function () {
	const toggleThemeEl = document.getElementById('toggle-theme');
	const birthDateEl = document.getElementById('birth-date');
	const ageEl = document.getElementById('age');

	const birthDate = new Date(parseInt(birthDateEl.dataset.birthDate));

	/** Calculate and update age in HTML */
	function updateAge() {
		const diff = Date.now() - birthDate;
		const age = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
		ageEl.textContent = '(' + age + ' years)';
	}

	updateAge();

	// Tooltips for all elements with title (use custom template without arrow, because little arrow looks bad in dark theme)
	const tooltipTemplate = '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>';
	for (const element of document.querySelectorAll('[title]')) {
		const options = {template: tooltipTemplate};
		if (element === birthDateEl) {
			// Detailed age is recalculated every time tooltip is about to be shown
			options.title = function () {
				return msToHuman(Date.now() - birthDate) + ' ago';
			};
		}
		bootstrap.Tooltip.getOrCreateInstance(element, options);
	}

	/**
	 * Toggle dark theme icon
	 */
	toggleThemeEl.addEventListener('click', function (event) {
		event.preventDefault();
		const darkTheme = document.body.classList.toggle('dark');
		try {
			localStorage.setItem('dark-theme', darkTheme.toString());
		} catch (error) {
			// Local storage is not working (disabled, unsupported, ...)
		}
	});

	/** Create click handler for .copy-to-clipboard elements */
	for (const element of document.getElementsByClassName('copy-to-clipboard')) {
		const tooltip = bootstrap.Tooltip.getOrCreateInstance(element);
		const originalTitle = element.getAttribute('data-bs-original-title');

		element.addEventListener('hidden.bs.tooltip', function () {
			tooltip.setContent({'.tooltip-inner': originalTitle});
		});

		element.addEventListener('click', async function (event) {
			event.preventDefault();
			let message;
			try {
				await navigator.clipboard.writeText(element.dataset.toCopy);
				message = 'Copied!';
			} catch (error) {
				message = 'Couldn\'t copy to clipboard.';
			}
			tooltip.setContent({'.tooltip-inner': message});
			tooltip.show();
		});
	}
});

/**
 * Convert miliseconds to short human readable format
 *
 * @param {number} miliseconds
 * @returns {String}
 */
function msToHuman(miliseconds) {
	if (typeof miliseconds !== 'number' || miliseconds < 0) {
		throw new Error('Parameter "miliseconds" has to be positive number.');
	}
	if (miliseconds === 0) {
		return '0ms';
	}

	const milliseconds = Math.floor((miliseconds) % 1000);
	const seconds = Math.floor((miliseconds / 1000) % 60);
	const minutes = Math.floor((miliseconds / (1000 * 60)) % 60);
	const hours = Math.floor((miliseconds / (1000 * 60 * 60)) % 24);
	const days = Math.floor((miliseconds / (1000 * 60 * 60 * 24)) % 30);
	const months = Math.floor((miliseconds / (1000 * 60 * 60 * 24 * 30.4366)) % 12);
	const years = Math.floor((miliseconds / (1000 * 60 * 60 * 24 * 365.24)));

	let result = '';
	result += (years > 0 ? ' ' + years + 'y' : '');
	result += (months > 0 ? ' ' + months + 'mo' : '');
	result += (days > 0 ? ' ' + days + 'd' : '');
	result += (hours > 0 ? ' ' + hours + 'h' : '');
	result += (minutes > 0 ? ' ' + minutes + 'mi' : '');
	result += (seconds > 0 ? ' ' + seconds + 's' : '');
	result += (milliseconds > 0 ? ' ' + milliseconds + 'ms' : '');
	return result.trim();
}
