Ext.define('Jarvus.ext.override.app.ControllerRouting', (function() {

    var paramMatchingRegex = new RegExp(/:([0-9A-Za-z\_]*)/g),
        routes = [],
        routesLength;

    return {
        override: 'Ext.app.Application',
        requires: [
            'Ext.util.History'
        ],

        onBeforeLaunch: function() {
            var me = this,
                suspendLayoutUntilInitialRoute = me.suspendLayoutUntilInitialRoute,
                History = Ext.util.History,
                controllers, c = 0, cLength,
                controller, controllerRoutes, url, route, paramsInMatchString, conditions, matcherRegex, p, pLength, param, config;
                
            if (suspendLayoutUntilInitialRoute) {
                Ext.suspendLayouts();
            }

            me.callParent(arguments);

            // initialize routes list from controllers
            controllers = me.controllers.items;
            cLength = controllers.length;

            for (; c < cLength; c++) {
                controller = controllers[c];
                controllerRoutes = controller.routes;

                if (Ext.isObject(controllerRoutes)) {
                    for (url in controllerRoutes) {
                        route = controllerRoutes[url];
                        paramsInMatchString = url.match(paramMatchingRegex) || [];
                        conditions = route.conditions || {};
                        matcherRegex = url;

                        for (p = 0, pLength = paramsInMatchString.length; p < pLength; p++) {
                            param = paramsInMatchString[p];
                            matcherRegex = matcherRegex.replace(param, '(' + (conditions[param] || '[%a-zA-Z0-9\-\\_\\s,]+') + ')');
                        }

                        config = {
                            url: url,
                            controller: controller,
                            matcherRegex: new RegExp('^' + matcherRegex + '$')
                        };

                        if (Ext.isString(route)) {
                            config.action = route;
                        } else {
                            Ext.apply(config, route);
                        }

                        routes.push(config);
                    }
                }
            }

            routesLength = routes.length;

            // initialize history and attach to events
            History.on('change', 'onHistoryChange', me);
            History.init(function() {
                var token = History.getToken();

                if (token) {
                    me.onHistoryChange(token);
                }
                
                if (suspendLayoutUntilInitialRoute) {
                    Ext.resumeLayouts(true);
                }
            });
        },

        onHistoryChange: function(token) {
            var i = 0,
                route, result, controller;

            for(; i < routesLength; i++) {
                route = routes[i];
                result = token.match(route.matcherRegex);

                if(result) {
                    result.shift();
                    controller = route.controller;

                    if (!Ext.isFunction(controller[route.action])) {
                        Ext.log.warn('Function "'+route.action+'" not defined in controller "'+controller.$className+'" for route "'+route.url+'"');
                    }

                    controller[route.action].apply(controller, result);
                }
            }
        },

        redirectTo: function(url) {
            Ext.util.History.add(url, true);
        }
    };
})(), function() {
    // add alias to controller
    this.superclass.redirectTo = this.prototype.redirectTo;
});

Ext.define('Jarvus.ext.override.util.EncodedHistory', {
    override: 'Ext.util.History',

    add: function(token, preventDup) {

        if (Ext.data && Ext.data.Model && token instanceof Ext.data.Model && Ext.isFunction(token.toUrl)) {
            token = token.toUrl();
        }

        if (Ext.isArray(token)) {
            token = Ext.Array.map(token, this.encodeRouteComponent).join('/');
        }

        return this.callParent([token, preventDup]);
    },

    /**
     * URL-encode any characters that would could fail to pass through a hash path segment

     * @param {String} string The string to encode
     * @return {String} The encoded string
     */
    encodeRouteComponent: function(string) {
        return encodeURIComponent(Ext.isObject(string) ? Ext.Object.toQueryString(string) : (string||'')).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%20/g, '+');
    },

    /**
     * URL-decode any characters that encodeRouteComponent encoded

     * @param {String} string The string to decode
     * @return {String} The decoded string
     */
    decodeRouteComponent: function(string) {
        return decodeURIComponent((string||'').replace(/\+/g, ' '));
    }
});

Ext.define('Jarvus.ext.override.util.InstantHistory', {
    override: 'Ext.util.History',

    // instantly update state
    setHash: function(hash) {
        this.callParent([hash]);
        this.handleStateChange(hash);
    },
    
    // force prevention of duplicate events
    handleStateChange: function(token) {   
        if(this.currentToken != token) {
            this.callParent([token]);
        }
    }
});

/*jslint browser: true, undef: true, white: false, laxbreak: true *//*global Ext*/

/**
 * Provides {@link #method-pushPath} for controllers
 */
Ext.define('Jarvus.ext.override.util.PushHistory', {
    override: 'Ext.util.History'

    ,pageTitleSeparator: ' &mdash; '

    /**
     * Silently push a given path to the address bar without triggering a routing event.
     * This is useful to call after a user has _already_ entered a UI state and the current address
     * _may_ need to be synchronized. If the given path was already in the address bar this method
     * has no effect.
     *
     * @param {String/String[]/Ext.data.Model} url The url path to push
     */
    ,pushPath: function(url, title) {
        var me = this
            ,titleDom = me.pageTitleDom
            ,titleBase = me.pageTitleBase;

        if(title) {
            if(!titleDom) {
                titleDom = me.pageTitleDom = document.querySelector('title');
                titleBase = me.pageTitleBase = titleDom.innerHTML;
            }

            titleDom.innerHTML = title + me.pageTitleSeparator + titleBase;
        }

        Ext.util.History.add(url, true);
    }
});

