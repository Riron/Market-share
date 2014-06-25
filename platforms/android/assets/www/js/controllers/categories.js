var CategoriesCtrl = function (FirebaseService, $rootScope, $ionicPopup) {
	var ref = FirebaseService.ref().child('/users/' + $rootScope.auth.user.id + '/categories');
	this.categories = FirebaseService.syncData(ref);

	this.$ionicPopup = $ionicPopup;

	this.color = 'light';
}

CategoriesCtrl.prototype.addCategory = function () {
	this.categories.$add({title: this.title, color: this.color});
	this.title = '';
}

CategoriesCtrl.prototype.addColor = function () {
	var alertPopup = this.$ionicPopup.alert({
		title: 'Choose a color',
		template: '<span class="color-box bg-stable"></span><span class="color-box bg-positive"></span><span class="color-box bg-calm"></span><span class="color-box bg-balanced"></span><span class="color-box bg-energized"></span><span class="color-box bg-assertive"></span><span class="color-box bg-royal"></span><span class="color-box bg-dark"></span>'
	});
	alertPopup.then(function(res) {
		console.log('Thank you for not eating my delicious ice cream cone');
	});
}

CategoriesCtrl.prototype.deleteCategory = function (key) {
	this.categories.$remove(key);
}

CategoriesCtrl.prototype.editCategory = function (key) {
	this.categories.$save(key);
}

app.controller('CategoriesCtrl', CategoriesCtrl);