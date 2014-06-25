var HomeCtrl = function ($ionicLoading, FirebaseService, $rootScope) {
	var ref = FirebaseService.ref();
	
	this.listsRef = FirebaseService.syncData(ref.child('lists'));
	//this.listsRef = ref.child('lists');
	this.userLists = FirebaseService.syncData(ref.child('users/' + $rootScope.auth.user.id + '/lists'));
	
	var self = this;
	this.readeableLists = [];
	
	this.userLists.$on('child_added', function (snap) {
		var list = self.listsRef.$child(snap.snapshot.value.key);
		self.readeableLists.push(list)
	})

	this.formAdd = false;
	this.formText = '';

	$ionicLoading.show({
      template: '<i class="ion-looping"></i> Loading...'
  });

  this.userLists.$on('loaded', function() {
	  $ionicLoading.hide();
	});
}

HomeCtrl.prototype.addList = function () {
	var self = this;
	var newList = {title: this.formText, archive: false, permissions: {} };
	// newList.permissions[this.$rootScope.auth.user.id] = true;
	this.lists.$add(newList).then(function(ref) {
  	self.userLists.$add({key: ref.name()});
	});
	this.formText = '';
	this.addForm = false;
};

HomeCtrl.prototype.listArchive = function (id) {
	this.lists[id].archive = !this.lists[id].archive;
	this.lists.$save(id);
}

app.controller('HomeCtrl', HomeCtrl);