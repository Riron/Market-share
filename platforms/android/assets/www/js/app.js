// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('marketshare', ['ionic', 'firebase'])
.value('FBURL', 'https://market-share.firebaseio.com')
.run(function($ionicPlatform, SimpleLoginFactory, $rootScope, $state, $urlRouter) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  $rootScope.auth = SimpleLoginFactory.init();

  $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
    console.log(toState)
    console.log(SimpleLoginFactory.isAuth())
    if(!SimpleLoginFactory.isAuth() && (toState.name != 'login')) {
      event.preventDefault();
      console.log('prevent')
      SimpleLoginFactory.getUser(function (user) {
        console.log(user);
        if(user) {
          console.log('continue to state')
          $state.go(toState.name);
        }
        else {
          console.log('redirect to login')
          $state.go('login');
        }
        console.log('gogo')
      })
      /*SimpleLoginFactory.auth.$getCurrentUser().then(function (user) {
        console.log(SimpleLoginFactory.isAuth());
        if(!user) {
          $state.go('login');
        }
      }, function () {
        $state.go('login');
      })*/
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'MenuCtrl as app'
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl as ctrl'
        }
      }
    })

    .state('app.todos', {
      url: "/todos/:todosId",
      views: {
        'menuContent' :{
          templateUrl: "templates/todos.html",
          controller: 'TodosCtrl as ctrl'
        }
      }
    })

    .state('app.todo', {
      url: "/todos/:todosId/:todoId",
      views: {
        'menuContent' :{
          templateUrl: "templates/todo.html",
          controller: 'TodoCtrl as ctrl'
        }
      }
    })

    .state('app.archive', {
      url: "/archive",
      views: {
        'menuContent' :{
          templateUrl: "templates/done.html",
          controller: 'HomeCtrl as ctrl'
        }
      }
    })

    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: 'LoginCtrl as ctrl'
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

