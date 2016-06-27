
function equal_type(a, b) {
	// I'm so sorry
	return JSON.stringify(a) === JSON.stringify(b);
}

function is_vanilla_object(input) {
	if ("[object Object]" === Object.prototype.toString.call(input)) {
		if (Object.getOwnPropertyNames(input).length === Object.keys(input).length) {
			return true;
		}
	}
	return false;
}

function array_contains_type(types, potential_type) {
	types.forEach(function(type) {
		if (equal_type(potential_type, type)) {
			return true;
		}
	});
	return false;
}

function return_array_type(input) {
	var current_type = null;
	input.forEach(function(element) {
		var type_of_element = return_type(element);
		if (null === current_type) {
			current_type = type_of_element;
			return;
		}
		if (current_type instanceof Array) {
			if (array_contains_type(current_type, type_of_element)) {
				return;
			} else {
				current_type.push(type_of_element);
				return;
			}
		}
		// if for aesthetic reasons
		// current type is still a "single" type
		if (true) {
			if (equal_type(current_type, type_of_element)) {
				return;
			} else {
				current_type = [current_type, type_of_element];
			}
		}
	});
	if (null === current_type) {
		current_type = "empty";
	}
	return {array: current_type};
}

function return_type(input) {
	if ("number" === typeof input) {
		return "number";
	}
	if ("boolean" === typeof input) {
		return "boolean";
	}
	if ("string" === typeof input) {
		return "string";
	}
	if ("function" === typeof input) {
		// do some magic here
		return "function";
	}
	if (input instanceof Array) {
		return return_array_type(input);
	}

	if (is_vanilla_object(input)) {
		var types = {};
		Object.keys(input).forEach(function(key) {
			types[key] = return_type(input[key]);
		});
		return {object: types};
	}
	if (null === input) {
		return "null";
	}
	if (undefined === input) {
		console.log("allegedly undefined: ", input);
		return "undefined";
	}

	var text = Function.prototype.toString.call(input.constructor);
	return text.match(/function (.*)\(/)[1];
	// return "what the fuck is this garbage";
}

module.exports = return_type;
