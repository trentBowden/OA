//Media Variables
var srces = ["images/up.png", "images/down.png", "images/left.png", "images/rightNew.png"];
var audio = new Audio('sounds/success.wav');
var click = new Audio('sounds/click.mp3');
//Vocabulary variables
var humanWords = ["up", "down", "left", "right"];
//Score
var totalScore = 0;
//Current elements
var currentLine = [];
var currentHumanWord;
var currentRand;
var currentInspecting = 0;
//Size
var startingSize = 300;
var currentSize = startingSize;
var sizeDifference = 30; // Size diff between levels, in nextLevelCheck()

//Measurements in metres
var distanceFromChart = 6;
var measurementList = [61,30.5,21.3,15.2,12.2,9.14, 7.62, 6.10];
var sizeForLevels = [];
var currentLevel = 0;
var rightThisLevel = 0;
var currentLetterSize = 36;
var currentSliderWidth = 36;
var eyeToCover = "left";
var moreThanHalfOfLeft = 0;
var moreThanHalfOfRight = 0;
//Functions

$("#select_dialect").hide();

var slider = document.getElementById("myRange");
// var output = document.getElementById("demo");
// output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    // output.innerHTML = this.value;
    // console.log(this.value);
    currentSliderWidth = (($( "#rulerContainer" ).width()/100) * this.value)/5;
    // console.log("5cm is equal to: " + currentWidth + " pixels");
    $("#cmEqTo").text("1cm on your screen is equivalent to: "+ currentSliderWidth + " pixels");
    $( "#ruler" ).animate({
        width: [currentSliderWidth*5]
    }, 0, function() {
        generate_image();
    });
};

function updateLetterSizing(){
    var dist = measurementList[currentLevel];
    var degrees = tanDegrees(5/60);
    var sizeM = degrees * dist;
    var sizeCM = sizeM * 100;
    var sizePixels = sizeCM * currentSliderWidth;

    console.log(currentSliderWidth + " pixels to 1 cm");
    console.log("Current distance is 20/"+dist);
    console.log("To subtend an angle of 5 minutes, at length " + dist);
    console.log("tan(5/60) in degrees = " + degrees);
    console.log(degrees + " = x/" +dist);
    console.log("x = "+ sizeM + " meters");
    console.log("= " + sizePixels + " pixels tall");

    $("#explanationHeight").text("tan(5/"+dist+") deg * " + dist + " = " + sizeM + "m");
    $("#heightReading").text("At "+currentSliderWidth+" pixels/1cm, 20/"+dist+" = "+ sizePixels + " pixels");

    currentLetterSize = sizePixels;
}

function letterSize(dist) {
    var letterSizeMeters = (tanDegrees(5/60))*dist;
    var letterSizeCM = letterSizeMeters * 100;
    return letterSizeCM;
}

function tanDegrees(angle) {
    return Math.tan(angle/180*Math.PI);
}

for(var i = 0; i<measurementList.length; i++) {
    sizeForLevels.push(letterSize(measurementList[i]));
    console.log(sizeForLevels[i]);
}


function partOfVocabulary(input) {

    var english = ["left", "right", "up", "down"];
    var japanese = ["右","左","上","下"];
    for (var i = 0; i<english.length; i++) {
        var regX = new RegExp(english[i].toUpperCase());
        if (regX.test(input.trim().toUpperCase())) {
            console.log("This word is " + english[i]);
            return english[i];
        }
    }
    for (var i = 0; i<japanese.length; i++) {
        var regX = new RegExp(japanese[i].toUpperCase());
        if (regX.test(input.trim().toUpperCase())) {
            console.log("This word is " + japanese[i]);
            return english[i];
        }
    }
    //add any other for loops for other languages
    return false;
}

