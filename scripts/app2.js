

// Prompt the user for a name to use.
var name = prompt("Your name?", "Guest");
if(name.length == 0 || name == ' '){name="Noob"};
var currentStatus = "online";
var app = angular.module('presence', ['firebase']);

var amOnline = new Firebase('https://pr3z.firebaseio.com/.info/connected');
var userRef = new Firebase('https://pr3z.firebaseio.com/presence/' + name);
var ref = new Firebase('https://pr3z.firebaseio.com/presence');
var gameRunning = false;
var dead = false;

// userRef.child('x').set("yyy");x

amOnline.on('value', function(snapshot) {
  if (snapshot.val()) {
    var sessionRef = userRef.push();

}
});

ref.on('child_changed', function(childSnapshot, prevChildKey) {

    // ------------------------------- NEEDS FIX -------------------------------
    // code to handle child data changes.
    app.controller('LobbyCtrl', 
    function($scope, $firebase) {

        var obj = $firebase(ref).$asObject();
        obj.$bindTo($scope, "data");

    });
});

app.controller('LobbyCtrl', 
  function($scope, $firebase) {

    // get database and bind it to dom
    var obj = $firebase(ref).$asObject();
    obj.$bindTo($scope, "data");

    $scope.create = function() {
        console.log("Create button pressed.")
    };
    $scope.reset = function() {
        console.log("Reset button pressed.")
    };
    $scope.delete = function() {
        console.log("Delete button pressed.")
    };

    $scope.myStyle = {'background-color':'blue'};
    $scope.enemyStyle = {'background-color':'red'};

    if(!gameRunning){
        game(obj);
        gameRunning = true;
    }

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

app.filter('p2pos', function(){
    return function(input){
        if(input==null) return "online";
        return "120","100";
    };
});



// game script

// MOVE OBJECT DIAGONALLY
// $(document).ready(function(){
var game = function(obj){

    var movementSpeed = 2;
    var intervalSpeed = 100;
    var runAnimation = true;
    var animationSpeed = 100;
    var sendingToFirebase = true;
    var newName = '.' + name;

    var leftMarginLimit = parseInt($('body').css('width')) - parseInt($('.player').css('width'));
    // var leftMarginLimit = parseInt($(name).parent().css('width')) - parseInt($(name).css('width'));
    var topMarginLimit = parseInt($('body').css('height')) - parseInt($('.player').css('height'));
    // var topMarginLimit = parseInt($(name).parent().css('height')) - parseInt($(name).css('height'));
    var leftMargin = parseInt($(".player").css('margin-left'));
    var topMargin = parseInt($(".player").css('margin-top'));
    var animationComplete = true;

    var leftM = 0;
    var topM = 0;

    // flags
    var left = false;
    var right = false;
    var up = false;
    var down = false;

    $(document).keyup(function(key) {

        console.log(key.which);
        console.log("obj");
        console.log(obj);

        var isSelf = true;

        $.each(obj, function(index, value) {

            if(value == null || value.x == undefined || value.y == undefined){
                return;
            }
            
            if(value.x == leftMargin && value.y == topMargin){
                if(!isSelf){
                    console.log("OVERLAY");
                }
                isSelf = false;
            }
            
        }); 

        if(!dead){

            if (key.which == 37){left = false;}
            if (key.which == 39){right = false;}
            if (key.which == 38){up = false;}
            if (key.which == 40){down = false;}
        }
    });

    $(document).keydown(function(key) {
        if(!dead){
            if (key.which == 37){left = true;}
            if (key.which == 39){right = true;}
            if (key.which == 38){up = true;}
            if (key.which == 40){down = true;}
        }
        if (key.which == 37 ||
          key.which == 39 ||
          key.which == 38 ||
          key.which == 40){ 
        }
    });

    setInterval(runMovement,intervalSpeed);
    // setInterval(runEnemy,enemySpeed);
    setInterval(runEnemy,1000);

    function runEnemy(){
        //move enemy

        // decide move direction
        var random1 = Math.floor(Math.random()*11);
        
        if(random1 > 8){
            // left
            leftM = 0;

        }
        else if(random1 > 5){
            // right
            leftM = leftMarginLimit;

        }
        else if(random1 > 3){
            // up
            topM = 0;
        }
        else{
            // down
            topM = topMarginLimit;
        }

        $('div.enemy').css("margin-left",leftM);
        $('div.enemy').css("margin-top",topM);

        if(dead == false){
             setTimeout(function(){
                comparePositions();
            }, 800);
            
        }

    }


    function runMovement() {

        if(dead == false){

            // LEFT
            if (left){
                leftMargin = 0;
            }

            // RIGHT
            if (right){
                leftMargin = leftMarginLimit;
            }

            // UP
            if (up){
                topMargin = 0;
            }

            // DOWN
            if (down){
                topMargin = topMarginLimit;
            }

            userRef.child('x').set(leftMargin);
            userRef.child('y').set(topMargin);

            left = false;
            right = false;
            up = false;
            down = false;
        }
        else{
            userRef.child('x').set(350);
            userRef.child('y').set(350);
        }

        
        
    }

    // compare positions
    function comparePositions(){

        // console.log("Enemy(x: "+ leftM + ",y: " +topM+ ")");
        // console.log("Player(x: "+ leftMargin + ",y: " + topMargin+  ")");

        if((topM == topMargin) && (leftM == leftMargin)){
            console.log("COLLISION");
            dead = true;

            topMargin = 350;
            leftMargin = 350;

            userRef.child('x').set(leftMargin);
            userRef.child('y').set(topMargin);

            setTimeout(function(){
                dead = false;
            }, 3000);

        }


    }

}




