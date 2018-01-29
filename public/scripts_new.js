//Variables
var startingLevel = 300;
var currentLevel = startingLevel;
var sizeDifference = 30; // Size diff between levels, in nextLevelCheck()
var srces = ["images/up.png", "images/down.png", "images/left.png", "images/rightNew.png"];
var audio = new Audio('sounds/success.wav');
var click = new Audio('sounds/click.mp3');
var humanWords = ["up", "down", "left", "right"];
var currentLine = [];
var currentHumanWord;
var currentRand;
var currentInspecting = 0;
var totalScore = 0;


//Functions

function displayToUser(input) {
    console.log("Found it! you said "+ input );
    latestAnswer.innerHTML = input;
}
function correctLetterCheck(input){
    var currentLevelPoints = 500-currentLevel;
    if (input == currentLine[currentInspecting]) {
        totalScore+=currentLevelPoints;
        score.innerHTML=currentLevelPoints;
        latestAnswer.style.borderBottom = "thick solid green";
    } else {
        latestAnswer.style.borderBottom = "thick solid red";
    }
}
function generate_image() {
    console.log("About to generate images");
    clearAndReset();
    var numPics = 4;
    //There should be seven/eight levels
    if (currentLevel >= startingLevel) {
        numPics = 1;
        //20/200
    } else if (currentLevel >= startingLevel-(1*sizeDifference)) {
        numPics = 2;
        //20/100
    } else if (currentLevel >= startingLevel-(2*sizeDifference)) {
        numPics = 3;
        //20/70
    } else if (currentLevel >= startingLevel-(3*sizeDifference)) {
        numPics = 4;
        //20/50
    } else if (currentLevel >= startingLevel-(4*sizeDifference)) {
        numPics = 5;
        //20/40
    } else if (currentLevel >= startingLevel-(5*sizeDifference)) {
        numPics = 6;
        //20/30
    } else if (currentLevel >= startingLevel-(6*sizeDifference)) {
        numPics = 7;
        //20/20
    } else if (currentLevel >= startingLevel-(7*sizeDifference)) {
        numPics = 8;
    }
    for (var i = 0; i < numPics; i++) {
        currentRand = Math.floor(Math.random() * 3);
        currentHumanWord = humanWords[currentRand];
        currentLine.push(currentHumanWord);
        //Transform: rotate(180deg)
        show_image(srces[currentRand], currentLevel, currentLevel, "image", i);
    }
    colorCurrent();
}
document.onkeydown = checkKey;
function checkKey(e) {
    e.preventDefault();
    click.play();
    console.log("key " + e.keycode);
    e = e || window.event;
    if (e.keyCode == '38' || e.keycode == '87') {
        letterCalled("up");
    }
    else if (e.keyCode == '40' || e.keycode == '83') {
        letterCalled("down");
    }
    else if (e.keyCode == '37' || e.keycode == '65') {
        letterCalled("left");
    }
    else if (e.keyCode == '39' || e.keycode == '68') {
        letterCalled("right");
    }
}
function clearAndReset() {
    console.log("Clearing & Resetting");
    var theDiv = document.getElementById("pictureArea");
    // final_span.innerHTML="Done";
    theDiv.innerHTML = "";
    currentInspecting = 0;
    currentLine = [];
}
function show_image(src, width, height, alt, id) {
    console.log("displaying next one");
    currentSrc = src;
    var tumblingE = document.createElement("img");
    tumblingE.src = src;
    tumblingE.width = width;
    tumblingE.height = height;
    tumblingE.alt = alt;
    tumblingE.id = id;

    // This next line will just add it to the <body> tag
    var theDiv = document.getElementById("pictureArea");
    theDiv.appendChild(tumblingE);
    audio.play();
}
function colorCurrent() {
    console.log("Coloring in the current one");
    for (var i = 0; i<currentLine.length; i++) {
        if (i == currentInspecting) {
            document.getElementById(i).style.borderBottom = "thick solid mistyrose";
            lookingFor.innerHTML = currentLine[currentInspecting];
        } else {
            document.getElementById(i).style.border = "none";
        }
    }
}
function finishPage() {
    clearAndReset();
    alert("You're done! Final Score = " + totalScore);
}
function finishedEntiretyCheck() {
    if (currentLevel <= 0) {
        finishPage();
        return true;
    } else {
        return false
    }
}
function nextLevelCheck() {
    if (currentInspecting+1 >= currentLine.length) {
        currentLevel = currentLevel - sizeDifference;
        generate_image(currentLevel);
        return true;
    } else {
        return false;
    }
}
function nextLetter() {
    //Play sound "small and subtle click to indicate next thing"
    if(!finishedEntiretyCheck()){
        if (!nextLevelCheck()) {
            click.play();
            currentInspecting += 1;
            console.log("Now inspecting letter# " + (currentInspecting + 1) + ", " + currentLine[currentInspecting]);
            colorCurrent();
        }
    }
}

function letterCalled(input){
    displayToUser(input);
    correctLetterCheck(input);
    nextLetter();
}

//Start it all off
function controllerStart() {
    console.log("initiating");
    if (annyang) {
        var commands = {
            'left': function() {letterCalled("left");},
            'right': function() {letterCalled("right");},
            'up': function() {letterCalled("up");},
            'down': function() {letterCalled("down");},
            'it is facing left': function() {letterCalled("left");},
            'it is facing right': function() {letterCalled("right");},
            'it is facing up': function() {letterCalled("up");},
            'it is facing down': function() {letterCalled("down");}
        };
        annyang.addCommands(commands);
        annyang.start({ autoRestart: true, continuous: true });

        generate_image(currentLevel);
        colorCurrent();
    } else {
        console.log("Problem loading Aanyang!");
    }
}
controllerStart();
