var HomeCtrl = function ($firebase, FBURL) {
	this.lists = $firebase(new Firebase(FBURL + '/lists'));
	this.formAdd = false;
	this.formText = '';
}

HomeCtrl.prototype.addList = function () {
	this.lists.$add({title: this.formText, archive: false});
	this.formText = '';
	this.addForm = false;
};

HomeCtrl.prototype.listArchive = function () {
	
}

app.controller('HomeCtrl', HomeCtrl);