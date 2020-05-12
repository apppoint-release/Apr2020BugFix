<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-12">
				<form class="needs-validation" novalidate>
					<nav>
						<div class="nav nav-tabs" id="nav-tab" role="tablist">
							<a class="nav-item nav-link active" id="nav-basic-tab" data-toggle="tab" href="#nav-basic" role="tab" aria-controls="nav-basic" aria-selected="true">Basic</a>
							<a class="nav-item nav-link" id="nav-form-tab" data-toggle="tab" href="#nav-form" role="tab" aria-controls="nav-form" aria-selected="false">Form</a>
							<a class="nav-item nav-link" id="nav-snippet-tab" data-toggle="tab" href="#nav-snippet" role="tab" aria-controls="nav-snippet" aria-selected="false">Snippet</a>
							<a class="nav-item nav-link" id="nav-widgetdefinition-tab" data-toggle="tab" href="#nav-widgetdefinition" role="tab" aria-controls="nav-widgetdefinition" aria-selected="false">Widget Definition</a>
						</div>
					</nav>
					<div class="tab-content" id="nav-tabContent">
						<div class="tab-pane fade show active" id="nav-basic" role="tabpanel" aria-labelledby="nav-basic-tab">
							<div class="pt-2 h3">Details</div>
							<div class="row">
								<div class="col-6">
									<label for="id">Id</label>
									<input type="text" class="form-control" id="id" placeholder="type id" v-model="widget.id" required>
									<div class="invalid-feedback">
										Valid id is required.
									</div>
								</div>
								<div class="col-6">
									<label for="name">Name</label>
									<input type="text" class="form-control" id="name" placeholder="type name" v-model="widget.name" required>
									<div class="invalid-feedback">
										Valid name is required.
									</div>
								</div>
								<div class="col-6">
									<label for="posttype">Post Type</label>
									<select class="form-control" id="posttype" v-model="widget.post.type">
										<option value="J">JSON</option>
										<option value="F">FORM</option>
									</select>
								</div>
								<div class="col-6">
									<label for="posturl">Post URL</label>
									<input type="text" class="form-control" id="posturl" placeholder="type posturl" v-model="widget.post.url" required>
									<div class="invalid-feedback">
										Valid posturl is required.
									</div>
								</div>
								<div class="col-6">
									<label for="widgetserverurl">Widget URL</label>
									<input type="text" class="form-control" id="widgetserverurl" placeholder="type widget server url" v-model="widgetserverurl" required>
									<div class="invalid-feedback">
										Valid widgetserverurl is required.
									</div>
								</div>
								<div class="col-12">
									<label for="postheaders">POST Headers</label>
									<textarea rows="5" class="form-control" id="postheaders" placeholder="additional headers" v-model="postHeadersJSON"></textarea>
								</div>
							</div>
							<div class="pt-2 h3">Button</div>
							<div class="row">
								<div class="col-6">
									<label for="buttoncaption">Button Caption</label>
									<input type="text" class="form-control" id="buttoncaption" placeholder="type button caption" v-model="widget.button.caption" required>
									<div class="invalid-feedback">
										Valid button caption is required.
									</div>
								</div>
								<div class="col-2">
									<label for="backgroundcolor">Background Color</label>
									<input type="color" class="form-control" id="backgroundcolor" placeholder="pick color" v-model="widget.button.styles.background" required>
									<div class="invalid-feedback">
										Valid button background color is required.
									</div>
								</div>
								<div class="col-2">
									<label for="foregroundcolor">Foreground Color</label>
									<input type="color" class="form-control" id="foregroundcolor" placeholder="pick color" v-model="widget.button.styles.color" required>
									<div class="invalid-feedback">
										Valid button color is required.
									</div>
								</div>
							</div>
						</div>

						<div class="tab-pane fade" id="nav-form" role="tabpanel" aria-labelledby="nav-form-tab">
							<div class="pt-2 row">
								<div class="col-8">
									<div class="row">
										<div class="col-12">
											<label for="formcaption">Form Caption</label>
											<input type="text" class="form-control" id="formcaption" placeholder="type form caption" v-model="widget.form.caption" required>
											<div class="invalid-feedback">
												Valid form caption is required.
											</div>
										</div>
										<div class="col-4">
											<label for="formbackgroundcolor">Background Color</label>
											<input type="color" class="form-control" id="formbackgroundcolor" placeholder="pick color" v-model="widget.form.styles.background" required>
											<div class="invalid-feedback">
												Valid form background color is required.
											</div>
										</div>
										<div class="col-4">
											<label for="formforegroundcolor">Foreground Color</label>
											<input type="color" class="form-control" id="formforegroundcolor" placeholder="pick color" v-model="widget.form.styles.color" required>
											<div class="invalid-feedback">
												Valid form color is required.
											</div>
										</div>
										<div class="col-12 pt-2">
											<label for="formacknowledgementmessage">Form Acknowledgement Message</label>
											<textarea class="form-control" id="formacknowledgementmessage" rows="5" placeholder="type form acknowledgement message" v-model="widget.form.acknowledgementmessage"></textarea>
											<div class="invalid-feedback">
												Valid form acknowledgement message is required.
											</div>
										</div>
									</div>

									<div class="row">
										<div class="col-12">
											<label for="schema"><span class="h5">Schema</span></label>
											<textarea rows="7" class="form-control" id="schema" placeholder="specify model JSON" v-model="schemaJSON" required></textarea>
											<div class="invalid-feedback">
												Valid schema is required.
											</div>
										</div>
										<div class="col-12">
											<label for="model"><span class="h5">Model</span></label>
											<textarea rows="5" class="form-control" id="model" placeholder="specify model JSON" v-model="modelJSON" required></textarea>
											<div class="invalid-feedback">
												Valid model is required.
											</div>
										</div>
									</div>
								</div>
								<div class="col-4">
									<label><span class="h5">Form Preview</span></label>
									<div class="panel-body">
										<vue-form-generator :schema="widget.form.schema"
															:model="widget.form.model"
															:options="widget.form.formOptions"></vue-form-generator>
									</div>
								</div>
							</div>
						</div>

						<div class="tab-pane fade" id="nav-snippet" role="tabpanel" aria-labelledby="nav-snippet-tab">
							<div class="row">
								<div class="col-12">
									<textarea rows="5" class="form-control" v-html="snippet" readonly></textarea>
								</div>
							</div>
						</div>

						<div class="tab-pane fade" id="nav-widgetdefinition" role="tabpanel" aria-labelledby="nav-widgetdefinition-tab">
							<div class="row">
								<div class="col-12">
									<textarea rows="30" class="form-control" v-model="JSON.stringify(widget,null,4)" readonly></textarea>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	"use strict;"

	module.exports = {
		components: {
			"vue-form-generator": window.VueFormGenerator.component
		},

		props: {
			'widget': {
				type: Object
			}
		},

		data() {
			return {
				widgetserverurl: 'http://localhost:35353/widgetcreator/'
			}
		},

		computed: {
			postHeadersJSON: {
				get() {
					return JSON.stringify(this.widget.post.headers, null, 2)
				},
				set(value) {
					this.widget.post.headers = value ? JSON.parse(value) : null
				}

			},

			modelJSON: {
				get() {
					return JSON.stringify(this.widget.form.model, null, 2)
				},
				set(value) {
					this.widget.form.model = value ? JSON.parse(value) : null
				}
			},

			schemaJSON: {
				get() {
					return JSON.stringify(this.widget.form.schema, null, 2)
				},
				set(value) {
					this.widget.form.schema = value ? JSON.parse(value) : null
				}
			},

			snippet() {
				const that = this
				let xheaders = ''
				if (that.widget.post.headers) {
					that.widget.post.headers.forEach(h => {
						xheaders += ` data-${h.name}="${h.value}"`
					})
				}

				return `&lt;script async src="${that.widgetserverurl}resources/javascript/flowwidget/widgetloader.js"
		data-id="${that.widget.id}" data-name="bza_widget" ${xheaders}&gt;
&lt;/script&gt;`
			}
		},
	}
</script>