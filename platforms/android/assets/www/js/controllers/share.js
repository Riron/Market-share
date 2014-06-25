var ShareCtrl = function ($stateParams, FirebaseService) {
	var ref = FirebaseService.ref();
	this.users = FirebaseService.syncData(ref.child('users'));

	this.FirebaseService = FirebaseService;
	this.$stateParams = $stateParams;
}

ShareCtrl.prototype.split = function (email) {
	var split = email.split('@');
	return split[0];
}

ShareCtrl.prototype.shareList = function (userId) {
	this.users.$child(userId + '/lists').$add({key: this.$stateParams.todosId})
}

app.controller('ShareCtrl', ShareCtrl);