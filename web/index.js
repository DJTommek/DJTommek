/**
 * On page load
 */
$(function () {
    calculateDetailedAge();
    // enable tooltips for all elements with title (use custom template because little arrow looks bad in dark theme)
  	$('[title]').tooltip({template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'});

    /**
     * Before opening tooltip on birth date
     */
    $('#birth-date').on('show.bs.tooltip', function () {
        calculateDetailedAge();
    }).tooltip();

    /**
     * Toggle dark theme icon
     */
    $('#toggle-theme').on('click', function (e) {
        e.preventDefault();
        const bodyEl = $('body');
        bodyEl.toggleClass('dark');
        try {
            localStorage.setItem("dark-theme", bodyEl.hasClass('dark').toString());
        } catch (error) {
            // Local storage is not working (disabled, unsupported, ...)
        }
    });
});

/**
 * Just calculate and update age, obviously...
 */
function calculateDetailedAge() {
    const baseElement = $('#birth-date');
    const birthDate = new Date(baseElement.text().trim());
    const diff = msToHuman((new Date()) - birthDate);
    baseElement.attr('data-original-title', diff + ' ago').tooltip();
    
    const age = Math.floor((new Date() - birthDate) / (365 * 24 * 60 * 60 * 1000));
    $('#age').text('(' + age + ' years)');  
}

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

/**
 * Return true if value is in array
 *
 * @param element
 * @returns {boolean}
 */
Array.prototype.inArray = function (element) {
	return (this.indexOf(element) >= 0)
};

/**
 * Pad string
 *
 * @param {int} len
 * @param {String} [chr] character to pad
 * @param {String} [dir] (left, both, right = default)
 * @returns {String}
 */
String.prototype.pad = String.prototype.pad || function (length, string, type)
{
	let str = this;

	// validation of length
	if (typeof length !== 'number' || length < 1) {
		throw new Error('Parameter "length" has to be positive number.')
	}

	// validation of string
	if (string === undefined) {
		string = ' ' // default character is space
	} else if (typeof string !== 'string' || string.length < 1) {
		throw new Error('Parameter "string" has to be string of non-zero length')
	}

	// validation of type (direction)
	const allowedTypes = ['left', 'right', 'both'];
	if (type === undefined) {
		type = 'right' // default type is 'right'
	} else if (allowedTypes.inArray(type) === false) {
		throw new Error('Parameter "type" has to be "' + allowedTypes.join('" or "') + '".')
	}

	const repeat = function (c, l) { // inner "character" and "length"
		let repeat = '';
		while (repeat.length < l) {
			repeat += c;
		}
		return repeat.substr(0, l);
	};

	const diff = length - str.length;
	if (diff > 0) {
		switch (type) {
			case 'left':
				str = '' + repeat(string, diff) + str;
				break;
			case 'both':
				const half = repeat(string, Math.ceil(diff / 2));
				str = (half + str + half).substr(0, length);
				break;
			case 'right': // and "right"
				str = '' + str + repeat(string, diff);
		}
	}
	return str;
};
