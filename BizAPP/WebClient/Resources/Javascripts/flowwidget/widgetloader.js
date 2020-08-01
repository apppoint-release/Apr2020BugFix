"use strict;"

var me = document.currentScript
	? document.currentScript
	: document.querySelector('script[data-id][data-name="bza_widget"]')

var widgetId = me.getAttribute('data-id')
var scriptUrl = me.getAttribute('src')
var widgetServerUrl = scriptUrl.substr(0, scriptUrl.indexOf('/resources/')) + '/'
var widgetPosition = me.getAttribute('data-triggerbtn-position')
if (!widgetPosition) {
	widgetPosition = 'bottom-right'
}

var widgetPostHeaders = []
me.getAttributeNames().forEach(function (aName) {
	if (aName.toLowerCase().startsWith('data-x-')) {
		widgetPostHeaders.push({
			name: aName.substr(5),
			value: me.getAttribute(aName)
		})
	}
})

var BizAPP = BizAPP || {};
BizAPP.FlowWidget = class FlowWidget {
	_loadScript(url) {
		return new Promise(function (resolve, reject) {
			var newScript = document.createElement("script");
			newScript.onload = function () { resolve() }
			newScript.onerror = function (error) { reject(error) }
			document.body.appendChild(newScript);
			newScript.src = url;
		})
	}
	_loadStyle(url) {
		return new Promise(function (resolve, reject) {
			var link = document.createElement("link");
			link.type = 'text/css';
			link.rel = 'stylesheet';
			link.onload = function () { resolve() }
			link.onerror = function (error) { reject(error) }
			document.head.appendChild(link);
			link.href = url;
		})
	}

	showWidget(args) {
		const that = this
		const { widgetServerUrl, widgetId, widgetPosition, widgetPostHeaders, additionalPostValues } = args
		if (widgetId && widgetServerUrl) {
			Promise.all([
				that._loadScript(widgetServerUrl + 'resources/javascripts/vue.min.js'),
				that._loadScript(widgetServerUrl + 'resources/javascripts/httpvueloader.js'),
				that._loadStyle('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/fontawesome.min.css'),
				that._loadStyle('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/solid.min.css'),
				that._loadStyle(widgetServerUrl + 'resources/javascripts/flowwidget/vfg-core.css'),
				that._loadScript(widgetServerUrl + 'resources/javascripts/flowwidget/vfg.js'),
			])
				.then(_ => {

					// create a mock container for vue
					var vueComponentContainer = document.body.appendChild(document.createElement('section'))

					// let vue do its thing...
					new Vue({
						el: vueComponentContainer,
						template: '<widget :serverurl="serverUrl" :widgetid="widgetId" :widgetpostheaders="widgetPostHeaders" :widgetposition="widgetPosition" :additionalpostvalues="additionalPostValues"></widget>',
						components: {
							'widget': httpVueLoader(widgetServerUrl + 'resources/javascripts/flowwidget/widget.vue')
						},
						data() {
							return {
								serverUrl: widgetServerUrl,
								widgetId: widgetId,
								widgetPostHeaders: widgetPostHeaders,
								widgetPosition: widgetPosition,
								additionalPostValues: additionalPostValues
							}
						}
					});
				})
				.catch(error => {
					console.log("ERROR LOADING SCRIPT - ", error)
				})
		} else {
			console.log('WIDGET: could not find widget configuration in script, so ignoring all errors')
		}
	}
}

// If have all the information, trigger it...
if (widgetServerUrl && widgetId) {
	new BizAPP.FlowWidget()
		.showWidget({
			widgetServerUrl,
			widgetId,
			widgetPosition,
			widgetPostHeaders,
			//additionalPostValues: [
			//	{ name: '%currentuser%', value: 'someid' }
			//]
		})
}
