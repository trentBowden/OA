//Variables
var currentLevel = 170;
var srces = ["images/up.png", "images/down.png", "images/left.png", "images/right.png"];
var audio = new Audio('sounds/success.wav');
var humanWords = ["up", "down", "left", "right"];
var currentLine = [];
var currentHumanWord;
var currentRand;
var currentInspecting = 0;
var final = "";
var interim = "";
var letterOver = false;

//Functions
function letterOverGet() {
    letterOver = true;
}

function isLetterOverCheck() {
    if (letterOver) {
        return true;
    } else {
        return false;
    }
}

function colorCurrent() {
    console.log("calledddd");
    for (var i = 0; i<currentLine.length; i++) {
        if (i == currentInspecting) {
            document.getElementById(i).style.borderBottom = "thick solid mistyrose";
        } else {
            document.getElementById(i).style.border = "none";
        }
    }
}

function finishPage() {
    alert("You're done!");
}

function finishedEntiretyCheck() {
    if (currentLevel < 50) {
        console.log("you've finished!");
        return true;
    } else {
        return false
    }
}

function currentLevelSuccess() {
    console.log("Correct!");
}

function clearAndReset() {
    console.log("Clearing & Resetting");
    var theDiv = document.getElementById("pictureArea");
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

function nextLevelCheck() {
    var sizeDifference = 30;
    console.log("current inspecting: " + currentInspecting + " > ? " + currentLine.length);
    if (currentInspecting >= currentLine.length) {
        console.log("Yes");
        currentLevel = currentLevel - sizeDifference;
        console.log("Correct! generating another with size: " + currentLevel);
        generate_image(currentLevel);
        return true;
    } else {
        console.log("no");
        return false;
    }
}

function nextLetter() {
    //Play sound "small and subtle click to indicate next thing"
    //Highlight next letter
    currentInspecting+=1;
    if(!nextLevelCheck()){
        console.log("Now inspecting letter# "+ (currentInspecting+1) + ", "+ currentLine[currentInspecting]);
        colorCurrent();
    }
    recognition.start();
}

function sameLetter() {
    //Play sound "not recognised, speak again"
}

function generate_image() {
    console.log("About to generate images");
    clearAndReset();
    var numPics = 4;
    if (currentLevel > 160) {
        numPics = 1;
    } else if (currentLevel > 130) {
        numPics = 2;
    } else if (currentLevel > 100) {
        numPics = 3;
    } else if (currentLevel > 70) {
        numPics = 4;
    } else if (currentLevel > 60) {
        numPics = 5;
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

function controllerStart() {
    console.log("initiating");
    generate_image(currentLevel);
    colorCurrent();
}

function isInVocabulary(word1, word2) {

    if (isExpectedWord(word1, word2)) {

        currentLevelSuccess();
        nextLetter();

    } else {
        // console.log(word1 + " and " + word2 + " are not expected words");

        for (var i = 0; i < humanWords.length; i++) {
            // console.log("Entered for loop");
            if ((word1.trim() == humanWords[i]) || (word2.trim() == humanWords[i])) {
                //We look at the next word, because they got it wrong
                nextLetter();
                return true;
            } else {
                sameLetter();
                return false;
            }
        }

    }
}

function isExpectedWord(word1, word2) {
    if ((word1.trim() == currentLine[currentInspecting]) || (word2.trim() == currentLine[currentInspecting])) {
        recognition.cancel();
        recognition.stop();
        letterOver = true;
        return true;
    } else {
        return false;
    }
}

function statusCheck(final, interim) {
    console.log("                 (" + final + "/" + interim + ")");
    if (!finishedEntiretyCheck()) {
        if (isInVocabulary(final, "TODO REMOVE")) {
            if ((final.trim() == currentLine[currentInspecting]) || (interim.trim() == currentLine[currentInspecting])) {
                console.log("statusCheck sending to next letter");
                nextLetter();
            }
            sameLetter()
        }
    } else {
        finishPage();
    }
}

// var recognizing;
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var grammar = '#JSGF V1.0; grammar colors; public  = up | left | right | down;';
var recognition = new SpeechRecognition();
var speechRecognitionList = new webkitSpeechRecognition.SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
// recognition.maxAlternatives = 5;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.onresult = function (event) {
    final = "";
    interim = "";
    for (var i = 0; i < event.results.length; ++i) {
        if (!isLetterOverCheck()) {
            if(event.results[i].isFinal) {
                final = event.results[i][0].transcript;
            } else {
                interim = event.results[i][0].transcript;
            }
        }
    }
    final_span.innerHTML = final;
    interim_span.innerHTML = interim;
    expected_span.innerHeight = currentLine[currentInspecting];
    statusCheck(final, interim);

};
recognition.addEventListener('end', recognition.start);
// recognition.onend = reset;
recognition.start();

controllerStart();

document.onkeydown = checkKey;

function checkKey(e) {
    console.log("key " + e.keycode);
    e = e || window.event;
    if (e.keyCode == '38' || e.keycode == '87') {
        statusCheck("up", "up");
    }
    else if (e.keyCode == '40' || e.keycode == '83') {
        statusCheck("down", "down");
    }
    else if (e.keyCode == '37' || e.keycode == '65') {
        statusCheck("left", "left");
    }
    else if (e.keyCode == '39' || e.keycode == '68') {
        statusCheck("right", "right");
    }
}