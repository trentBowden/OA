var mostRecent = document.getElementById('roomCode');
var phoneAnswer = document.getElementById('phoneAnswer');
var connectedStatusDiv = document.getElementById('connectedStatus');
var randomString = Math.random().toString(36).substring(10);
//substring(7) before, but doubt I'll need that.
mostRecent.innerText = randomString;
var changedTo;
var ref = firebase.database().ref('current/' + randomString);
var connectedStatus;

ref.set({
    direction: "",
    playing: true
});


ref.on('value', function(snapshot) {
    console.log("Value found");

    connectedStatus = snapshot.child("playing").val();
    console.log("External device playing: "+ connectedStatus);
    connectedStatusDiv.innerText = (connectedStatus ? "Ready for external controllers" : "Disconnected, offline only");

    changedTo = snapshot.child("direction").val();

    if ((changedTo == "left") ||
        (changedTo == "right") ||
        (changedTo == "up") ||
        (changedTo == "down")) {
        console.log("direction: " + changedTo);
        phoneAnswer.innerText = changedTo;
        letterCalled(changedTo);

        ref.update({
            direction: ""
        });
    }
});

console.log("Database_get JS initialised");

