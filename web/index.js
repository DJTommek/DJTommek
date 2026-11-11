/**
 * On page load
 */
document.addEventListener('DOMContentLoaded', function () {
	const toggleThemeEl = document.getElementById('toggle-theme');

	// Tooltips for all elements with title (use custom template without arrow, because little arrow looks bad in dark theme)
	const tooltipTemplate = '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>';
	for (const element of document.querySelectorAll('[title]')) {
		bootstrap.Tooltip.getOrCreateInstance(element, {template: tooltipTemplate});
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
