var sessionID = "";
var sessionIDInput = document.getElementById("sessionID");
var mostRecent = document.getElementById("mostRecent");
console.log("Random: " + sessionID);
var connectedStatus = document.getElementById("connectedStatus");

// function letterCalled(input) {
//     setDirection(input);
// }

function setSessionID(){
    sessionID = sessionIDInput.value;
    return firebase.database().ref('current/' + sessionID  ).once('value').then(function(snapshot) {
        if (snapshot.child("playing").val() == true) {
            console.log("Joined game in progress");
            connectedStatus.innerText = "Connected!";
            connectedStatus.style.borderBottom = "thick solid green";
            console.log("session ID changed to: " + sessionID);
        } else {
            console.log(snapshot.child("playing").val() + " IS THE VAL");
            alert("Sorry, couldn't connect! are you sure you entered it right?");
            connectedStatus.innerText = "Not Connected!";
            connectedStatus.style.borderBottom = "thick solid red";
        }
    });
}

function sessionIdIsSet() {
    if (sessionID == "") {
        alert("Session Id needs filling!");
        return false;
    } else {
        return true;
    }
}

function setDirection(directionInput) {
    if (sessionIdIsSet) {
        console.log("Setting direction to: "+ directionInput);
        mostRecent.innerText = directionInput;
        $("#mostRecent").fadeTo( "fast", 1 );
        $("#mostRecent").fadeTo( "fast", .33 );

        firebase.database().ref('current/' + sessionID+ "/direction/").set(directionInput);
    } else {
        console.log("Session ID not Set. Attempt to set direction failed.");
    }
}

document.getElementById('submit').addEventListener('click',function(){setSessionID();});
document.getElementById('rightButton').addEventListener('click',function(){setDirection("right");});
document.getElementById('leftButton').addEventListener('click',function(){setDirection("left");});
document.getElementById('upButton').addEventListener('click',function(){setDirection("up");});
document.getElementById('downButton').addEventListener('click',function(){setDirection("down");});
console.log("Database JS initialised");