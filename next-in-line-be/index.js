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
app.use(bodyParser.json());

// API routes
app.post('/create-queue', (req, res) => {
  const { branch, info, service } = req.body;

  const newQueueEntry = {
    branch,
    info,
    service,
    scannedAt: new Date().toISOString(),
    table: Math.floor(Math.random() * 4) + 1, // Random table number 1-4
  };

  const dataFilePath = path.join(
    __dirname,
    `table-${newQueueEntry.table}-${newQueueEntry.branch}.json`
  );

  try {
    // Ensure the file exists, create it if not
    if (!fs.existsSync(dataFilePath)) {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
    }

    // Read and parse existing data
    const records = JSON.parse(fs.readFileSync(dataFilePath, 'utf8') || '[]');

    // Assign a new queue number
    newQueueEntry.queue = records.length
      ? Math.max(...records.map((record) => record.queue)) + 1
      : 1;

    // Add the new entry and write back to the file
    records.push(newQueueEntry);
    fs.writeFileSync(dataFilePath, JSON.stringify(records, null, 2));

    res.status(201).json({
      message: 'Bốc số thứ tự thành công',
      data: newQueueEntry,
    });
  } catch (error) {
    console.error('Error creating queue:', error);
    res.status(500).json({ error: 'Bốc số thứ tự lỗi' });
  }
});

app.get('/queue/:table/:branch', (req, res) => {
  const { table, branch } = req.params;
  const dataFilePath = path.join(__dirname, `table-${table}-${branch}.json`);

  if (!fs.existsSync(dataFilePath)) {
    return res.status(404).json({ error: 'File không tồn tại' });
  }

  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const records = JSON.parse(data);

    if (!records || records.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
    }

    res.status(200).json({ data: records });
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    res.status(500).json({ error: 'Lỗi xử lý dữ liệu' });
  }
});

app.delete('/queue/:table/:branch/:queue', (req, res) => {
  const { table, branch, queue } = req.params;
  const dataFilePath = path.join(__dirname, `table-${table}-${branch}.json`);

  if (!fs.existsSync(dataFilePath)) {
    return res.status(404).json({ error: 'File không tồn tại' });
  }

  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    const records = JSON.parse(data);

    const index = records.findIndex((record) => record.queue === Number(queue));
    if (index === -1) {
      return res.status(404).json({ error: 'Không tìm thấy bản ghi' });
    }

    records.splice(index, 1);
    fs.writeFileSync(dataFilePath, JSON.stringify(records, null, 2));

    res.status(200).json({ message: 'Đã xóa thành công', data: records });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Lỗi xử lý dữ liệu' });
  }
});

app.get('/', (req, res) => {
  res.send('Next in Line API is running!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
