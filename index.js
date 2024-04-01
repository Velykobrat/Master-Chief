const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// Налаштування парсера для даних POST-запиту
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Маршрут для обробки POST-запиту від форми замовлення
app.post('/submit-order', async (req, res) => {
    try {
        // Отримання даних з форми
        const { name, phone } = req.body;

        // Налаштування транспортера для відправки пошти
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'master.chief.shop@gmail.com', // Ваша електронна адреса Gmail
                pass: 'GHlk46(*&mn76' // Ваш пароль від Gmail
            }
        });

        // Налаштування відправлення електронної пошти
        const mailOptions = {
            from: 'your-email@gmail.com', // Ваша електронна адреса
            to: 'master.chief.shop@gmail.com', // Електронна адреса отримувача
            subject: 'Нове замовлення',
            text: `Ім'я: ${name}\nТелефон: ${phone}`
        };

        // Відправлення електронної пошти
        await transporter.sendMail(mailOptions);

        // Відправлено успішно
        res.status(200).send('Замовлення успішно відправлено!');
    } catch (error) {
        // Виникла помилка під час відправлення
        console.error(error);
        res.status(500).send('Помилка під час відправлення замовлення.');
    }
});

// Прослуховування порту
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порті ${PORT}`);
});
