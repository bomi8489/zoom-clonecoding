import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

// socket.on 메소드는 첫번째 파라미터에서 이벤트를 기다리고, 두번째 파라미터로 함수를 받는데 이 함수는 이벤트가 발생하면 작동
// on 메소드는 backend에 연결된 client의 정보를 socket으로 제공해준다.
// socket: 연결된 브라우저
wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Connected to Browser ♬");
    socket.on("close", () => console.log("Disconnected from Browser..."));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg);
        switch(message.type) {
            case "new_message":
                sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload.toString('utf8')}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    })
})

server.listen(3000, handleListen);