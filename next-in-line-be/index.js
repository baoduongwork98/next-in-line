const express = require('express');
// const http = require('http'); // <== dùng http để tạo server cho socket
// const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log } = require('console');

const app = express();
const port = 4000;

app.use(cors());
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*', // cho phép tất cả client kết nối (bạn có thể giới hạn theo domain)
//     methods: ['GET', 'POST'],
//   },
// });
app.use(bodyParser.json());
// Socket.IO - lắng nghe kết nối
// io.on('connection', (socket) => {
//   console.log('📡 Client connected:', socket.id);
// });
// Đường dẫn tới file lưu dữ liệu

// API routes
app.post('/create-queue', async (req, res) => {
  try {
    const { queue, table, time, info } = req.body;

    const newQueueEntry = {
      queue,
      table,
      time,
      info,
      scannedAt: new Date().toISOString(),
    };

    const dataFilePath = path.join(
      __dirname,
      `queue-table-${newQueueEntry.table}.json`
    );
    // Đảm bảo file tồn tại
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, '[]'); // tạo file rỗng dạng mảng JSON
    }
    // Đọc dữ liệu cũ
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Lỗi đọc file' });

      let records = [];
      try {
        records = JSON.parse(data);
      } catch (parseErr) {
        return res.status(500).json({ error: 'Lỗi định dạng JSON trong file' });
      }

      records.push(newQueueEntry);

      // Ghi lại dữ liệu mới vào file
      fs.writeFile(
        dataFilePath,
        JSON.stringify(records, null, 2),
        (writeErr) => {
          if (writeErr) return res.status(500).json({ error: 'Lỗi ghi file' });
          // 👉 Phát sự kiện socket tới tất cả client
          // io.emit('queue-updated', newQueueEntry);
          res
            .status(201)
            .json({ message: 'Đã lưu thành công', data: newQueueEntry });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'Error creating queue entry' });
  }
});

app.get('/queue/:id', (req, res) => {
  const id = req.params.id;
  const dataFilePath = path.join(__dirname, `queue-table-${id}.json`);
  console.log(dataFilePath);
  // Đảm bảo file tồn tại
  if (!fs.existsSync(dataFilePath)) {
    return res.status(404).json({ error: 'File không tồn tại' });
  }
  // Đọc dữ liệu cũ
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Lỗi đọc file' });

    let records = [];
    try {
      records = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Lỗi định dạng JSON trong file' });
    }

    console.log(records);

    if (!records) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
    }

    res.status(200).json({ data: records });
  });
});

app.delete('/queue/:id/:queue', (req, res) => {
  const id = req.params.id;
  const queue = req.params.queue;
  const dataFilePath = path.join(__dirname, `queue-table-${id}.json`);

  // Đảm bảo file tồn tại
  if (!fs.existsSync(dataFilePath)) {
    return res.status(404).json({ error: 'File không tồn tại' });
  }

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Lỗi đọc file' });

    let records = [];
    try {
      records = JSON.parse(data);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Lỗi định dạng JSON trong file' });
    }

    console.log(queue);
    // Tìm và xóa bản ghi
    const index = records.findIndex((record) => record.queue === Number(queue));
    console.log(records);
    if (index === -1) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
    }

    records.splice(index, 1);

    // Ghi lại dữ liệu mới vào file
    fs.writeFile(dataFilePath, JSON.stringify(records, null, 2), (writeErr) => {
      if (writeErr) return res.status(500).json({ error: 'Lỗi ghi file' });
      // 👉 Phát sự kiện socket tới tất cả client
      // io.emit('queue-updated', { queue, action: 'deleted' });
      res.status(200).json({ message: 'Đã xóa thành công', data: records });
    });
  });
});

app.get('/', (req, res) => {
  res.send('Next in Line API is running!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
