

// Prompt the user for a name to use.
var name = prompt("Your name?", "Guest");
var currentStatus = "online";
var app = angular.module('presence', ['firebase']);

var amOnline = new Firebase('https://pr3z.firebaseio.com/.info/connected');
var userRef = new Firebase('https://pr3z.firebaseio.com/presence/' + name);
var ref = new Firebase('https://pr3z.firebaseio.com/presence');


amOnline.on('value', function(snapshot) {
  if (snapshot.val()) {
    var sessionRef = userRef.push();
    sessionRef.child('ended').onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
    sessionRef.child('began').set(Firebase.ServerValue.TIMESTAMP);
  }
});

app.controller('LobbyCtrl', 
  function($scope, $firebase) {

    // get database and bind it to dom
    var obj = $firebase(ref).$asObject();
    obj.$bindTo($scope, "data");

    // keypress handlings
    $scope.handleKeyup = function handleKeyup(e) {
      if (e.keyCode == 65) {
        console.log("A(65) was pressed.");

      }
      if (e.keyCode == 68) {
        console.log("D(68) was pressed.");

      }
    }

    $scope.create = function() {
        console.log("Create button pressed.")
    };
    $scope.reset = function() {
        console.log("Reset button pressed.")
    };
    $scope.delete = function() {
        console.log("Delete button pressed.")
    };


  });


app.filter('timeAgo', function() {
  return function(input) {
    if (input == null) return "";
    return jQuery.timeago(input);
  };
});

app.filter('statusClass', function(){
	return function(input){
		if(input==null) return "online";
		return "offline";
	};
});
