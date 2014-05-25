var TodoCtrl = function ($firebase, FBURL, $stateParams, $ionicPopup, $state) {
	this.todo = $firebase(new Firebase(FBURL + '/lists/' + $stateParams.todosId + '/todos/' + $stateParams.todoId));
	this.$ionicPopup = $ionicPopup;
	this.$state = $state;
	console.log(this.todo)
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

app.controller('TodoCtrl', TodoCtrl);