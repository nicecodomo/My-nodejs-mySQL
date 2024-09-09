const express = require('express');
const path = require('path');
const myRoutes = require('./routes/myRoutes'); // นำเข้า routes
const bodyParser = require('body-parser');

const app = express();
const PORT = 8000;

app.use(express.json()); // เพิ่มบรรทัดนี้
app.use(bodyParser.urlencoded({ extended: true }));

// ตั้งค่า EJS เป็น view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(myRoutes);

// ตั้งค่าโฟลเดอร์ public เพื่อให้ใช้ไฟล์ static
app.use(express.static(path.join(__dirname, 'public')));

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

