const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.static("public"));

let exams = {};
let resumeRequests = [];

app.post("/create-exam", (req, res) => {
  const { title, duration, formLink } = req.body;
  const examId = Date.now().toString();
  exams[examId] = { title, duration, formLink };
  res.json({ examId });
});

app.get("/resume-requests", (req, res) => {
  res.json(resumeRequests);
});

io.on("connection", socket => {

  socket.on("violation", data => {
    resumeRequests.push(data);
    io.emit("pause-exam", data.examId);
  });

  socket.on("approve-resume", examId => {
    resumeRequests = resumeRequests.filter(r => r.examId !== examId);
    io.emit("resume-exam", examId);
  });

  socket.on("terminate-exam", examId => {
    io.emit("terminate-exam", examId);
  });

  socket.on("finish-exam", examId => {
    io.emit("terminate-exam", examId);
  });

});

server.listen(3000, () => console.log("Server running at http://localhost:3000"));
