var TodoCtrl = function ($stateParams, $ionicPopup, $state, FirebaseService, $rootScope, $scope) {
	var ref = FirebaseService.ref().child('lists/' + $stateParams.todosId + '/todos/' + $stateParams.todoId);
	this.todo = FirebaseService.syncData(ref);
	var catRef =  FirebaseService.ref().child('/users/' + $rootScope.auth.user.id + '/categories');
	this.categories = FirebaseService.syncData(catRef);
	
	// Dependencies
	this.$ionicPopup = $ionicPopup;
	this.$state = $state;
	this.$stateParams = $stateParams;
	$scope.categories = this.categories;
	this.$scope = $scope;

}

TodoCtrl.prototype.deleteTodo = function() {
	var self = this;
	var confirmPopup = this.$ionicPopup.confirm({
		title: 'Delete task',
		template: 'Are you sure you want to delete this task?'
	});
	confirmPopup.then(function(res) {
		if(res) {
			self.todo.$remove();
			self.$state.go('app.todos', {todosId: self.$stateParams.todosId});
		} else {
			console.log('Cancel deletion');
		}
	});
};

TodoCtrl.prototype.checkTodo = function () {
	this.todo.checked = !this.todo.checked;
	this.todo.$save();
}

TodoCtrl.prototype.editTodo = function () {
	this.edit = !this.edit;
	this.todo.$save();
}

TodoCtrl.prototype.setCategory = function () {
	var self = this;
	angular.forEach(this.todo.categories, function (value, key) {
		self.$scope.categories[value.key].checked = true;
	});
	var alertPopup = this.$ionicPopup.show({
		title: 'Category',
		template: '<ion-checkbox ng-repeat="category in categories" ng-model="category.checked">{{category.title}}</ion-checkbox>',
		scope: self.$scope,
		buttons: [
     {
       text: 'Save',
       type: 'button-positive',
       onTap: function () { return self.$scope.categories }
     }
   ]
	});
	alertPopup.then(function(res) {
		cat = [];
		angular.forEach(res, function (value, key) {
			if(value.checked) {
				cat.push({key: key, value: value})
			}
		})
		self.todo.categories = cat;
		self.todo.$save();
	});
}

app.controller('TodoCtrl', TodoCtrl);