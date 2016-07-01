(function() {

	// main attribute for Ajaxer.
	var axerAttrib = 'axer';

	/**
	 * axer attributes
	 * 
	 * @type {Object}
	 */
	var attribs = {
		// return the action attrib
		action: function(element) {
			return element.getAttribute(axerAttrib + '-action') || null;
		},

		// return the result attrib
		result: function(element) {
			return element.getAttribute(axerAttrib + '-action-result') || null;
		},

		// return the loading attrib
		loading: function(element) {
			return element.getAttribute(axerAttrib + '-loading') || null;
		},

		// return the redirect element
		redirect: function(element) {
			return element.getAttribute(axerAttrib + '-redirect') || null;
		},

		// return the before attrib
		before: function(element) {
			return element.getAttribute(axerAttrib + '-before') || null;
		},

		// return the after attrib
		after: function(element) {
			return element.getAttribute(axerAttrib + '-after') || null;
		},
	};

	/**
	 * ajax request.
	 * 
	 * @param  {[type]} url     [description]
	 * @param  {Object} options [description]
	 * @return {[type]}         [description]
	 */
	var ajax = function(url, options = {}) {
		var urlData = '';
		var request = new XMLHttpRequest();

		// if type is given.
		if(options.type) {
			request.open(options.type, url, true);
		} else {
			request.open('GET', url, true);
		}
		// set default header.
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		
		// if before callback is given
		if(options.beforeCallback) {
			options.beforeCallback(request);
		}

		// form data.
		if(options.data) {
			var keys = object.keys(options.data);
			for (var i = 0; i < keys.length; i++) {
                urlData += keys[i] + '=' + options.data[keys[i]];
                if (i < keys.length - 1) {
                    urlData += '&';
                }
            }
		}

		request.onreadystatechange = function() {
            if (this.readyState == 4 && request.status == 200) {
                if (options.afterCallback) {
                    options.afterCallback(this.responseText);
                }

            }
        }

        if (urlData) {
            request.send(urlData);
        } else {
            request.send();
        }
	}

	

	/**
	 * call is the function that do the action 
	 * for the axer element.
	 * 
	 * @param  {object} form [description]
	 * @return {void}      [description]
	 */
	var call = function(form) {
		var action = attribs.action(form);
		var after = attribs.after(form);
		var result = attribs.result(form);
		var loading = attribs.loading(form);
		if(action) {
			var options = {};

			options.beforeCallback = function() {
				console.log(loading);
				if(loading) {
					document.getElementById(loading).style.display = 'block';
				} else {

				}
			}

			if(attribs.after(form)) {
				options.afterCallback = function(data) {
					window[after](data);
					if (loading) {
						document.getElementById(loading).style.display = 'none';
					}
				}
			} else if(result) {
				options.afterCallback = function(data) {
					var res = document.getElementById(result);
					res.innerHTML = data;
					if (loading) {
						document.getElementById(loading).style.display = 'none';
					}
				}
			}




			ajax(action,options);
		}
	}

	/**
	 * Prevent default submit of a form.
	 * 
	 * @param  {[type]} form [description]
	 * @return {[type]}      [description]
	 */
	var preventSubmit = function(form) {
		form.onsubmit = function() {
			call(form);
			return false ;
		}
	}

	/**
	 * ajaxer main function.
	 * 
	 * @return {void} [description]
	 */
	var axer = function() {
		var forms = document.getElementsByTagName('form')
		for(var i = 0 ; i < forms.length ; i++) {
			if (forms[i].hasAttribute(axerAttrib)) {
				preventSubmit(forms[i]);
			}
		}
	}();

	

}());