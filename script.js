// ---------- Load the XML file ----------
var xmlData = null;

var request = new XMLHttpRequest();
request.open("GET", "data.xml", true);
request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
        xmlData = request.responseXML;
        showQuiz();
    }
};
request.send();


// ---------- 1. Menu button for mobile ----------
function toggleMenu() {
    var navbar = document.getElementById("navbar");
    if (navbar.className == "") {
        navbar.className = "show";
    } else {
        navbar.className = "";
    }
}
document.getElementById("menuBtn").onclick = toggleMenu;


// ---------- 2. Waste sorter ----------
function checkWaste() {
    var bin = document.getElementById("wasteItem").value;
    var result = document.getElementById("wasteResult");

    if (bin == "") {
        result.innerHTML = "Please select an item first.";
        result.className = "error";
    } else if (bin == "green") {
        result.innerHTML = "Put it in the GREEN bin (wet waste).";
        result.className = "good";
    } else if (bin == "blue") {
        result.innerHTML = "Put it in the BLUE bin (dry / recyclable waste).";
        result.className = "good";
    } else {
        result.innerHTML = "Put it in the RED bin (hazardous waste).";
        result.className = "good";
    }
}
document.getElementById("wasteBtn").onclick = checkWaste;


// ---------- 3. Eco tip generator (tips come from data.xml) ----------
function showTip() {
    var text = document.getElementById("tipText");

    if (xmlData == null) {
        text.innerHTML = "Tips could not be loaded. Run the site on a server (Live Server or Vercel).";
        return;
    }

    var tips = xmlData.getElementsByTagName("tip");
    var number = Math.floor(Math.random() * tips.length);
    text.innerHTML = tips[number].textContent;
}
document.getElementById("tipBtn").onclick = showTip;


// ---------- 4. Carbon footprint calculator ----------
function calculate() {
    var km = Number(document.getElementById("km").value);
    var ac = Number(document.getElementById("ac").value);
    var meat = Number(document.getElementById("meat").value);
    var result = document.getElementById("calcResult");

    if (km < 0 || ac < 0) {
        result.innerHTML = "Please enter positive numbers only.";
        result.className = "error";
    } else {
        var total = Math.round(km * 0.2 + ac * 1.5 + meat);

        if (total < 5) {
            result.innerHTML = "About " + total + " kg CO2 per day. That is low, great job!";
            result.className = "good";
        } else if (total < 12) {
            result.innerHTML = "About " + total + " kg CO2 per day. That is medium. Try to reduce it.";
            result.className = "";
        } else {
            result.innerHTML = "About " + total + " kg CO2 per day. That is high. Try the eco practices above.";
            result.className = "error";
        }
    }
}
document.getElementById("calcBtn").onclick = calculate;


// ---------- 5. Quiz (questions come from data.xml) ----------
function showQuiz() {
    var box = document.getElementById("quizBox");
    var questions = xmlData.getElementsByTagName("question");
    var html = "";

    for (var i = 0; i < questions.length; i++) {
        var text = questions[i].getElementsByTagName("text")[0].textContent;
        var options = questions[i].getElementsByTagName("option");

        html = html + "<div class='question'>";
        html = html + "<p>" + (i + 1) + ". " + text + "</p>";
        html = html + "<select id='q" + i + "'>";
        html = html + "<option value=''>-- choose --</option>";
        for (var j = 0; j < options.length; j++) {
            html = html + "<option value='" + j + "'>" + options[j].textContent + "</option>";
        }
        html = html + "</select></div>";
    }

    box.innerHTML = html;
}

function checkQuiz() {
    var result = document.getElementById("quizResult");

    if (xmlData == null) {
        result.innerHTML = "Quiz could not be loaded. Run the site on a server (Live Server or Vercel).";
        return;
    }

    var questions = xmlData.getElementsByTagName("question");
    var score = 0;

    for (var i = 0; i < questions.length; i++) {
        var correct = questions[i].getElementsByTagName("answer")[0].textContent;
        var chosen = document.getElementById("q" + i).value;
        if (chosen == correct) {
            score = score + 1;
        }
    }

    result.innerHTML = "You scored " + score + " out of " + questions.length;
    if (score == questions.length) {
        result.className = "good";
    } else {
        result.className = "error";
    }
}
document.getElementById("quizBtn").onclick = checkQuiz;


// ---------- 6. Pledge form ----------
function submitPledge() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var promise = document.getElementById("promise").value;
    var msg = document.getElementById("formMsg");

    if (name == "" || email == "" || promise == "") {
        msg.innerHTML = "Please fill all the fields.";
        msg.className = "error";
    } else if (email.indexOf("@") == -1) {
        msg.innerHTML = "Please enter a valid email.";
        msg.className = "error";
    } else {
        msg.innerHTML = "Thank you " + name + "! You promised to: " + promise;
        msg.className = "good";
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("promise").value = "";
    }
}
document.getElementById("pledgeBtn").onclick = submitPledge;
