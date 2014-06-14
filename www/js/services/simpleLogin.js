var SimpleLogin = function ($firebaseSimpleLogin, firebaseRefService) {
	// Dependencies
	this.firebaseRefService = firebaseRefService;
	this.$firebaseSimpleLogin = $firebaseSimpleLogin;
	
	// Var
	this.auth = null;
	this.authenticated = false;

	this.assertAuth = function () {
    if(this.auth === null) { throw new Error('Must call loginService.init() before using its methods'); }
  }
}

SimpleLogin.prototype.isAuth = function () {
	if(this.authenticated) {
		return true;
	}
	return false;
}

SimpleLogin.prototype.init = function () {
	/*ionic.Platform.ready(function () {
		return this.auth = this.$firebaseSimpleLogin(this.dataRef);
	})*/
	this.auth = this.$firebaseSimpleLogin(this.firebaseRefService());
	this.getUser();
	return this.auth;
}

SimpleLogin.prototype.getUser = function (callback) {
	var self = this;
	this.auth.$getCurrentUser().then(function (user) {
    if(user) {
    	self.authenticated = true;
    }
    if(callback) { callback(user) };
  });
}

SimpleLogin.prototype.login = function (email, password, callback) {
	var self = this;
	this.assertAuth();

	this.auth.$login('password',  {
		email: email,
		password: password,
		rememberMe: true
	}).then(function(user) {
		self.authenticated = true;
		if( callback ) {
		  callback(null, user);
		}
	}, callback);
}

SimpleLogin.prototype.signup = function (email, password) {
	this.auth.$createUser(email, password, true);
}

SimpleLogin.prototype.logout = function () {
	console.log('Disconnected')
	this.assertAuth();
	this.auth.$logout();
	this.authenticated = true;
}


app.service('SimpleLoginFactory', SimpleLogin);