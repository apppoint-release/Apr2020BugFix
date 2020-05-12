"use strict;"

var me = document.currentScript
	? document.currentScript
	: document.querySelector('script[data-id][data-name="bza_widget"]')

var widgetId = me.getAttribute('data-id')
var scriptUrl = me.getAttribute('src')
var widgetServerUrl = scriptUrl.substr(0, scriptUrl.indexOf('/resources/')) + '/'
var widgetPostHeaders = []
var widgetPosition = me.getAttribute('data-triggerbtn-position')
if (!widgetPosition) {
	widgetPosition = 'bottom-right'
}

me.getAttributeNames().forEach(function (aName) {
	if (aName.toLowerCase().startsWith('data-x-')) {
		widgetPostHeaders.push({
			header: aName.substr(5),
			value: me.getAttribute(aName)
		})
	}
})

function _loadScript(url) {
	return new Promise(function (resolve, reject) {
		var newScript = document.createElement("script");
		newScript.onload = function () { resolve() }
		newScript.onerror = function (error) { reject(error) }
		document.body.appendChild(newScript);
		newScript.src = url;
	})
}
function _loadStyle(url) {
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


if (widgetId && widgetServerUrl) {
	Promise.all([
		_loadScript('https://unpkg.com/vue'),
		_loadScript('https://unpkg.com/http-vue-loader'),
		_loadStyle('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/fontawesome.min.css'),
		_loadStyle('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/solid.min.css'),
		_loadStyle(widgetServerUrl + 'resources/javascripts/flowwidget/vfg.css'),
		_loadScript(widgetServerUrl + 'resources/javascripts/flowwidget/vfg.js'),
	])
		.then(_ => {

			// create a mock container for vue
			var vueComponentContainer = document.body.appendChild(document.createElement('section'))

			// let vue do its thing...
			new Vue({
				el: vueComponentContainer,
				template: '<widget :serverurl="serverUrl" :widgetid="widgetId" :widgetpostheaders="widgetPostHeaders" :widgetposition="widgetPosition"></widget>',
				components: {
					'widget': httpVueLoader(widgetServerUrl + 'resources/javascripts/flowwidget/widget.vue')
				},
				data() {
					return {
						serverUrl: widgetServerUrl,
						widgetId: widgetId,
						widgetPostHeaders: widgetPostHeaders,
						widgetPosition: widgetPosition
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