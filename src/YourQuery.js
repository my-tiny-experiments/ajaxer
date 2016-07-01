// global names of the library.
var $, YQuery, YQ;

// keep track for all events.
var events = [];

// map every selector to its event.
var eventsMap = [];
/**
 * @return {function.}
 */
(function() {

    /**
     * initialize the global library name variables
     * so you can call it using them,
     * example : YQuery('#add').
     *          $('#add')
     *          YQ('#add')
     * @param  {selector}
     * @return {new instance of YourQuery}
     */
    YQuery = YQ = $ = function(selector, doc = document) {
        if (typeof(doc) == 'string') {
            var docObject = document.implementation.createHTMLDocument("New Document");
            var mainDiv = docObject.createElement("div");
            mainDiv.innerHTML = doc;
            docObject.body.appendChild(mainDiv);
            return new YourQuery(selector, docObject);
        }
        return new YourQuery(selector, doc);

    }

    /**
     * the class for the library.
     * @param {new Object.}
     */
    var YourQuery = function(selector, doc) {
        // selector is the (class, ID, tagName) provided.
        this.selector = selector;


        // if selector is an object.
        // as document. or any dom object.
        if (typeof(selector) != 'string') {
            this[0] = selector;
            this.length = 1;
            return this;
        } else {
            // get all elements by their selector.
            var nodes = doc.querySelectorAll(selector);
            // put the nodes in the object array.
            for (var i = 0; i < nodes.length; i++) {
                this[i] = nodes[i];
            }
            this.length = nodes.length;
            return this;
        }

    }

    /**
     * A plugin function to check if an item is in an array.
     * @param  {Array}
     * @param  {object}
     * @return {boolean}
     */
    var inArray = function(array, item) {
        if (array.indexOf(item) >= 0) {
            return true;
        }
        return false;
    }


    /**
     * apply the event on click on every item
     * in the event map.
     * and it keeps the onclick alive for every new item
     * in the DOM
     * @param  {event}
     * @return {void}
     */
    var clickEventDispatcher = function(e) {
        // get all defined classes of the given item ( e ).
        var itemClasses = e.target.classList || [];

        // if any class is in the eventMap. so apply its event.
        for (var i = 0; i < itemClasses.length; i++) {
            // get the index of the class in the eventsMap.
            var index = eventsMap.indexOf('.' + itemClasses[i]);
            console.log(events);
            if (index >= 0) {
                // get the callback from the events array.
                var callback = events[index].callback;
                callback(e.target);
            }

        }

        // check if the id of the item also has any event.
        var idIndex = eventsMap.indexOf('#' + e.target.id);
        if (idIndex >= 0) {
            var callback = events[idIndex].callback;
            callback(e.target);
        }
    }

    $.ajax = function(url, afterCallback, beforeCallback) {
        $().ajax(url, afterCallback, beforeCallback);
    };

    /**
     * defining the methods.
     * I use prototype in a variable, to make the library
     * pluginable. so I can add as much as I want of methods
     * from outside of the library itself.
     * @type {[type]}
     */
    YourQuery.YQfunction = YourQuery.prototype = {
        /**
         * hide with animation.
         * @param  {Number}
         * @param  {Function}
         * @return {$ object.}
         */
        animateHide: function(speed = 1000, callback = function() {}) {
            var opacity = 1;
            var element = this[0];

            // decrement the opacity by 0.08.
            function step() {
                // if element is hidden.
                if (opacity <= 0) {
                    clearInterval(stepInterval);
                    callback.call();
                }
                opacity -= 0.08;
                element.style.opacity = opacity;

            }

            /**
             * duration is to let the setInterval
             * run all decrements in the duration that the
             * user sends.
             *
             * @type {float}
             */
            var duration = speed * 0.08;
            var stepInterval = setInterval(step, duration);
            /**
             * return object of the element sent.
             * is to allow us to apply multiple
             * functions on this element.
             * as chaining example : ($this).hide().remove()...
             */
            return YQ(this[0]);
        },
        /**
         * remove element from the dom.
         * @return {object}
         */
        remove: function() {
            var element = this[0];
            element.remove(element);
            return $(this[0]);
        },
        /**
         * track onclick events.
         * save the event in event.
         * and its map to eventsMap.
         * @param  {Function}
         * @return {object}
         */
        onClick: function(callback) {
            events.push({
                selector: this.selector,
                event: 'click',
                callback: callback
            });
            eventsMap.push(this.selector);
            return $(this);
        },

        /**
         * create an event listener for onScroll
         * @param  {Function}
         * @return {null}
         */
        onScroll: function(callback) {
            for (var i = 0; i < this.length; i++) {
                this[i].addEventListener('scroll', callback);
            }
            return;
        },

        /**
         * get the parent of the given element.
         * @return {object}
         */
        parent: function() {
            return $(this[0].parentElement);
        },

        /**
         * slide up.
         * @param  {Number}
         * @param  {Function}
         * @return {object}
         */
        slideUp: function(speed = 1000, callback = function() {}) {
            var element = this[0];
            var height = element.offsetHeight;

            // remove the overflow from item.
            element.style.overflow = 'hidden';

            function step() {
                if (height <= 0) {
                    clearInterval(stepInterval);
                    element.remove(element);
                    callback.call();
                }
                height -= 1;
                element.style.height = height + 'px';

            }
            // get the duration to complete the slideUp.
            var duration = speed / height;
            var stepInterval = setInterval(step, duration);
            return $(this[0]);
        },

        /**
         * move item along x axis.
         * @param  {next x position}
         * @param  {Number}
         * @return {object}
         */
        removeX: function(x, speed = 1000, callback = function() {}) {
            var element = this[0];
            // element height, width , top.
            var height = element.offsetHeight;
            var width = element.offsetWidth;
            var top = element.offsetTop;

            // temp element to replaced by the old one
            // to keep the white space.
            var tempElement = document.createElement('DIV');
            tempElement.style.height = height + 'px';
            tempElement.style.position = 'relative';

            // insert the tempElement before the initial element.
            element.parentElement.insertBefore(tempElement, element);

            // set the intial top, width of the element.
            element.style.top = top + 'px';
            element.style.width = width + 'px';

            // change the position to absolute.
            element.style.position = "absolute";

            // initial position of the element.
            // start position.
            var initialPosition = element.offsetLeft;


            function step() {
                // if position is after x so move to left.
                if (initialPosition > x) {
                    initialPosition--;
                    // else move to right.
                } else if (initialPosition < x) {
                    initialPosition++;
                } else {

                    clearInterval(stepInterval);
                    callback.call();
                }
                // set the new position of the element.
                element.style.left = initialPosition + 'px';
            }
            // get the duration to complete the slideUp.
            //var duration = speed / ();
            var stepInterval = setInterval(step, 1);

            // slide up the tempElement.
            $(tempElement).slideUp(x, function() {
                // remove after finish
                $(tempElement).remove();
            });
            // slide up the element we are removing.
            $(element).slideUp(speed).animateHide(speed, function() {
                // remove after finish.
                $(element).remove();
            });




            return $(this[0]);
        },

        /**
         * create an element then add it after
         * the last element of the called object.
         * @param  {string}
         * @return {object}
         */
        append: function(text) {
            var element = this[0];
            // create a parent for the element.
            var el = document.createElement('div');
            // add the elements to it.
            el.innerHTML = text;
            // append the element from parent.
            element.appendChild(el.firstChild);
            return $(this[0]);
        },

        /**
         * insert is to add the element
         * at the top of the given object.
         * @param  {string}
         * @return {object}
         */
        insert: function(text) {
            var element = this[0];
            element.innerHTML = text + element.innerHTML;
            return $(this[0]);
        },

        /**
         * hide element.
         * @return {object}
         */
        hide: function() {
            var element = this[0];
            element.style.visibility = 'hidden';
            return $(this[0]);
        },

        /**
         * get the value of a form input.
         * @return {string}
         */
        value: function() {
            var element = this[0];
            return element.value;
        },

        /**
         * return the value of given attribute.
         * @param  {string}
         * @return {string}
         */
        attr: function(attribute) {
            var element = this[0];
            return element.getAttribute(attribute);
        },

        /**
         * check if document is loaded and ready.
         * @param  {Function}
         * @return {void}
         */
        ready: function(callback) {
            window.onload = function() {
                callback();

                /**
                 * to keep all on click events live
                 * we send any click to the event dispatcher.
                 */
                document.addEventListener('click', clickEventDispatcher, false);
            };
        },

        /**
         * get the value of scrollTop of an element.
         * @return {int}
         */
        scrollTop: function() {
            var element = this[0];
            return element.body.scrollTop;
        },

        /**
         * get the value of scrollBottom of an element.
         * @return {int}
         */
        scrollBottom: function() {
            var element = this[0];
            /**
             * to know the scrollBottom of an element
             * we have to get scrollTop + window height.
             */
            var scrollTop = element.body.scrollTop || element.documentElement.scrollTop;
            //console.log(element.documentElement.scrollTop + ' ' + window.innerHeight)
            return parseInt(scrollTop) + parseInt(window.innerHeight);
        },

        /**
         * get the offset top of an element.
         * @return {int}
         */
        top: function() {
            var element = this[0];
            return element.offsetTop;
        },

        /**
         * get the offsetBottom of an element.
         * @return {int}
         */
        bottom: function() {
            var element = this[0];
            return element.offsetBottom;
        },

        /**
         * get the height of an element.
         * @return {int}
         */
        height: function() {
            /**
             * if selector is string as '#'...
             * so we can return its offset Height.
             * else we get the window height.
             */
            if (typeof(this.selector) != 'object') {
                return this[0].offsetHeight;
            } else {
                return Math.max(
                    this[0].documentElement.clientHeight,
                    this[0].body.scrollHeight,
                    this[0].documentElement.scrollHeight,
                    this[0].body.offsetHeight,
                    this[0].documentElement.offsetHeight
                );
            }

        },
        /**
         * add a class to the className of the element.
         * @param  {string}
         * @return {void}
         */
        class: function(cls) {
            var element = this[0];
            var oldClasses = element.className;
            if (oldClasses.indexOf(cls) < 0) {
                element.className += ' ' + cls + ' ';
            }
            return $(this[0]);
        },
        removeClass: function(cls) {
            var element = this[0];
            var oldCalsses = element.className;
            var newClasses = oldCalsses.replace(cls, ' ');
            element.className = newClasses;
            return $(this[0]);
        },
        /**
         * set the text of an element.
         * @param  {string}
         * @return {void}
         */
        text: function(text = 'undefined') {
            var element = this[0];
            if (text == 'undefined') {
                return element.innerText;
            } else {
                element.innerHTML = text;
            }

        },
        /**
         * @return {[type]}
         */
        ajax: function(url, options = {}) {
            var urlData = '';
            var request = new XMLHttpRequest();

            if (options.type) {
                request.open(options.type, url, true);
            } else {
                request.open('GET', url, true);
            }
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            if (options.beforeCallback) {
                options.beforeCallback(request);
            }
            if (options.data) {
                var keys = Object.keys(options.data);
                for (var i = 0; i < keys.length; i++) {
                    urlData += keys[i] + '=' + options.data[keys[i]];
                    if (i < keys.length - 1) {
                        urlData += '&';
                    }
                }
                //urlData = encodeURIComponent(urlData);
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

        },
        each: function(callback) {
            for (var i = 0; i < this.length; i++) {
                callback(i, this[i]);
            }
        },
        stopDefaultClickEvent: function() {

            for (var i = 0; i < this.length; i++) {
                var element = this[i];
                element.addEventListener('click', stop, false)
            }

            function stop(e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        },

    };


}());