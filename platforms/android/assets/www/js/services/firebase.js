app.factory('firebaseRefService', function(FBURL) {

	return function() {
		return new Firebase(FBURL);
	}
})

var FirebaseService = function (FBURL, $firebase) {
	this.FBURL = FBURL;
	this.$firebase = $firebase;
}

FirebaseService.prototype.ref = function () {
	return new Firebase(this.FBURL);
}

FirebaseService.prototype.syncData = function (data) {
	return this.$firebase(data);
}

app.service('FirebaseService', FirebaseService);