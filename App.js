Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	title: 'Dashboard Directory',
	launch: function() {

		var filters = Ext.create('Rally.data.lookback.QueryFilter', {
			property: '_TypeHierarchy',
			operator: '=',
			value: 'Defect'
        }).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: '_ValidFrom',
					operator: '$gte',
					value: '2015-12-02'
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: 'c_TriageVerdict',
					operator: '!=',
					value: null
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: '_PreviousValues.State',
					operator: '!=',
					value: null
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: 'State',
					operator: '!=',
					value: 'Submitted'
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: 'State',
					operator: '!=',
					value: 'Reopen'
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: 'State',
					operator: '!=',
					value: 'Open'
		}));
	
		var snapshotStore = Ext.create('Rally.data.lookback.SnapshotStore', {
			pageSize: 200,
			limit: 10000,
			// fetch: ['Name','State','_PreviousValues.State','FormattedID','c_TriageVerdict','_UnformattedID','_ValidFrom','Project'],
			fetch: ['Name','Parent','_PreviousValues.State','FormattedID','_UnformattedID','_ValidFrom','Project','State','_ItemHierarchy'],
			// fetch: ['Name','_PreviousValues.LeafStoryPlanEstimateTotal','FormattedID','_UnformattedID','_ValidFrom','Project','State','LeafStoryPlanEstimateTotal'],
			filters: filters,
			hydrate: ['_PreviousValues.State','State','Project'],
			// hydrate: ['Project','Parent'],
			autoLoad: true,
			listeners: {
				load: function(store, records) {
					this._onLoad(store, records);
				},
				scope: this
			},
		});
		
	},
	
	_onLoad: function(store, records){
		
		var defects = [];
		var id;
		
		Ext.Array.each(records, function(record) {
			id = 'DE' + record.get('_UnformattedID');
			// id = 'US' + record.get('_UnformattedID');
			// id = 'F' + record.get('_UnformattedID');
			
            defects.push({
                Name: record.get('Name'),
                FormattedID: id,
				State: record.get('State'),
				Previous: record.get('_PreviousValues.State'),
				From: formatDate(record.get('_ValidFrom')),
				Project: record.get('Project').Name
            });
            // defects.push({
                // Name: record.get('Name'),
                // FormattedID: id,
				// State: record.get('ScheduleState'),
				//LeafPoints: record.get('LeafStoryPlanEstimateTotal'),
				// Previous: record.get('_PreviousValues.Project'),
				//From: record.get('_ValidFrom'),
				// From: formatDate(record.get('_ValidFrom')),
				// Project: record.get('Project').Name
            // });
		});

		var myStore = Ext.create('Rally.data.custom.Store', {
			data: defects,
			// sortInfo:{
				// field: 'From',
				// direction:'DESC'// or 'DESC' (case sensitive for local sorting)
			// },
			groupField: 'From',
			groupDir: 'DESC',
			autoLoad: true,
			pageSize: 200,
			limit: Infinity,
			listeners: {
				load: function(store, records) {
					this._onLoad2(store);
				},
				scope: this
			},
		});

		function formatDate(date) {
			if(!date) { return ''; }
			var dateString = new Date(date);
			thisYear = dateString.getFullYear();
			thisMonth = ("0" + (dateString.getMonth() + 1)).slice(-2);
			thisDay = ("0" + dateString.getDate()).slice(-2);
			thisDate = thisMonth + "/" + thisDay + "/" + thisYear;
			return(thisDate);
		}
	},
	
	_onLoad2: function(store){

		function formatDate(date) {
			if(!date) { return ''; }
			var dateString = new Date(date);
			thisYear = dateString.getFullYear();
			thisMonth = ("0" + (dateString.getMonth() + 1)).slice(-2);
			thisDay = ("0" + dateString.getDate()).slice(-2);
			thisDate = thisMonth + "/" + thisDay + "/" + thisYear;
			return(thisDate);
		}

		if(this.down('#DefectGrid')){
			this.down('#DefectGrid').destroy();
		}
		
		this.add({
			xtype: 'rallygrid',
			width: '99%',
			id: 'DefectGrid',
			// features: [
				// {
				// ftype: 'groupingsummary',
				// groupHeaderTpl: '{name} ({rows.length})',
				// startCollapsed: true
				// }
			// ],
			columnCfgs: [
					{
						text: 'ID',
						dataIndex: 'FormattedID',
						flex: 1
					},
					{
						text: 'Name',
						dataIndex: 'Name',
						flex: 10
					},
					{
						text: 'Project',
						dataIndex: 'Project',
						flex: 3,
					},
					{
						text: 'Change Date',
						dataIndex: 'From',
						flex: 2,
						// renderer: function(value) {
							// return formatDate(value);
						// }
					},
					{
						text: 'State',
						dataIndex: 'State',
						flex: 2,
					},
					{
						text: 'Previous State',
						dataIndex: 'Previous',
						flex: 2,
					}
			],
			store: store
		});

	}
	
});