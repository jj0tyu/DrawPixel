const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const canvasState = {}; // ピクセルごとの色を保存するオブジェクト（例: {'x_y': '#FF5733'})

app.use(express.static('public'));

io.on('connection', (socket) => {
    // 新しいユーザーに現在のキャンバスの状態を送信
    socket.emit('canvasState', canvasState);

    // ピクセル更新を受信
    socket.on('drawPixel', (data) => {
        const { x, y, color } = data;
        const pixelKey = `${x}_${y}`;
        canvasState[pixelKey] = color;

        // 更新されたピクセルを全ユーザーにブロードキャスト
        io.emit('updatePixel', data);
    });
});

server.listen(3000, () => {
    console.log('サーバーがポート3000で起動しています');
});
