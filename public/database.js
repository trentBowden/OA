var random = "";
var mostRecent = document.getElementById('mostRecent');
var sessionIDInput = document.getElementById("sessionID");
console.log("Random: " + random);
var databaseDirection;

function setSessionID(){
    console.log("session ID changed to: " + sessionIDInput.value);
    random = sessionIDInput.value;
    getDirection();
}

function sessionIdIsSet() {
    if (random == "") {
        alert("Session Id needs filling!");
        return false;
    } else {
        return true;
    }
}

function setDirection(directionInput) {
    if (sessionIdIsSet) {
        firebase.database().ref('current/' + random).set({
            direction: directionInput
        });
    }
}

function getDirection() {
    if (sessionIdIsSet()) {

         databaseDirection = firebase.database().ref('posts/' + random  + '/direction');
         mostRecent.innerText = databaseDirection.val;

        databaseDirection.on('value', function(snapshot) {
            console.log("Catcher has found it!" + snapshot.val());
            mostRecent.innerText = "hey look at us: " + databaseDirection.val;
        });
    }
}

document.getElementById('submit').addEventListener('click',function(){
    setSessionID();
});
document.getElementById('rightButton').addEventListener('click',function(){
    setDirection("right");
});
document.getElementById('leftButton').addEventListener('click',function(){
    setDirection("left");
});
document.getElementById('upButton').addEventListener('click',function(){
    setDirection("up");
});
document.getElementById('downButton').addEventListener('click',function(){
    setDirection("down");
});
console.log("Database JS initialised");