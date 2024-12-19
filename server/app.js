const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const vm = require("node:vm");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};



const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
};


function runInDocker(language, filePath) {
    return new Promise((resolve, reject) => {
        const containerName = `sandbox-${Date.now()}`;

        const commands = {
            javascript: `
                docker run --rm \
                --name ${containerName} \
                -v ${filePath}:/app/usercode.js \
                sandbox-node node /app/usercode.js
            `,
            python: `
                docker run --rm \
                --name ${containerName} \
                -v ${filePath}:/app/usercode.py \
                python:3.9 python /app/usercode.py
            `,
            cpp: `
                docker run --rm \
                --name ${containerName} \
                -v ${filePath}:/app/usercode.cpp \
                gcc:latest sh -c "g++ /app/usercode.cpp -o /app/a.out && ./app/a.out"
            `,
            c: `
                docker run --rm \
                --name ${containerName} \
                -v ${filePath}:/app/usercode.c \
                gcc:latest sh -c "gcc /app/usercode.c -o /app/a.out && ./app/a.out"
            `,
            java: `
                docker run --rm \
                --name ${containerName} \
                -v ${filePath}:/app/UserCode.java \
                openjdk:latest sh -c "javac /app/UserCode.java && java -cp /app UserCode"
            `,
        };

        const command = commands[language];

        if (!command) {
            reject(new Error(`Unsupported language: ${language}`));
            return;
        }

        exec(command, (error, stdout, stderr) => {
            if (error || stderr) {
                reject(new Error(stderr || error.message));
            } else {
                resolve(stdout.trim());
            }
        });
    });
}


io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);


    socket.on("join", ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit("joined", {
                clients,
                username,
                socketId: socket.id,
            });
        });

        console.log(`${username} joined room: ${roomId}`);
    });


    socket.on("code-change", ({ roomId, code }) => {
        socket.in(roomId).emit("code-change", { code });
    });


    socket.on("sync-code", ({ socketId, code }) => {
        io.to(socketId).emit("code-change", { code });
    });
    socket.on("language-change", ({ roomId, language }) => {
        socket.in(roomId).emit("language-change", { language });
    });
    
    socket.on("compile", async ({ roomId, code, language }) => {
        const tempDir = path.join(__dirname, "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    

        const extensions = { javascript: "js", python: "py", cpp: "cpp", c: "c", java: "java" };
        const fileExtension = extensions[language];
        if (!fileExtension) {
            io.to(roomId).emit("compile-result", {
                success: false,
                result: `Unsupported language: ${language}`,
            });
            return;
        }
    
        const tempFilePath = path.join(tempDir, `temp-${socket.id}.${fileExtension}`);
    
        try {

            fs.writeFileSync(tempFilePath, code);
    
            const output = await runInDocker(language, tempFilePath);
            io.to(roomId).emit("compile-result", {
                success: true,
                result: output,
            });
        } catch (error) {
            io.to(roomId).emit("compile-result", {
                success: false,
                result: `Error: ${error.message}`,
            });
        } finally {

            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        }
    });


    socket.on("disconnecting", () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit("disconnected", {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
        console.log(`Disconnected: ${socket.id}`);
    });
});


const PORT = process.env.PORT || 5174;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
