var TodosCtrl = function ($stateParams, $ionicLoading, $ionicPopup, FirebaseService, $rootScope) {
	var ref = FirebaseService.ref().child('lists/' + $rootScope.auth.user.id + '/' + $stateParams.todosId);
	this.list = FirebaseService.syncData(ref);
	this.todos = FirebaseService.syncData(ref.child('todos'));

	this.value = '';
	this.listId = $stateParams.todosId;
	
	// Dependencies
	this.$ionicPopup = $ionicPopup;

	// Loading screen
	$ionicLoading.show({
      template: '<i class="ion-looping"></i> Loading...'
  });
  this.todos.$on('loaded', function() {
	  $ionicLoading.hide();
	});
};

TodosCtrl.prototype.addTodo = function (e) {
	if (e && e.keyCode != 13) return;
	this.todos.$add({value: this.value, date: new Date(), checked: false});
	this.value = '';
};

TodosCtrl.prototype.deleteTodo = function(key) {
	var self = this;
	
	// Confirmation pop-up
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