var CategoriesCtrl = function (FirebaseService, $rootScope) {
	var ref = FirebaseService.ref().child($rootScope.auth.user.id + '/categories');
	this.categories = FirebaseService.syncData(ref);

	this.color = 'light';
}

CategoriesCtrl.prototype.addCategory = function () {
	this.categories.$add({title: this.title, color: this.color});
}

CategoriesCtrl.prototype.deleteCategory = function (key) {
	this.categories.$remove(key);
}

CategoriesCtrl.prototype.editCategory = function (key) {
	this.categories.$save(key);
}

app.controller('CategoriesCtrl', CategoriesCtrl);