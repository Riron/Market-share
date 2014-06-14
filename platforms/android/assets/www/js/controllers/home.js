var HomeCtrl = function ($ionicLoading, firebaseRefService, FirebaseService, $rootScope) {
	var ref = FirebaseService.ref().child('lists');
	this.lists = FirebaseService.syncData(ref.child($rootScope.auth.user.id));

	this.formAdd = false;
	this.formText = '';

	$ionicLoading.show({
      template: '<i class="ion-looping"></i> Loading...'
  });

  this.lists.$on('loaded', function() {
	  $ionicLoading.hide();
	});
}

HomeCtrl.prototype.addList = function () {
	var newList = {title: this.formText, archive: false, permissions: {} };
	// newList.permissions[this.$rootScope.auth.user.id] = true;
	this.lists.$add(newList);
	this.formText = '';
	this.addForm = false;
};

HomeCtrl.prototype.listArchive = function (id) {
	this.lists[id].archive = !this.lists[id].archive;
	this.lists.$save(id);
}

app.controller('HomeCtrl', HomeCtrl);