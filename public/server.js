const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(bodyParser.json()); 

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'dino'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL 연결 오류: ', err);
  } else {
    console.log('MySQL에 연결되었습니다.');
  }
});

app.post('/update-counter', (req, res) => {
  const { counterValue } = req.body;

  console.log('Received request with counterValue:', counterValue);

  connection.query('INSERT INTO counters (id) VALUES (?)', [counterValue], (err) => {
    if (err) {
      console.error('카운터 값 삽입 오류: ', err);
      res.json({ success: false });
    } else {
      console.log('카운터 값이 MySQL에 삽입되었습니다.');
      res.json({ success: true });
    }
  });
});

app.get('/get-max-id', (req, res) => {
    // 최대 값 조회 쿼리
    connection.query('SELECT MAX(id) AS maxId FROM counters', (err, results) => {
      if (err) {
        console.error('최대 값 조회 오류: ', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } else {
        // 최대 값 전송
        const maxId = results[0].maxId;
        console.log('최대 값:', maxId);
        res.json({ success: true, maxId });
      }
    });
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