function displayToUser(input) {
    console.log("Found it! you said "+ input );
    // latestAnswer.innerHTML = input;
}
function correctLetterCheck(input){
    var currentLevelPoints = 500-currentSize;
    if (input == currentLine[currentInspecting]) {
        totalScore+=currentLevelPoints;
        // score.innerHTML=currentLevelPoints;
        // latestAnswer.style.borderBottom = "thick solid green";
    } else {
        // latestAnswer.style.borderBottom = "thick solid red";
    }
}
function generate_image() {

    if (currentLevel < 6) {
        $("#instructionsEyeCover").text("Cover " + eyeToCover + " eye");
    } else if ((eyeToCover == "left") && (currentLevel == 6)) {
        eyeToCover = "right";
        currentLevel = 0;
        $("#instructionsEyeCover").text("Cover " + eyeToCover + " eye");
    } else if ((eyeToCover == "right") && (currentLevel == 6)) {
        alert("LEFT EYE: 6/"+measurementList[moreThanHalfOfLeft] + "\n" +
        "RIGHT EYE: 6/"+measurementList[moreThanHalfOfRight]+ ". \n" +
            "Thank you for completing the test!");
    }

    console.log("About to generate images");
    clearAndReset();
    updateLetterSizing();
    var numPics = currentLevel+1;


    for (var i = 0; i < numPics; i++) {
        currentRand = Math.floor(Math.random() * 3);
        currentHumanWord = humanWords[currentRand];
        currentLine.push(currentHumanWord);
        //Transform: rotate(180deg)
        show_image(srces[currentRand], currentLetterSize, currentLetterSize, "image", i);
    }
    colorCurrent();
}
document.onkeydown = checkKey;
function checkKey(e) {
    // console.log("key " + e.keycode);
    e = e || window.event;
    if (e.keyCode == '38' || e.keycode == '87') {
        click.play();
        e.preventDefault();
        letterCalled("up");
    }
    else if (e.keyCode == '40' || e.keycode == '83') {
        click.play();
        e.preventDefault();
        letterCalled("down");
    }
    else if (e.keyCode == '37' || e.keycode == '65') {
        click.play();
        e.preventDefault();
        letterCalled("left");
    }
    else if (e.keyCode == '39' || e.keycode == '68') {
        click.play();
        e.preventDefault();
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
    // tumblingE.syle.padding-right = "40 px";
    // tumblingE.padding = 0  0 0;

    // This next line will just add it to the <body> tag
    var theDiv = document.getElementById("pictureArea");

    theDiv.appendChild(tumblingE);
    document.getElementById(id).style.padding = "0px "+(currentLetterSize/10)+ "px 0px "+ (currentLetterSize/10) +"px";
    audio.play();
}
function colorCurrent() {
    console.log("Coloring in the current one");
    for (var i = 0; i<currentLine.length; i++) {
        if (i == currentInspecting) {
            document.getElementById(i).style.borderBottom = "thick solid mistyrose";
            // lookingFor.innerHTML = currentLine[currentInspecting];
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
    if (currentSize <= 0) {
        finishPage();
        return true;
    } else {
        return false
    }
}
function nextLevelCheck() {
    if (currentInspecting+1 >= currentLine.length) {
        //Let me know about if they've done half
        if (rightThisLevel >= ((currentLevel+1)/2)){
            if (eyeToCover == "left") {
                moreThanHalfOfLeft = currentLevel;
            } else {
                moreThanHalfOfRight = currentLevel;
            }

        }
        rightThisLevel = 0;
        currentSize = currentSize - sizeDifference;
        generate_image(currentSize);
        currentLevel++;
        return true;
    } else {
        return false;
    }
}
function nextLetter() {
    //Play sound "small and subtle click to indicate next thing"
    // if(!finishedEntiretyCheck()){
        if (!nextLevelCheck()) {
            click.play();
            currentInspecting += 1;
            console.log("Now inspecting letter# " + (currentInspecting + 1) + ", " + currentLine[currentInspecting]);
            colorCurrent();
        }
    // }
}
function letterCalled(input){
    console.log("user has said: " + input);
    var englishWord;
    if (englishWord = partOfVocabulary(input)) {
        rightThisLevel++;
        displayToUser(englishWord);
        correctLetterCheck(englishWord);
        nextLetter();
        return true;
    } return false;
}

function checkWordIsCorrect() {
    console.log("It's talking");
}

function moreThanHalf() {

}
function passedThisLevel() {

}


//Start it all off
function controllerStart() {
    console.log("initiating, setting level to 0");
    currentLevel = 0;
    // if (annyang) {
    //     var commands = {
    //         'left': function() {letterCalled("left");},
    //         'right': function() {letterCalled("right");},
    //         'up': function() {letterCalled("up");},
    //         'down': function() {letterCalled("down");},
    //         'it is facing left': function() {letterCalled("left");},
    //         'it is facing right': function() {letterCalled("right");},
    //         'it is facing up': function() {letterCalled("up");},
    //         'it is facing down': function() {letterCalled("down");}
    //     };
    //     annyang.addCommands(commands);
    //     annyang.start({ autoRestart: true, continuous: true });

        generate_image(currentSize);
        colorCurrent();
    // } else {
    //     console.log("Problem loading Aanyang!");
    // }
}
controllerStart();
