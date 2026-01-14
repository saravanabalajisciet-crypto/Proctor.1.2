const socket = io();

function createExam() {
  fetch("/create-exam", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({title:title.value, duration:duration.value, formLink:formLink.value})
  })
  .then(res=>res.json())
  .then(data=>{ link.innerHTML = `Student Link: <b>http://localhost:3000/student.html?exam=${data.examId}</b>`; });
}

// Fetch resume requests every 2 sec
setInterval(()=>{
  fetch("/resume-requests")
  .then(res=>res.json())
  .then(data=>{
    requests.innerHTML="";
    data.forEach(r=>{
      requests.innerHTML+=`<p>${r.student} (${r.roll}) <button onclick="approve('${r.examId}')">Approve</button> <button onclick="terminate('${r.examId}')">Reject</button></p>`;
    });
  });
},2000);

function approve(id){ socket.emit("approve-resume", id); }
function terminate(id){ socket.emit("terminate-exam", id); }
