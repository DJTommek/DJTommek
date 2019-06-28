/**
 * On page load
 */
$(function () {
    $('#birth-date').tooltip();
    calculateDetailedAge();
});
/*
 * Before opening tooltip on birth date
 */
$('#birth-date').on('show.bs.tooltip', function () {
    calculateDetailedAge();
});

/**
 * Toggle dark theme
 */
$('#toggle-theme').on('click', function (e) {
    e.preventDefault();
    $('body').toggleClass('dark');
    try {
        localStorage.setItem("dark-theme", $('body').hasClass('dark'));
    } catch (error) {
        // Local storage is not working (disabled, unsupported, ...)
    }
});

/**
 * Just calculate and update age, obviously...
 */
function calculateDetailedAge() {
    var baseElement = $('#birth-date');
    var birthDate = new Date(baseElement.text().trim());
    var diff = new Date() - birthDate;
    console.log(diff);
    var diff = msToHuman(diff);
    console.log(diff);
    baseElement.attr('data-original-title', diff + ' ago').tooltip();
    
    var age = Math.floor((new Date() - birthDate) / (365 * 24 * 60 * 60 * 1000));
    $('#age').text('(' + age + ' years)');  
}


/**
 * Convert miliseconds to short human readable format 
 * 
 * @param {number} miliseconds
 * @returns {String}
 */
function msToHuman(miliseconds) {
	var milliseconds =	Math.floor((miliseconds)                               %1000);
	var seconds =		Math.floor((miliseconds / (1000)                    )  %60  );
	var minutes =		Math.floor((miliseconds / (1000*60)                 ) %60	);
	var hours =			Math.floor((miliseconds / (1000*60*60)              ) %24	);
	var days =			Math.floor((miliseconds / (1000*60*60*24)           ) %30	);
    var months =        Math.floor((miliseconds / (1000*60*60*24*30.4366)   ) %12   );
    var years =         Math.floor((miliseconds / (1000*60*60*24*365.24)    )       );

    var result = '';
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
 *
 * @param {int} len
 * @param {String} chr character to pad
 * @param {String} dir (left, both, right)
 * @returns {String}
 */
String.prototype.pad = String.prototype.pad || function(len, chr, dir)
{
	var str = this;
	len = (typeof len === 'number') ? len : 0;
	chr = (typeof chr === 'string') ? chr : ' ';
	dir = (/left|right|both/i).test(dir) ? dir : 'right';
	var repeat = function(c, l) { // inner "character" and "length"
		var repeat = '';
		while (repeat.length < l) {
			repeat += c;
		}
		return repeat.substr(0, l);
	}
	var diff = len - str.length;
	if (diff > 0) {
		switch (dir) {
			case 'left':
				str = '' + repeat(chr, diff) + str;
				break;
			case 'both':
				var half = repeat(chr, Math.ceil(diff / 2));
				str = (half + str + half).substr(1, len);
				break;
			default: // and "right"
				str = '' + str + repeat(chr, diff);
		}
	}
	return str;
};

/**
 * Return standardized format
 * 
 * @param {boolean} returnObject - you can get array instead string
 */
Date.prototype.human = function (returnObject) {
    var res = {
        milisecond: (this.getMilliseconds() + '').pad(3, '0', 'left') + '',
        second: (this.getSeconds() + '').pad(2, '0', 'left') + '',
        minute: (this.getMinutes() + '').pad(2, '0', 'left') + '',
        hour: (this.getHours() + '').pad(2, '0', 'left') + '',
        day: (this.getDate() + '').pad(2, '0', 'left') + '',
        month: (this.getMonth() + 1 + '').pad(2, '0', 'left') + '',
        year: (this.getFullYear() + '').pad(2, '0', 'left') + ''
    }
    res.date = res.year + '.' + res.month + '.' + res.day;
    res.time = res.hour + ':' + res.minute + ':' + res.second;
    res.toString = function () {
        return (res.date + ' ' + res.time + '.' + res.milisecond);
    }
    if (returnObject === true) {
        return res;
    } else {
        return res + '';
    }
}