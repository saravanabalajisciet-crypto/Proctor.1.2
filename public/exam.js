const socket = io();
const examId = new URLSearchParams(window.location.search).get("exam");

const overlay = document.getElementById("overlay");
const form = document.getElementById("formFrame");
const timerEl = document.getElementById("timer");

let examState = "ACTIVE"; // ACTIVE, PAUSED_BY_VIOLATION, TERMINATED
let violations = 0;
let time = 600; // example: 10 minutes
let interval;

// Load form immediately
form.style.display = "block";
overlay.style.display = "none";
form.src = prompt("Paste Google Form Link");
startTimer();

// Timer
function startTimer(){
  interval = setInterval(()=>{
    timerEl.innerText = "Time Left: "+time--+" sec";
    if(time<=0) finishExam();
  },1000);
}

// Tab switch detection
document.addEventListener("visibilitychange", ()=>{
  if(document.hidden && examState==="ACTIVE"){
    violations++;
    if(violations===1){ alert("⚠️ Warning: Tab switch not allowed"); return; }

    // Second violation → pause exam
    examState="PAUSED_BY_VIOLATION";
    clearInterval(interval);
    form.style.display="none";
    overlay.style.display="flex";

    socket.emit("violation",{examId, student:localStorage.getItem("student"), roll:localStorage.getItem("roll")});
  }
});

// Resume from teacher approval
socket.on("resume-exam", id=>{
  if(id===examId){
    examState="ACTIVE";
    overlay.style.display="none";
    form.style.display="block";
    startTimer();
  }
});

// Terminate exam
socket.on("terminate-exam", id=>{
  if(id===examId){
    examState="TERMINATED";
    document.body.innerHTML="<h1>❌ Exam Terminated</h1>";
  }
});

// Finish exam
function finishExam(){
  socket.emit("finish-exam", examId);
}
