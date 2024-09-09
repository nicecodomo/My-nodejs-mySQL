const express = require('express');
const router = express.Router();
const { initMySQL } = require('../db'); // นำเข้าฟังก์ชันการเชื่อมต่อฐานข้อมูล


// กำหนดเส้นทางหน้าแรก ดึงข้อมูลจากฐานข้อมูล
// router.get('/', async (req, res) => {
//     try {
//         const conn = await initMySQL();
//         const [results] = await conn.query('SELECT * FROM users')
//         res.render('index', { users: results });
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//     }
// });

router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    try {
        const conn = await initMySQL();

        // Query สำหรับค้นหาและแบ่งหน้า
        const [users] = await conn.execute(`
            SELECT * FROM users 
            WHERE firstname LIKE ? OR lastname LIKE ? OR age LIKE ? OR gender LIKE ? 
            OR interests LIKE ? OR description LIKE ?
            LIMIT ? OFFSET ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, limit, offset]
        );

        // Query เพื่อคำนวณจำนวนทั้งหมด
        const [[{ count }]] = await conn.execute(`
            SELECT COUNT(*) AS count FROM users 
            WHERE firstname LIKE ? OR lastname LIKE ? OR age LIKE ? OR gender LIKE ? 
            OR interests LIKE ? OR description LIKE ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
        );


        res.render('index', {
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            search
        });
    } catch (error) {
        console.log('error', error);
        res.status(500).send('Server Error');
    }
});

// กำหนดเส้นทางสำหรับหน้า /edit.ejs
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id

    try {
        const conn = await initMySQL();
        const [results] = await conn.query('SELECT * FROM users WHERE id = ?', id)
        res.render('edit', { user: results[0] });
        // res.json(results[0])
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
});

// กำหนดเส้นทางสำหรับหน้า /insert.ejs
router.get('/insert_user', (req, res) => {
    res.render('insert')
})

// กำหนดเส้นทางสำหรับการบันทึก
router.post('/insert', async (req, res) => {
    let user = req.body

    try {
        // console.log('Received user data:', user);

        const conn = await initMySQL();
        await conn.query('INSERT INTO users SET ?', user)
        res.redirect('/');

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ error: error.message })
    }
})

// กำหนดเส้นทางสำหรับการแก้ไข
router.post('/update/:id', async (req, res) => {
    let id = req.params.id
    let updateUser = req.body

    try {
        const conn = await initMySQL();
        await conn.query(
            'UPDATE users SET ? WHERE id = ?',
            [updateUser, id]
        )
        // console.log('results', results)
        res.redirect('/');

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ error: error.message })
    }
})

// กำหนดเส้นทางสำหรับการลบ
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id

    try {
        const conn = await initMySQL();
        await conn.query('DELETE FROM users WHERE id = ?', id)
        res.redirect('/')

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ error: error.message })
    }
})

module.exports = router