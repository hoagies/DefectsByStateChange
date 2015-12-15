Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
	title: 'Dashboard Directory',
	launch: function() {
	
		var panel = new Ext.Panel({
			width: '100%',
			height: 600,
			autoScroll: true,
			xtype: 'container',
			id: 'container',
			layout: 'vbox',
			items: [{
				itemId: 'store1panel',
				flex: 1,
				width: '100%',
				title: 'Closed Defects',
				xtype: 'panel',
				autoScroll: true
			},{
				itemId: 'store2panel',
				flex: 1,
				width: '100%',
				title: 'Fixed Defects',
				xtype: 'panel',
				autoScroll: true
			},{
				itemId: 'store3panel',
				flex: 1,
				width: '100%',
				title: 'Ready for Test Defects',
				xtype: 'panel',
				autoScroll: true
			}],
			frame: true,
			align: 'stretch'
		});
		this.add(panel);

		var filter1 = Ext.create('Rally.data.lookback.QueryFilter', {
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
					property: '__At',
					value: 'current'
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: 'State',
					operator: '=',
					value: 'Closed'
		}));
		var snapshotStore1 = Ext.create('Rally.data.lookback.SnapshotStore', {
			id: 'store1',
			pageSize: 200,
			limit: 10000,
			fetch: ['Name','Parent','_PreviousValues.State','FormattedID','_UnformattedID','_ValidFrom','Project','State','_ItemHierarchy'],
			filters: filter1,
			hydrate: ['_PreviousValues.State','State','Project'],
			autoLoad: true,
			listeners: {
				load: function(store, records) {
					this._onLoad(store, records);
				},
				scope: this
			}
		});

		var filter2 = Ext.create('Rally.data.lookback.QueryFilter', {
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
					property: '__At',
					value: 'current'
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: 'State',
					operator: '=',
					value: 'Fixed'
		}));
		var snapshotStore2 = Ext.create('Rally.data.lookback.SnapshotStore', {
			id: 'store2',
			pageSize: 200,
			limit: 10000,
			fetch: ['Name','Parent','_PreviousValues.State','FormattedID','_UnformattedID','_ValidFrom','Project','State','_ItemHierarchy'],
			filters: filter2,
			hydrate: ['_PreviousValues.State','State','Project'],
			autoLoad: true,
			listeners: {
				load: function(store, records) {
					this._onLoad(store, records);
				},
				scope: this
			}
		});

		var filter3 = Ext.create('Rally.data.lookback.QueryFilter', {
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
					property: '__At',
					value: 'current'
		})).and(Ext.create('Rally.data.lookback.QueryFilter', {
					property: 'State',
					operator: '=',
					value: 'Ready for Test'
		}));
		var snapshotStore3 = Ext.create('Rally.data.lookback.SnapshotStore', {
			id: 'store3',
			pageSize: 200,
			limit: 10000,
			fetch: ['Name','Parent','_PreviousValues.State','FormattedID','_UnformattedID','_ValidFrom','Project','State','_ItemHierarchy'],
			filters: filter3,
			hydrate: ['_PreviousValues.State','State','Project'],
			autoLoad: true,
			listeners: {
				load: function(store, records) {
					this._onLoad(store, records);
				},
				scope: this
			}
		});
	},
	
	_onLoad: function(store, records){
		
		var defects = [];
		var id;
		var storeID = store.storeId;
		
		Ext.Array.each(records, function(record) {
			id = 'DE' + record.get('_UnformattedID');
			
            defects.push({
                Name: record.get('Name'),
                FormattedID: id,
				State: record.get('State'),
				Previous: record.get('_PreviousValues.State'),
				From: formatDate(record.get('_ValidFrom')),
				Project: record.get('Project').Name
            });
		});
		
		var myStore = Ext.create('Rally.data.custom.Store', {
			data: defects,
			id: storeID,
			// groupField: 'From',
			// groupDir: 'DESC',
			autoLoad: true,
			pageSize: 200,
			limit: Infinity,
			listeners: {
				load: function(store, records) {
					this._onLoad2(store);
				},
				scope: this
			}
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
		
		var storeID = store.storeId;

		function formatDate(date) {
			if(!date) { return ''; }
			var dateString = new Date(date);
			thisYear = dateString.getFullYear();
			thisMonth = ("0" + (dateString.getMonth() + 1)).slice(-2);
			thisDay = ("0" + dateString.getDate()).slice(-2);
			thisDate = thisMonth + "/" + thisDay + "/" + thisYear;
			return(thisDate);
		}


        var treeview = Ext.create('Ext.Container', {
            items: [{
				xtype: 'rallygrid',
				width: '99%',
				// id: 'DefectGrid',
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
							flex: 3
						},
						{
							text: 'Change Date',
							dataIndex: 'From',
							flex: 2
						},
						{
							text: 'State',
							dataIndex: 'State',
							flex: 2
						},
						{
							text: 'Previous State',
							dataIndex: 'Previous',
							flex: 2
						}
				],
				store: store
			}]
		});
		console.log('Loading to: ',storeID,'panel');
		this.down('#'+storeID+'panel').add(treeview);

	}
	
});