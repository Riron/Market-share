var SimpleLogin = function ($firebaseSimpleLogin, FirebaseService) {
	this.ref = FirebaseService.ref();

	this.users = FirebaseService.syncData(this.ref.child('users'));

	// Dependencies
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
	this.auth = this.$firebaseSimpleLogin(this.ref);
	this.getUser();
	return this.auth;
}

SimpleLogin.prototype.getUser = function (callback) {
	var self = this;
	ionic.Platform.ready(function () {
		self.auth.$getCurrentUser().then(function (user) {
	    if(user) {
	    	self.authenticated = true;
	    }
	    if(callback) { callback(user) };
	  });
	})
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
	var self = this;
	this.auth.$createUser(email, password).then(function (user) {
		console.log(user)
		var ref = self.users.$child(user.id);
		ref.$set({email: email});
		//self.users.$add({email: email, id: user.id});
	});
}

SimpleLogin.prototype.logout = function () {
	console.log('Disconnected')
	this.assertAuth();
	this.auth.$logout();
	this.authenticated = true;
}


app.service('SimpleLoginFactory', SimpleLogin);