/*
** validator.js - v1.0.0 - 2018-10-27
** Copyright (c) 2018 David Chinchin;
** Licensed ISC 
*/

(function(){
	var countErrors = 0,
		css = 'font-size: 15px;color: red;margin-top: 5px;display: block';
	var _validators = {},
		defaultMessage = {
			required: 'This field is required.',
			number: 'This field accept only numbers.',
			letters: 'This field accept only letters.',
			email: 'Email format is wrong.',
			_default: 'This field have one error.'
		};
	
	_validators.required = function(object) {
		validateTemplate(object, 'required', function (value) {
			return value ? true : false;
		});
	};
	
	_validators.number = function(object) {
		validateTemplate(object, 'number', function (value) {
			return !isNaN(value);
		});
	};
	
	_validators.letters = function(object) {
		var patter = /^[A-Za-z]+$/;
		validateTemplate(object, 'letters', function (value) {
			return value.match(patter);
		});
	};

	_validators.email = function(object) {
		var patter = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		validateTemplate(object, 'email', function (value) {
			return value.match(patter);
		});
	};
	
	function execCustomValidate(object) {
		validateTemplate(object, '_default', object.fn);
	}
	
	function validateTemplate(object, messageDefault, fn) {
		for(var i = 0, x = object.fields.length; i < x; i += 1) {
			var el = getEl(object.fields[i]);
			if (!fn(el.value)) {
				var message = typeof object.messages !== 'undefined' && object.messages[i] ? object.messages[i] : defaultMessage[messageDefault];
				displayErrors(el, message);
				countErrors += 1;
			}
		}
	}
	
	function displayErrors(el, message) {
		var errorEl = createEl('span', message);
		insertBefore(el, errorEl);
	}
	
	function createEl(el, message) {
		var _el = document.createElement(el);
		_el.className = '_validate_forms_';
		_el.textContent = message;
		_el.style.cssText = css;
		return _el;
	}
	
	function getEl(id) {
		return document.querySelector(id);
	}
	
	function insertBefore(el, before) {
		var parent = el.parentNode;
		parent.insertBefore(before, el.nextSibling);
	}
	
	function clearErrors() {
		var errors = document.querySelectorAll('._validate_forms_');
		errors = Object.values(errors);
		errors.forEach(function(el) {
			var parent = el.parentNode;
			parent.removeChild(el);
		});
	}
	
	function validator(object) {
		if (typeof object !== 'object') {
			return new Error('Parameter for validate is only object');
		}
		countErrors = 0;
		clearErrors();
		for(var i in object) {
			if (object.hasOwnProperty(i) && _validators.hasOwnProperty(i)) {
				_validators[i](object[i]);
			} else if (typeof object[i] === 'object' && typeof object[i].fn === 'function') {
				execCustomValidate(object[i]);
			}
		}
		
		return countErrors === 0 ? true : false;
	}
	
	window.Validator = function (options) {
		if (options) {
			for(var i in options) {
				if (options.hasOwnProperty(i) && defaultMessage.hasOwnProperty(i)) {
					defaultMessage[i] = options[i];
				}
			}
		}
		return validator;
	};
})();
