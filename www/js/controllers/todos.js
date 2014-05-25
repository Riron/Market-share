var TodosCtrl = function ($firebase, FBURL, $stateParams, $ionicLoading, $ionicPopup, $scope) {
	this.todos = $firebase(new Firebase(FBURL + '/lists/' + $stateParams.todosId + '/todos'));
	this.value = '';
	this.$ionicPopup = $ionicPopup;
	this.listId = $stateParams.todosId;

	$ionicLoading.show({
      template: '<i class="ion-looping"></i> Loading...'
  });

  this.todos.$on('loaded', function() {
	  $ionicLoading.hide();
	});
	this.todos.$on('loaded', function() {
	  $ionicLoading.hide();
	});
};

TodosCtrl.prototype.addTodo = function (e) {
	if (e.keyCode != 13) return;
	this.todos.$add({value: this.value, date: new Date(), checked: false});
	this.value = '';
};

TodosCtrl.prototype.deleteTodo = function(key) {
	var self = this;
	var confirmPopup = this.$ionicPopup.confirm({
		title: 'Delete task',
		template: 'Are you sure you want to delete this task?'
	});
	confirmPopup.then(function(res) {
		if(res) {
			self.todos.$remove(key);
		} else {
			console.log('Cancel deletion');
		}
	});
};

TodosCtrl.prototype.todoCheck = function (key) {
		this.todos.$save(key);
};

app.controller('TodosCtrl', TodosCtrl);