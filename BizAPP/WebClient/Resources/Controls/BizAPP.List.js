let dataTypesMaster = {
	'System.Int64': 'number',
	'System.Int32': 'number',
	'System.String': 'text',
	'System.DateTime': 'date',
	'System.Boolean': 'boolean'
}

var tableEl;
var dataTableInstance = null;
var treeInstance;

var queryParams = {
	pageSize: 10,
	pageNumber: 0,
	searchText: '',
	sort: {},
	filters: {},
	additionalFields: {}
}

var tableOptions = {
	showOutlineSearch: false,
	showGridCount: false
};
var baseOptions = {
	columnList: [],
	defaultColumns: [],
	columnDataTypes: {},
	firstLoad: true
};
var scriptsLoaded = false;
var ignoredColumns = ['_rownum', 'uniqueid', 'version', 'objecttype', 'displayname'];


BizAPP.List = {
	Export: {
		exportOptionsMaster: {
			csv: { 'className': 'fa fa-file-excel-o', 'text': 'CSV' },
			pdf: { 'className': 'fa fa-file-pdf-o', 'text': 'PDF' },
			xps: { 'className': 'fa fa-file', 'text': 'XPS' },
			excel2003: { 'className': 'fa fa-file-excel-o', 'text': 'Excel-2003' },
			excel2007: { 'className': 'fa fa-file-excel-o', 'text': 'Excel-2007/2010/2013' },
			word: { 'className': 'fa fa-file-word-o', 'text': 'Word-2007/2010/2013' }
		},

		ExportTemplate: function () {
			var exportTemplate = `<div class="dropdown exportLink">
				<button type="button" class="btn btn-default btn-sm dropdown-toggle" id="exportMenu" data-toggle="dropdown" data-display="static" aria-haspopup="true" aria-expanded="true">
          <span class="fa fa-upload pr-2"></span> Export
				</button>
			<ul class="dropdown-menu dropdown-menu-right exportDD" aria-labelledby="exportMenu">`;
			_.each(BizAPP.List.Export.exportOptionsMaster, function (obj, key) {
				exportTemplate += `<li class="dropdown-item" onclick=BizAPP.List.Export.ExportData('` + key + `')><a><i class="` + obj.className + `"></i>` + obj.text + `</a></li>`;
			});
			exportTemplate += `</ul></div>`
			return exportTemplate;
		},

		ExportData: function (mode) {
			internalGridExport(mode, baseOptions.id, 'false');
		}
	},

	Filter: {
		_getFilterTemplate: function (contextObj, colName, dataType, filterVal) {

			if (_.isUndefined(dataType)) {
				return false
			}
			var isSelectedFilter = queryParams.filters[colName] ? true : false
			var selectedFilter = queryParams.filters[colName] ? queryParams.filters[colName] : ''

			var filterDataOptions = {
				contextObj: contextObj,
				dataType: dataType,
				columnName: colName,
				filterVal: filterVal,
				onCompleteSrc: BizAPP.List.Filter._setFilter
			}
			//debugger;
			var filterInstance = new CustomGridFilter(filterDataOptions);
			filterInstance.show();
		},

		_setFilter: function (columnName, filterValue, shouldClearFilter) {
			if (shouldClearFilter) {
				delete queryParams.filters[columnName];
			} else {
				queryParams.filters[columnName] = filterValue;
			}
			tableEl.DataTable().draw();
		},

		SetupFilters: function () {
			//tableEl.find("th").off("click.DT");
			$('#baseTable thead tr:first th').each(function (idx) {
				var colName = $(this).text();
				var columnDataType = baseOptions.columnDataTypes[colName];
				var filterHTML = '<div></div>'
				if (idx === 0 || _.isUndefined(columnDataType)) {
				} else {
					var filterEl = $(filterHTML)
					BizAPP.List.Filter._getFilterTemplate(filterEl, colName, columnDataType)
					$(this).empty()
					$(this).append(filterEl);
				}
				//tableEl.fnSortListener($(this), idx);
			});
		},
	},

	AdditionalFields: {
		GetAdditionalFields: function (objectTypeId, cb) {
			var fetchUrl = 'metadataservices.svc/jsonn/GetFieldsWithProps'
			var postData = {}
			postData.cookie = _sessionid__;
			if (!objectTypeId) {
				objectTypeId = baseOptions.objectType
			}
			postData.typeNames = [objectTypeId];
			postData.props = ["ColumnLabel", "LinksTo", "Description", "DataType", "IsSystem", "IsVirtual", "IsDeprecated"]

			$.ajax(fetchUrl, {
				type: "POST",
				data: JSON.stringify(postData),
				contentType: "application/json",
			}).done(function (data) {
				cb(data[objectTypeId]);
			}).fail(function (xhr, status, error) {
				console.log('Error', error)
			});
		},

		SetSelectedFields: function (isDismissed) {
			if (isDismissed === true) {
				$('.fieldPickerDropdown').toggleClass('show');
				return false;
			}
			var selectedFields = treeInstance.save()
			var additionalFieldsObj = {}
			queryParams.additionalFields = []
			_.each(selectedFields, function (obj, key) {
				var item = obj.text
				if (baseOptions.defaultColumns.indexOf(key) < 0) {
					additionalFieldsObj[key] = item;
					var dataType = dataTypesMaster[obj.data.dataType.split(',')[0]]
					/*baseOptions.columnList.push({
						className: dataType === 'date' ? 'gridCell-w':  'gridCell-d',
						data: item,
						orderable: true,
						searchable: false,
						title: item,
						name: item,
						dataType: dataType
					})*/
					baseOptions.columnDataTypes[item] = dataType
				}
				queryParams.additionalFields.push(obj.data)
			})

			BizAPP.List._saveOptionsToStorage();
			$('.fieldPickerDropdown').toggleClass('show');
			//tableEl.DataTable().draw();
			baseOptions.initialData=[];
			baseOptions.data=null;
			BizAPP.List.Render(baseOptions);
		},

		showTree() {
			/*if (treeInstance) {
				//treeInstance.destroy();
				$('.fieldPickerDropdown').toggleClass('show');
				// return false;
			}*/
			var selectedNodes = {}
			_.each(baseOptions.columnList, function (col) {
				selectedNodes[col.data] = col.name
			});

			var treeDataOptions = {
				containerElementId: '#treeContainer1',
				dataSrc: BizAPP.List.AdditionalFields.GetAdditionalFields,
				onCompleteSrc: BizAPP.List.AdditionalFields.SetSelectedFields,
				rootObjectId: baseOptions.objectType,
				selectedNodes: queryParams.additionalFields
			}
			treeInstance = new CustomTreeViewer(treeDataOptions);
			treeInstance.show();
			$('.fieldPickerDropdown').toggleClass('show');
		}
	},

	_loadScripts: function (url, callback) {
		$.cachedScript(url).done(function () {
			if (callback)
				callback();
		});
	},

	_loadCSS: function () {
		console.log('Scripts Loaded');
		//$.getCss('https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css');
		$.getCss('https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.20/css/dataTables.bootstrap4.min.css');
		$.getCss('https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css');
		//$.getCss('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
		//$.getCss('https://gyrocode.github.io/jquery-datatables-checkboxes/1.2.10/css/dataTables.checkboxes.css');
		//$.getCss('https://cdn.datatables.net/select/1.2.7/css/select.dataTables.min.css');
		//$.getCss('https://use.fontawesome.com/releases/v5.5.0/css/all.css');
		$.getCss('resources/controls/BizAPP.List.css');
		scriptsLoaded = true
	},

	_keepTrying: function (options) {
		if (scriptsLoaded) {
			BizAPP.List.setupTable(options)
		} else {
			setTimeout(function () {
				BizAPP.List._keepTrying(options);
			}, 1000);
		}
	},

	_saveOptionsToStorage: function () {
		sessionStorage.setItem('grid_' + queryParams.queryId, JSON.stringify(queryParams));
	},

	_fetchOptionsFromStorage: function () {
		var gridOptions = JSON.parse(sessionStorage.getItem('grid_' + queryParams.queryId));
		if (gridOptions) {
			queryParams.pageNumber = gridOptions.pageNumber ? gridOptions.pageNumber : {}
			queryParams.pageSize = gridOptions.pageSize ? gridOptions.pageSize : {}
			queryParams.sort = gridOptions.sort ? gridOptions.sort : {}
			queryParams.filters = gridOptions.filters ? gridOptions.filters : {}
			queryParams.additionalFields = gridOptions.additionalFields
			return queryParams
		}
		else {
			queryParams = {
				pageSize: 10,
				pageNumber: 0,
				searchText: '',
				sort: {},
				filters: {},
				additionalFields: {}
			}
		}
	},

	_resetGridOptions: function () {
		tableEl = dataTableInstance = treeInstance = null;
		queryParams = {
			pageSize: 10,
			pageNumber: 0,
			searchText: '',
			sort: {},
			filters: {},
			additionalFields: {}
		}

		tableOptions = {
			showOutlineSearch: false,
			showGridCount: false
		};
		baseOptions = {
			isMultiSelectEnabled: false,
			defaultColumns: [],
			columnList: [],
			columnDataTypes: {},
			firstLoad: true
		};
	},

	_isIgnoredColumn: function (col) {
		if (ignoredColumns.indexOf(col) >= 0) {
			return true;
		}
		return false;
	},

	_setQueryParams: function (params) {
		queryParams.pageSize = params.length
		queryParams.sort = params.sort || {};
		/*_.each(params.order, function (col) {
			if (col.dir === 'asc') {
				queryParams.sort[baseOptions.columnList[col.column].data] = true
			} else {
				queryParams.sort[baseOptions.columnList[col.column].data] = false
			}
		});*/
	},

	_getQueryParams: function () {
		//savedParams = queryParams;
		var params = {}
		params.qid = baseOptions.qid
		params.pagesize = queryParams.pageSize;
		if (dataTableInstance) {
			params.pageno = dataTableInstance.page.info().page ? dataTableInstance.page.info().page : 0;
		}
		params.sort = queryParams.sort;
		params.filters = queryParams.filters;
		params.additionalFields = queryParams.additionalFields;
		params.version = 2;
		return params
	},

	Render: function (options) {
		if (!options.initialData)
			BizAPP.List._resetGridOptions();

		$(options.selector).html('')
		baseOptions.firstLoad = true;

		var renderOptions = $.extend(true, {}, options);
		renderOptions.callback = function (data) {
			options.data = data;
			// console.log('Render called from Framework', options, data)
			BizAPP.List.initTable(options)
		}
		if (renderOptions.data) {
			// console.log('Data available on load', renderOptions.data)
			renderOptions.callback(renderOptions.data);
		}
		else {
			var qParams = BizAPP.List._getQueryParams();
			qParams.callback = function (data, columns) {
				options.data = data;
				options.metadata.BaseProperties.Columns = columns;
				if (data) {
					BizAPP.List.initTable(options)
				}
			}
			qParams.qid = options.metadata.DataSource;
			qParams.pagesize = options.metadata.RowsPerPage;
			qParams.fetchColumnMetadata = true;
			qParams.selector = options.selector
			BizAPP.List.RefetchData(qParams);
		}
	},

	RefetchData: function (options) {
		var postData = {}
		postData.sessionCookie = _sessionid__;
		postData.queryParams = {
			"EnterpriseId": options.qid,
			"PageSize": options.pagesize,
			"PageNumber": options.pageno || 0
		};

		if (options.additionalFields) {
			postData.queryParams.AdditionalFields = [];
			$.each(options.additionalFields, function (i, n) {
				postData.queryParams.AdditionalFields.push({ FieldName: n.key, Alias: n.text });
			})

			options.fetchColumnMetadata = true;
		}

		if (options.sort) {
			postData.queryParams.SortFields = []
			var index = 0
			$.each(options.sort, function (i, n) {
				postData.queryParams.SortFields.push({ FieldName: i, SortBy: n, SortOrder: index++ });
			})
		}

		var roid = $(options.selector || baseOptions.selector).closest('[bizapp_context]').attr('bizapp_context')
		if(roid)roid = roid.split('\n')[0]
		postData.queryOptions = {
			FetchCount: options.fetchCount,
			ContextObjectId: roid ? roid.split(':')[0] : '',
			ContextObjectTypeId: roid ? roid.split(':')[1] : ''
		}
		postData.fetchColumnMetadata = options.fetchColumnMetadata;

		$.ajax('mobileobjectqueryservices.svc/jsonn/executequery', {
			type: "POST",
			data: JSON.stringify(postData),
			contentType: "application/json",
		}).done(function (result) {
			result = JSON.parse(result);
			result.data = JSON.parse(result.data);

			if (postData.fetchColumnMetadata && tableOptions.baseProperties) {
				tableOptions.baseProperties.Columns = result.columns;
				BizAPP.List.getColumnList(tableOptions.baseProperties)
			}
			if (options.callback) {
				options.callback(result.data, result.columns);
			}
		}).fail(function (xhr, status, error) {
			xhr.responseText = JSON.parse(xhr.responseText);
			debug(xhr.responseText.Message, 'exception', xhr.responseText.StackTrace)
		});
	},
	RefetchData_old: function (options) {
		BizAPP.Session.GetQueryResults(options, function (result) {
			console.log('Re render called', options, result)
			options.data = result.data;
			if (result.data && !_.isEmpty(result.data)) {
				baseOptions.objectType = options.data[0].objecttype
			}
			if (options.callback) {
				options.callback(options.data)
			}
		});
	},

	GetQueryResults: function (options) {
		var qParams = BizAPP.List._getQueryParams();
		var renderOptions = $.extend(qParams, options);

		BizAPP.Session.GetQueryResults(renderOptions, function (result) {
			console.log('Query Result for Options', renderOptions, result)
			renderOptions.data = result.data;
			if (renderOptions.callback) {
				renderOptions.callback(renderOptions.data)
			}
		});
	},

	getRecordCount: function () {
		var qParams = BizAPP.List._getQueryParams();
		var renderOptions = $.extend(qParams, { fetchCount: true });
		renderOptions.callback = function (result) {
			$('#recordCount').html(result[0].Column1 + ' Records Found');
		}
		//BizAPP.List.GetQueryResults(qParams);
		BizAPP.List.RefetchData(renderOptions);
	},

	getDataForMultiQuery: function (queryObj) {
		baseOptions.metadata.DataSource = $(queryObj).val();
		baseOptions.initialData=null;
		BizAPP.List.Render(baseOptions);
	},

	MainTemplate: function () {
		var gridTemplate = BizAPP.List.GridTemplate()
		var mainTemplate = `<div>
			<div id="tableContainer">`
		mainTemplate += gridTemplate;
		mainTemplate += `</div>
		</div>`
		return mainTemplate;
	},

	GridTemplate: function () {
		var gridTemplate = '';
		if (tableOptions.showOutlineSearch === true) {
			gridTemplate += `<div class="search-container" style="float:right;">
				<input id="searchTxt" type="text" placeholder="Search.." name="search" style="width:250px;">
				<button type="submit" onclick="BizAPP.List.searchTable()"><i class="fa fa-search"></i></button>
			</div>`
		}
		/*hover order-column cell-border*/
		gridTemplate += `<table id="baseTable" cellspacing="0" class="cell-border responsive" style="width:100%">
		</table><div class="no_record_row">No records to display</div>`
		return gridTemplate;
	},

	SetupTemplates: function () {

	},

	LinkTemplate: function () {
		var linksTemplate = '<div style=""></div>';
		return linksTemplate;
	},

	MultiSelectTemplate: function () {
		var linkTemplate = `<div style="float:left;"></div>`
		return linkTemplate;
	},

	MultiQueryTemplate: function () {
		return `<div style=""></div>`;
	},

	generateAdditionalLinks: function (baseProperties, linksContainer) {
		var additionalLinks = JSON.parse(baseProperties.AdditionalLinkControls)
		_.each(additionalLinks, function (linkControl, linkObj) {
			var lnkCtrl = $(linkControl).click(function (e) {
				window.event=e
				callEvaluateAdditionalLink($(this), baseOptions.id, linkObj)
			});
			$(linksContainer).append(lnkCtrl);
		})
	},

	generateMultiSelectOperations: function (baseProperties, multiSelectContainer) {
		var additionalLinks = JSON.parse(baseProperties.MultiSelectLinkControls)
		if (!_.isEmpty(additionalLinks)) {
			baseOptions.isMultiSelectEnabled = true
			_.each(additionalLinks, function (linkControl, linkObj) {
				var lnkCtrl = $(linkControl).click(function (e) {
					window.event=e
					callEvaluateMultiSelectLink($(this), baseOptions.id, '', BizAPP.List.getSelectedRows(), linkObj)
				});
				$(multiSelectContainer).append(lnkCtrl)
			});
		}
	},

	generateMultiQueryOptions: function (queryCollection, multiQueryContainer) {
		if (queryCollection && !_.isEmpty(queryCollection)) {
			var multiQueryTemplate = `<select class="form-control" onchange="BizAPP.List.getDataForMultiQuery(this)">`;
			_.each(queryCollection, function (obj) {
				if (obj.QueryEnterpriseId === baseOptions.qid) {
					multiQueryTemplate += `<option selected="selected" value="` + obj.QueryEnterpriseId + `")>` + obj.QueryName + `</option>`;
				} else {
					multiQueryTemplate += `<option value="` + obj.QueryEnterpriseId + `")>` + obj.QueryName + `</option>`;
				}
			});
			multiQueryTemplate += `</select>`
			if (!$(multiQueryContainer).length) {
				$(multiQueryTemplate).wrap('<div class="multiQueryContainer" style=""></div>')
				$('#baseTable_length').append(multiQueryTemplate)
			}
			else
				$(multiQueryContainer).append(multiQueryTemplate)
		}
	},

	getColumnList: function (baseProperties) {
		// console.log('Multi query options', baseProperties.Columns)
		baseOptions.columnList = []
		var columnMetaData = typeof baseProperties.Columns == 'string' ? JSON.parse(baseProperties.Columns) : baseProperties.Columns
		var className = 'gridcell-common'
		var i = 0;
		/*baseOptions.columnList.push({
			className: '',
			data: null,
			orderable: false,
			searchable: false,
			name: 'col',
			dataType: null
		});*/
		if (baseOptions.metadata.ExpandView) {
			baseOptions.columnList.push({
				className: '',
				data: null,
				orderable: false,
				searchable: false,
				name: 'ev',
				dataType: null
			});
		}

		if (baseOptions.isMultiSelectEnabled) {
			baseOptions.columnList.push({
				className: '',
				data: null,
				orderable: false,
				searchable: false,
				name: 'ms',
				dataType: null
			});
		}

		_.each(columnMetaData, function (key, col) {
			// console.log('Col', col, key)
			var dataType = dataTypesMaster[key.split(',')[0]];
			if (!BizAPP.List._isIgnoredColumn(col)) {
				if (i === 0) {
					className = 'gridcell-first'
				} else if (dataType === 'date') {
					className = 'gridcell-date'
				} else {
					className = 'gridcell-common'
				}
				i = i + 1;
				baseOptions.columnList.push({
					className: className,
					data: col,
					orderable: true,
					searchable: false,
					title: col,
					name: col,
					dataType: dataType
				})
				baseOptions.columnDataTypes[col] = dataType
				baseOptions.defaultColumns.push(col);
			}
		});
	},

	getSelectedRows: function () {
		var selectedRowIds = [];
		_.each($('.dtChkBox:checkbox:checked'), function (chkBox) {
			// console.log('Selected Checkbox', $(chkBox).closest('tr'))
			selectedRowIds.push($(chkBox).closest('tr').attr('roid'));
		})
		return selectedRowIds.toString();
	},

	handleRowClick: function (evt, row) {
		var result = getComputedStyle(evt.target, ':before').content;
		var data = dataTableInstance.row(row).data();

		if (data) {
			var rowId = data.uniqueid + ':' + data.objecttype + ':' + data.version;

			if (result && result === 'none') {
				console.log('Row Id clicked', $(evt.target))
				if ($(evt.target).is(':checkbox') === true) {
					return false
				} else {
					BizAPP.List._saveOptionsToStorage();
					if (baseOptions.metadata.DrillDownViewName && baseOptions.metadata.DrillDownViewName !== '') {
						BizAPP.UI.LoadView({ roid: rowId, viewId: baseOptions.metadata.DrillDownViewName, target: tableEl.closest(".ViewControlEx").attr("bizappid") })
					}
				}
			} else {
				if (baseOptions.metadata.ExpandView && baseOptions.metadata.ExpandView !== '') {
					$('<tr class="child ev"><td></td><td colspan="' + (baseOptions.columnList.length - 1) + '"><i class="fas fa-spinner fa-pulse"></i></td></tr>').insertAfter($(evt.target).closest('tr')[0]);
					BizAPP.UI.LoadView({ roid: rowId, viewId: baseOptions.metadata.ExpandView, target: 'ev', selector:'.ev' })
				}
			}
		}
	},

	handleHeaderClick: function (cellIndex) {
		var order = dataTableInstance.order();
		var orderToSort = 'asc'
		if (order && order.length) {
			if (order[0][0] === cellIndex) {
				if (order[0][1] === 'asc') {
					orderToSort = 'desc'
				} else {
					orderToSort = 'asc'
				}
			}
		}
		var params = {};
		params[Object.keys(baseOptions.columnDataTypes)[cellIndex - 1]] = orderToSort;
		queryParams.order = [cellIndex, orderToSort];
		queryParams.sort = params;
		baseOptions.data = null
		BizAPP.List.Render(baseOptions);
	},

	initTable: function (options) {
		baseOptions.selector = options.selector;
		baseOptions.qid = options.metadata.DataSource;
		queryParams.queryId = options.metadata.DataSource;
		baseOptions.drilldownView = options.metadata.DrillDownViewName;
		baseOptions.metadata = options.metadata;
		baseOptions.id = options.id;
		baseOptions.initialData = options.data;

		baseOptions.formDefId = $(baseOptions.selector).attr('bza-defid');
		baseOptions.controlId = $(baseOptions.selector).attr('bza-ctrlid');

		console.log('Grid metadata', options.metadata)

		tableOptions.showExport = options.metadata['ShowExportToCSV'] || false;
		tableOptions.showImport = options.metadata['ShowImportFromCSV'] || false;
		tableOptions.showGridCount = options.metadata['ShowGridCount'] || false;
		tableOptions.emptyRecordText = options.metadata['EmptyRecordText'] || '';
		queryParams.pageSize = options.metadata['RowsPerPage'] || 20;

		tableOptions.queryCollection = options.metadata['QueryCollection'] || [];
		tableOptions.baseProperties = options.metadata['BaseProperties'] || [];
		tableOptions.rowTemplate = options.metadata['ClientInlineContent'];
		tableOptions.expandView = options.metadata['ExpandView'];

		tableOptions.postScript = options.metadata['Script'] || {};

		if (queryParams.queryId) {
			// queryParams = BizAPP.List._fetchOptionsFromStorage();
			// console.log('Grid options fetched from storage', queryParams)
		}
		BizAPP.List._keepTrying(options);
	},

	setupTable: function (options) {
		if (options)
			$(baseOptions.selector).attr('bza-id', options.id);
		var outlineContent = baseOptions.metadata.OutlineContent;
		var mainTemplate = BizAPP.List.MainTemplate();
		outlineContent = outlineContent.replace(/<!--control-->/g, mainTemplate)

		var linksTemplate = $(BizAPP.List.LinkTemplate());
		linksTemplate.append('<div class="additionalLinksContainer" style=""></div>')
		outlineContent = outlineContent.replace(/<!--additionallinks-->/g, $(linksTemplate).html())

		var multiQueryTemplate = $(BizAPP.List.MultiQueryTemplate());
		multiQueryTemplate.append('<div class="multiQueryContainer" style=""></div>')
		//outlineContent = outlineContent.replace(/<!--multiquery-->/g, $(multiQueryTemplate).html())

		var additionalLinks = JSON.parse(tableOptions.baseProperties.MultiSelectLinkControls)
		if (!_.isEmpty(additionalLinks)) {
			baseOptions.isMultiSelectEnabled = true
		}

		$(baseOptions.selector).append(outlineContent)

		BizAPP.List.getColumnList(tableOptions.baseProperties)

		tableEl = $(baseOptions.selector + ' #baseTable');

		baseOptions.columnDefs = [];
		/*baseOptions.columnDefs.push({
			'targets': 0,
			'searchable': false,
			'orderable': false,
			'className': 'no_cell_border',
			'render': function (data, type, full, meta) {
				return '&nbsp;';
			}
		})*/

		var id=0;
		if (baseOptions.metadata.ExpandView) {
			baseOptions.columnDefs.push({
				'targets': id++,
				'searchable': false,
				'orderable': false,
				'className': 'no_cell_border',
				'render': function (data, type, full, meta) {
					return '<i class="fa fa-plus"></i>';
				}
			})
		}
		if (baseOptions.isMultiSelectEnabled) {
			baseOptions.columnDefs.push({
				'targets': id++,
				'searchable': false,
				'orderable': false,
				'className': 'multiselect-chkbox',
				'render': function (data, type, full, meta) {
					return '<input type="checkbox" name="id[]" value="" class="dtChkBox"/>';
				}
			})
		}
		_.each(baseOptions.columnList, function (col, idx) {
			if (col.dataType === 'date') {
				var colDefn = {}
				colDefn.targets = id+idx;
				colDefn.render = function (data) {
					return moment(data).format('DD-MM-YYYY');
				}
				baseOptions.columnDefs.push(colDefn);
			}
		});
		BizAPP.List.RecreateDataTable(options);
	},

	completeSetup: function () {
		var multiSelectLinksTemplate = $(BizAPP.List.MultiSelectTemplate());
		multiSelectLinksTemplate.append('<div class="multiSelectContainer" style="float:left;"></div>')
		//multiSelectLinksTemplate.insertAfter('#tableContainer')
		$('.dataTables_paginate').closest('.row').children().first().append(multiSelectLinksTemplate)

		BizAPP.List.generateAdditionalLinks(tableOptions.baseProperties, $('.additionalLinksContainer'));
		BizAPP.List.generateMultiSelectOperations(tableOptions.baseProperties, $('.multiSelectContainer'));
		BizAPP.List.generateMultiQueryOptions(tableOptions.queryCollection, $('.multiQueryContainer'));

		var rightLinksContainer = `<div class="showCountLink text-right"></div>`;
		$('#baseTable_length').addClass('text-sm-right text-md-left').parent().next().append(rightLinksContainer)

		if (tableOptions.showGridCount === true) {
			var tl = '<div id="recordCount"><button type="button" class="btn btn-default btn-sm" onclick="BizAPP.List.getRecordCount()"># Rows</button></div>'
			$('.showCountLink').append(tl);
		}

		var il = `<div id="importLink">
		<button type="button" class="btn btn-default btn-sm" onclick="displayImportTemplate( event, this, 'b5d15e7bcfff4ee788aa3071d29449a8', '2d5c3dd0a87f4bfd86d789d6720c3b6b', 'ENT_VD_Vibe_Dashboard:vc_home:vc_Customerscontainer:View_Customers:vd_AllCustomers' )">
			<span class="fa fa-upload pr-2" style="transform:rotate(180deg)"></span> Import
		</button>
		</div>`;
		$('.showCountLink').append(il);

		var el = BizAPP.List.Export.ExportTemplate()
		$('.showCountLink').append(el);

		var al = `<div class="dropdown">
			<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-display="static" data-toggle="dropdown" onclick="BizAPP.List.AdditionalFields.showTree()"><i class="fa fa-bars"></i></button>
			<div class="navigation dropdown-menu fieldPickerDropdown dropdown-menu-right" style="width: 350px; height: 420px;">
				<span></span>
				<div id="treeContainer1"></div>  
			</div></div>`
		$('.showCountLink').append(al);

		tableEl.on('click', 'tbody tr', function (evt) {
			BizAPP.List.handleRowClick(evt, this);
		});

		// tableEl.on('click', 'thead th', function (evt) {
		/*$('th').on("click", function (evt) {
			//evt.stopImmediatePropagation();
			//evt.stopPropagation();

			BizAPP.List.handleHeaderClick(evt);

			
		});*/

		$('.tableHeader').on('click', function (evt) {
			BizAPP.List.handleHeaderClick($(evt.target).closest('th')[0].cellIndex);
		})

		tableEl.find("th").off("click.DT");

		tableEl.on('draw.dt', function () {
			console.log('Table redrawn');
		});

		tableEl.on('responsive-resize.dt', function (evt, datatable, columns) {
			columns.forEach(function (is_visible, index) {
				$.each($('tr', datatable.table().header()), function () {
					var col = $($(this).children()[index]);
					is_visible == true ? col.show() : col.hide();
				});
			});
		});
	},

	RecreateDataTable: function (options) {
		if (dataTableInstance) {
			dataTableInstance.destroy();
		}
		tableEl.DataTable({
			responsive: true,
			processing: false,
			'columnDefs': baseOptions.columnDefs,
			pagingType: 'simple',
			"autoWidth": true,
			"serverSide": true,
			"ajax": BizAPP.List.getGridData,
			"columns": baseOptions.columnList,
			"searching": false,
			"info": false,
			"order": queryParams.order ? [queryParams.order] : [],
			"lengthMenu": [[10, 20, 50, -1], [10, 20, 50, "All"]],
			"pageLength": queryParams.pageSize,
			"createdRow": function (row, data, index) {
				$(row).attr('roid', data.uniqueid + ':' + data.objecttype + ':' + data.version);
				if (tableOptions.rowTemplate) {
					var tpl = tableOptions.rowTemplate
					_.each(data, function (obj, key) {
						var rptStr = '{{' + key + '}}';
						tpl = tpl.replace(new RegExp(rptStr, 'g'), obj);
					})
					$(row).html(tpl);
				}
			},
			orderCellsTop: true,
			'initComplete': function (settings, json) {
				console.log('DataTables has finished its initialisation.', tableEl.data());
				if (!tableOptions.rowTemplate) {
					BizAPP.List.Filter.SetupFilters();
				} else {
					//$('#baseTable thead').remove()
				}
				// eval(tableOptions.postScript);
				dataTableInstance = tableEl.DataTable();
				tableEl.addClass('table')
				BizAPP.List.completeSetup();
			}
		});

	},

	getGridData: function (params, scallback, x) {
		BizAPP.List._setQueryParams(params)
		var qParams = BizAPP.List._getQueryParams();
		qParams.callback = function (data) {
			if (data && data.length === 0) {
				$('.no_record_row').hide()
				//$('.dataTables_paginate').hide();
				scallback({ "data": [] })
				// return;
			} else {
				$('.no_record_row').hide()
				if (!data) {
					data = [];
				}
				scallback({ "data": data, "recordsTotal": 5000, "recordsFiltered": 5000 })
			}
		};
		if (baseOptions.firstLoad === true || baseOptions.initialData) {
			baseOptions.firstLoad = false;
			baseOptions.objectType = baseOptions.initialData[0] ? baseOptions.initialData[0].objecttype : '';
			qParams.callback(baseOptions.initialData)
		} else {
			console.log('Calling Server for Data', qParams)
			BizAPP.List.RefetchData(qParams);
		}
	}
};

