<template>
	<div class="container-fluid">
		<div class="row">
			<template v-for="widget in widgets">
				<div class="col-3">
					<div :class="['card', {'card-selected' : widget.selected}]" @click="markSelected(widget)">
						<div class="card-body">
							<h5 class="card-title">{{widget.widget.id}} - {{widget.widget.name}}</h5>
							<h6 class="card-subtitle mb-2 text-muted">{{widget.widget.description}}</h6>
							<a href="#" class="card-link">View</a>
						</div>
					</div>
				</div>
			</template>
		</div>
		<hr />

		<template v-if="selectedwidget">
			<div class="row">
				<div class="col-12">
					<widgetcreator :widget="selectedwidget.widget" />
				</div>
			</div>
		</template>
	</div>
</template>
<script>
	"use strict;"

	const FORM = {
		"id": "widget1",
		"name": "widget-1",
		"widgetversion": "v1",
		"description": "widget-1 - lorem lipsum",
		"posturl": "http://requestbin.net/r/143daqg1",
		"button": {
			"caption": "Ask Query - Again",
			"styles": {
				"background": "#0000ff",
				"color": "#FFFFFF"
			}
		},
		"form": {
			"caption": "New Support Ticket",
			"model": {
				"id": 1,
				"name": "John Doe",
				"password": "J0hnD03!x4",
				"skills": "Javascript",
				"email": "john.doe@gmail.com",
				"status": true,
				"picture": null
			},
			"schema": {
				"fields": [
					{
						"type": "input",
						"inputType": "text",
						"label": "ID",
						"model": "id",
						"inputName": "id",
						"readonly": true,
						"featured": false,
						"disabled": true
					},
					{
						"type": "input",
						"inputType": "text",
						"label": "Name",
						"model": "name",
						"inputName": "name",
						"readonly": false,
						"featured": true,
						"required": true,
						"disabled": false,
						"placeholder": "User's name",
						"validator": VueFormGenerator.validators.string
					},
					{
						"type": "input",
						"inputType": "password",
						"label": "Password",
						"model": "password",
						"inputName": "password",
						"min": 6,
						"required": true,
						"hint": "Minimum 6 characters",
						"validator": VueFormGenerator.validators.string
					},
					{
						"type": "input",
						"inputType": "email",
						"label": "E-mail",
						"model": "email",
						"inputName": "email",
						"placeholder": "User's e-mail address",
						"validator": VueFormGenerator.validators.email
					},
					{
						"type": "select",
						"label": "Skills",
						"model": "skills",
						"inputName": "skills",
						"required": true,
						"values": [
							"HTML5",
							"Javascript",
							"CSS3",
							"CoffeeScript",
							"AngularJS",
							"ReactJS",
							"VueJS"
						],
						"validator": VueFormGenerator.validators.string
					},
					{
						"type": "upload",
						"label": "Photo",
						"model": "picture",
						"inputName": "picture",
						"required": true,
						onChanged(model, schema, event) {
							console.log(model, schema, event);
						}
					},
					{
						"type": "checkbox",
						"label": "Status",
						"model": "status",
						"inputName": "status",
						"multi": true,
						"readonly": false,
						"featured": false,
						"disabled": false,
						"default": true
					},
					{
						"type": "submit",
						"label": "",
						"buttonText": "Submit",
						"validateBeforeSubmit": true
					}

				]
			},

			"formOptions": {
				"validateAfterLoad": false,
				"validateAfterChanged": false
			}
		}
	}

	module.exports = {
		components: {
			'widgetcreator': httpVueLoader('./widgetcreator.vue')
		},

		data() {
			return {
				widgetnames: [
					'widget1.txt',
					//'widget2.txt',
					//'widget3.txt',
					//'widget4.txt',
				],
				widgets: [
				],
				selectedwidget: null
			}
		},

		created() {
			const that = this
			const urls = that.widgetnames.map(widget => './widgets/' + widget)

			var headers = new Headers();
			headers.append('pragma', 'no-cache');
			headers.append('cache-control', 'no-cache');

			var requestInfo = {
				method: 'GET',
				headers: headers,
			};

			Promise.all(urls.map(url => fetch(new Request(url), requestInfo)
				.then(r => r.text())
				.then(fndef => (new Function('return ' + fndef))())
			))
				.then(data => {
					that.widgets = data.map(widget => {
						return {
							selected: false,
							widget: widget
						}
					})
				})
		},

		methods: {
			markSelected(selectedItem) {
				this.widgets.forEach(widget => {
					widget.selected = widget == selectedItem
				})

				this.selectedwidget = this.widgets.find(widget => widget.selected)
			}
		}
	}
</script>
<style>
	.card-selected {
		border: 3px solid green;
	}
</style>