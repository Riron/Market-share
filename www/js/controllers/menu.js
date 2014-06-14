var MenuCtrl = function (SimpleLoginFactory, $rootScope) {
	this.SimpleLoginFactory = SimpleLoginFactory;

	this.user = $rootScope.auth.user
}
MenuCtrl.prototype.logout = function () {
	this.SimpleLoginFactory.logout();
}

app.controller('MenuCtrl', MenuCtrl);