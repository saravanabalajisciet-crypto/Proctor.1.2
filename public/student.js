navigator.mediaDevices.getUserMedia({video:true})
.then(stream => video.srcObject = stream);

function start() {
  localStorage.setItem("student", name.value);
  localStorage.setItem("roll", roll.value);
  window.location.href = "exam.html" + window.location.search;
}
