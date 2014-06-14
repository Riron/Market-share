var LoginCtrl = function (SimpleLoginFactory, $state, $ionicLoading) {
	this.simpleLogin = SimpleLoginFactory;
	this.$state = $state;
	this.$ionicLoading = $ionicLoading;
}

LoginCtrl.prototype.login = function (user, pass) {
	var self = this;
	this.$ionicLoading.show({
    template: 'Logging in...'
  });
	this.simpleLogin.login(user, pass, function (err, user) {
		if(!err) {
			self.$state.go('app.home');
		}
	});
}

LoginCtrl.prototype.signup = function (user, pass) {
	this.simpleLogin.signup(user, pass);	
}

app.controller('LoginCtrl', LoginCtrl);