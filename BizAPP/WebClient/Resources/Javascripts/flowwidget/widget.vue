<template>
	<span v-if="isLoaded && widget">
		<button :class="['btn bzawidgetbutton', 'bzawidgetbutton-' + widgetposition ]"
				:style="widget.button.styles"
				data-toggle="modal" data-target="#bzawidgetformmodal" data-backdrop="false"
				@click="showForm">
			{{widget.button.caption}}
		</button>

		<div :class="['fade', 'bzawidgetformmodal', 'bzawidgetformmodal-' + widgetposition ]" id="bzawidgetformmodal" role="dialog">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header" :style="widget.form.styles ? widget.form.styles : null">
						<h5 class="modal-title" style="margin: 0 auto">{{widget.form.caption}}</h5>
						<button type="button" class="close" style="margin: -1rem -1rem -1rem 0" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true" style="color:white">&times;</span>
						</button>
					</div>

					<div class="modal-body">
						<div v-if="isSaved" style="padding: 5px">
							<div class="alert alert-success" role="alert">
								{{widget.form.acknowledgementmessage ? widget.form.acknowledgementmessage : 'Thank you'}}
							</div>
						</div>
						<div class="panel-body" style="max-height: 60vh; overflow-y: auto;" v-else>
							<vue-form-generator :schema="widget.form.schema"
												:model="widget.form.model"
												:options="formOptions" @validated="onValidated"></vue-form-generator>
						</div>
					</div>
					<div class="modal-footer">
						<div v-if="hasError" class="text-danger">Error: {{error}}</div>
						<div v-else-if="isSaving" class="fa-2x text-success">
							<i class="fas fa-spinner fa-pulse"></i>
						</div>
						<button v-if="!isSaved" type="button" class="btn" :style="widget.button.styles" :disabled="!isValidated || isSaving" @click="saveForm">Save</button>
						<button v-if="!isSaved" type="button" class="btn btn-default" data-dismiss="modal" :disabled="isSaving">Cancel</button>
						<button v-if="isSaved" type="button" class="btn btn-success" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
	</span>
	<span v-else>...</span>
</template>
<script>
	"use strict;"

	module.exports = {
		components: {
			"vue-form-generator": window.VueFormGenerator.component
		},

		props: {
			'serverurl': String,
			'widgetid': String,
			'widgetpostheaders': Array,
			'widgetposition': String,
		},

		data() {
			return {
				isLoaded: false,
				isValidated: false,
				isSaving: false,
				isSaved: false,
				hasError: false,
				error: null,
				widget: null,
				modelbase: null,
			}
		},

		computed: {
			formOptions() {
				const that = this
				const formOptions = that.widget.form.formOptions ?? {
					"validateAfterLoad": true,
					"validateAfterChanged": true,
					"validateAsync": true,
				}

				return formOptions
			},
		},

		mounted() {
			const that = this
			const widgetUrl = that.serverurl + 'apihandler.ashx?id=' + that.widgetid

			var headers = new Headers();
			headers.append('pragma', 'no-cache');
			headers.append('cache-control', 'no-cache');

			const addheaders = this.widgetpostheaders
			if (addheaders) {
				addheaders.forEach(function (header) {
					const headername = header.header.toLowerCase()
					let headervalue = header.value
					if (headername == 'x-bizapp-typeid') {
						headervalue = 'ESYSbkbzrense6e1vt8xj'
					} else if (headername == 'x-bizapp-method') {
						headervalue = 'GetWidgetById'
					}
					headers.append(headername, headervalue);
				})
			}

			var requestInfo = {
				method: 'GET',
				headers: headers,
			};

			fetch(new Request(widgetUrl), requestInfo)
				.then(r => r.text())
				.then(fndef => (new Function('return ' + fndef))())
				.then(data => {
					that.widget = data
					that.modelbase = JSON.stringify(that.widget.form.model)
					that.isLoaded = true
				}).catch(error => {
					console.log('ERROR initializing widget configuration - ', error)
				})
		},

		methods: {
			showForm() {
				const that = this
				that.widget.form.model = JSON.parse(that.modelbase)
				that.isValidated = false
				that.isSaving = false
				that.isSaved = false
				that.hasError = false
				that.error = null
			},

			onValidated(isValid) {
				this.isValidated = isValid
			},

			saveForm() {
				const that = this
				that.isSaving = true
				const posturl = that.widget.post.url
				const posttype = that.widget.post.type
				const model = that.widget.form.model

				let fetchPromise
				if (posttype == 'JSON') {
					fetchPromise = fetch(posturl, {
						method: 'post',
						body: JSON.stringify(model)
					})
				} else {
					const formPost = new FormData()

					// upload to properties collection
					that.widget.form.schema.fields.forEach(function (field) {
						const fieldName = field.model
						const fieldValue = model[fieldName]

						if (field.type == 'upload' && field.multiple) {
							if (fieldValue) {
								for (var index = 0; index < fieldValue.length; index++) {
									const file = fieldValue.item(index)
									formPost.append(fieldName, file)
								}
							}
						}
						else {
							formPost.append(fieldName, fieldValue)
						}
					})

					var headers = new Headers();
					headers.append('pragma', 'no-cache');
					headers.append('cache-control', 'no-cache');
					//headers.append('Content-Type', 'application/x-www-form-urlencoded');

					const addheaders = that.widgetpostheaders
					if (addheaders) {
						addheaders.forEach(function (header) {
							headers.append(header.header, header.value);
						})
					}


					fetchPromise = fetch(posturl, {
						method: 'POST',
						headers: headers,
						body: formPost
					})
				}

				fetchPromise
					.then((response) => {
						if (!response.ok) {
							throw Error(response.statusText);
						}

						that.hasError = false
						that.error = null
						that.isSaved = true
						that.isSaving = false
					})
					.catch((error) => {
						that.hasError = true
						that.error = 'There was an error submitting - ' + error
						that.isSaved = false
						that.isSaving = false
					});
			}
		}
	}
</script>
<style>
	.modal-open {
		overflow: scroll;
	}

	.bzawidgetformmodal {
		position: fixed !important;
		z-index: 10040 !important;
		overflow-y: auto !important;
	}

	.bzawidgetbutton {
		position: fixed;
		opacity: 0.85;
		padding: 10px 40px 10px 40px;
		min-width: 100px;
		background: #0000FF;
		color: #FFFFFF;
		border-radius: 23px;
		z-index: 10040 !important;
	}

	.bzawidgetformmodal-top-left {
		left: 10px !important;
		top: 40px !important;
	}

	.bzawidgetformmodal-top-right {
		right: 10px !important;
		top: 40px !important;
	}

	.bzawidgetformmodal-bottom-left {
		left: 10px !important;
		bottom: 40px !important;
	}

	.bzawidgetformmodal-bottom-right {
		right: 10px !important;
		bottom: 40px !important;
	}

	.bzawidgetbutton-top-left {
		top: 10px;
		left: 10px;
	}

	.bzawidgetbutton-top-right {
		top: 10px;
		right: 10px;
	}

	.bzawidgetbutton-bottom-left {
		bottom: 10px;
		left: 10px;
	}

	.bzawidgetbutton-bottom-right {
		bottom: 10px;
		right: 10px;
	}
</style>