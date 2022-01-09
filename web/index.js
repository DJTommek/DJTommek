/**
 * On page load
 */
window.onload = function () {
	const toggleThemeEl = document.getElementById('toggle-theme');
	const birthDateEl = document.getElementById('birth-date');
	const ageEl = document.getElementById('age');

	const birthDate = new Date(parseInt(birthDateEl.dataset.birthDate));

	/** Calculate and update age in HTML */
	function calculateDetailedAge() {
		const diff = msToHuman((new Date()) - birthDate);
		birthDateEl.dataset.originalTitle = diff + ' ago';

		const age = Math.floor((new Date() - birthDate) / (365 * 24 * 60 * 60 * 1000));
		ageEl.textContent = '(' + age + ' years)';
	}

	calculateDetailedAge();

	// enable tooltips for all elements with title (use custom template because little arrow looks bad in dark theme)
	$('[title]').tooltip({template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'});

	/** Recalculate age just before opening birth date tooltip */
	$('#birth-date').on('show.bs.tooltip', function () {
		calculateDetailedAge();
	}).tooltip();

	/**
	 * Toggle dark theme icon
	 */
	toggleThemeEl.addEventListener('click', function (event) {
		event.preventDefault();
		const darkTheme = document.body.classList.contains('dark');
		if (darkTheme) {
			document.body.classList.remove('dark');
		} else {
			document.body.classList.add('dark');
		}
		try {
			localStorage.setItem('dark-theme', (!darkTheme).toString());
		} catch (error) {
			// Local storage is not working (disabled, unsupported, ...)
		}
	});
};

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
