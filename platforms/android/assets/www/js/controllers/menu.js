var MenuCtrl = function (SimpleLoginFactory) {
	this.SimpleLoginFactory = SimpleLoginFactory;
}
MenuCtrl.prototype.logout = function () {
	this.SimpleLoginFactory.logout();
}

app.controller('MenuCtrl', MenuCtrl);