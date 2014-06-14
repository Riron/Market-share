var TodoCtrl = function ($stateParams, $ionicPopup, $state, FirebaseService, $rootScope) {
	var ref = FirebaseService.ref().child('lists/' + $rootScope.auth.user.id + '/' + $stateParams.todosId + '/todos/' + $stateParams.todoId);
	this.todo = FirebaseService.syncData(ref);
	
	// Dependencies
	this.$ionicPopup = $ionicPopup;
	this.$state = $state;
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
			this.$state.go('app.todos');
		} else {
			console.log('Cancel deletion');
		}
	});
};

TodoCtrl.prototype.checkTodo = function () {
	this.todo.checked = !this.todo.checked;
	this.todo.$save();
}

TodoCtrl.prototype.setCategory = function () {

	var alertPopup = this.$ionicPopup.alert({
		title: 'Category',
		template: 'Coming soon : associate items to categories'
	});
	alertPopup.then(function(res) {
		console.log('choice was made')
	});
}

app.controller('TodoCtrl', TodoCtrl);