$(function () {
	var scripts = [
		'https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.1/underscore-min.js',
		'resources/controls/liquorTree.js',
		'resources/controls/components.js',
		'https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.20/js/dataTables.bootstrap4.min.js',
		'https://cdn.datatables.net/responsive/2.2.3/js/dataTables.responsive.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment-with-locales.js',
	],
		eachSeries = function (arr, iterator, callback) {
			callback = callback || function () { };
			if (!arr.length) {
				return callback();
			}
			var completed = 0;
			var iterate = function () {
				iterator(arr[completed], function (err) {
					if (err) {
						callback(err);
						callback = function () { };
					}
					else {
						completed += 1;
						if (completed >= arr.length) {
							callback(null);
						}
						else {
							iterate();
						}
					}
				});
			};
			iterate();
		};
	eachSeries(scripts, BizAPP.List._loadScripts, BizAPP.List._loadCSS);
});

function CallGPQGetFields(chc, event) {
	var $grid = $(getSourceElement(event)).closest('[bza_data]'),
		queryId = $grid.find('[bizapp_eid]').attr('bizapp_eid'),
		targetType = "";
	if (queryId) {
		var qmd = BizAPP.Session.EvaluateExpression({ sync: true, compute: true, expression: 'this.MetaFieldSet.GetIIClientQuery("' + queryId + '")', contexts: 'uicontext' }).value[1];
		qmd = JSON.parse(qmd);
		targetType = qmd.TargetType;
		if (!targetType)
			targetType = qmd.QueryObject.TargetBOTypeId;
		if (!targetType)
			targetType = qmd.QueryObject.TargetBOType;
	}

	if (!targetType) {
		BizAPP.UI.InlinePopup.Alert({ title: '', errorMessage: 'Something went wrong, please retry.Could not find target type for query.', btnOk: true, txtOk: 'OK' });
		return;
	}

	baseOptions.objectType = targetType;
	queryParams.queryId = queryId;
	BizAPP.List._fetchOptionsFromStorage();
	queryParams.queryId = queryId;

	var al = `<div class="dropdown"> &nbsp;
				<div class="navigation dropdown-menu fieldPickerDropdown dropdown-menu-right" style="width: 350px; right:0; left:unset">
					<span></span>
					<div id="treeContainer1"></div>  
				</div>
			</div>
			<style>.dropdown .btn{width:auto}</style>`
	$grid.find('.gAddFieldsPQ').parent().find('.dropdown').remove()
	$grid.find('.gAddFieldsPQ').parent().append(al);

	BizAPP.List.AdditionalFields.SetSelectedFields = function (a) {
		if (a) {
			$grid.find('.fieldPickerDropdown').toggleClass('show');
			return;
		}
		var af = treeInstance.save();
		var afs = ''
		queryParams.additionalFields = []
		_.each(af, function (o, k) {
			if(o.data.newtext == undefined)
				o.data.newtext = o.data.text = o.data.key.replace(/\./g,' ')
 			queryParams.additionalFields.push(o.data)
			afs += o.data.key + "[_TVS]" + o.data.newtext + "[_IS]";
		})

		BizAPP.List._saveOptionsToStorage();
		ajaxAsyncCall("OptGridEx", ['ApplyAdditionalFields', JSON.parse($grid.attr('bza_data')).chc, afs], true, true);
	}
	BizAPP.List.AdditionalFields.showTree();
}