(function(){
	let countErrors = 0;
	const _validators = {},
		arrayReturn = [],
		defaultMessage = {
			required: 'This field is required',
			number: 'This field accept only numbers',
			letters: 'This field accept only letters',
			_default: 'Exists one error in this field'
		};
	
	_validators.required = function(object) {
		validateTemplate(object, 'required', function (value) {
			return value ? true : false;
		});
	}
	
	_validators.number = function(object) {
		validateTemplate(object, 'number', function (value) {
			return !isNaN(value);
		});
	}
	
	_validators.letters = function(object) {
		const letters = /^[A-Za-z]+$/;
		validateTemplate(object, 'letters', function (value) {
			return value.match(letters);
		});
	}
	
	function execCustomValidate(object) {
		validateTemplate(object, '_default', object.fn);
	}
	
	function validateTemplate(object, messageDefault, fn) {
		for(let i = 0, x = object.fields.length; i < x; i += 1) {
			let el = getEl(object.fields[i]);
			if (!fn(el.value)) {
				let message = typeof object.messages !== 'undefined' && object.messages[i] ? object.messages[i] : defaultMessage[messageDefault];
				displayErrors(el, message);
				countErrors += 1;
			}
		}
	}
	
	function displayErrors(el, message) {
		const errorEl = createEl('span', message);
		insertBefore(el, errorEl);
	}
	
	function createEl(el, message) {
		const _el = document.createElement(el);
		_el.className = '_validate_forms_';
		_el.textContent = message;
		return _el;
	}
	
	function getEl(id) {
		return document.querySelector(id);
	}
	
	function insertBefore(el, before) {
		const parent = el.parentNode;
		parent.insertBefore(before, el.nextSibling);
	}
	
	function clearErrors() {
		let errors = document.querySelectorAll('._validate_forms_');
		errors = Object.values(errors);
		errors.forEach(function(el) {
			let parent = el.parentNode;
			parent.removeChild(el);
		});
	}
	
	function validator(object) {
		if (typeof object !== 'object') {
			return new Error('Parameter for validate is only object');
		}
		countErrors = 0;
		clearErrors();
		for(let i in object) {
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
			for(let i in options) {
				if (options.hasOwnProperty(i) && defaultMessage.hasOwnProperty(i)) {
					defaultMessage[i] = options[i];
				}
			}
		}
		return validator;
	}
})();
