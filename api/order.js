export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const {
      name = "",
      phone = "",
      "bot-field": botField = "",
    } = req.body ?? {};

    // Honeypot
    if (botField) {
      return res.status(200).json({ success: true });
    }

    const cleanName = String(name).trim();
    const cleanPhone = String(phone).trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Перевірте ім’я.",
      });
    }

    if (cleanPhone.length < 10 || cleanPhone.length > 19) {
      return res.status(400).json({
        success: false,
        message: "Перевірте номер телефону.",
      });
    }

    if (!/^[+\d\s()-]+$/.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Некоректний формат номера телефону.",
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram environment variables are not configured.");

      return res.status(500).json({
        success: false,
        message: "Сервіс замовлення тимчасово недоступний.",
      });
    }

    const message = [
      "🖨 НОВЕ ЗАМОВЛЕННЯ — MINI PRINTER",
      "",
      `👤 Ім’я: ${cleanName}`,
      `📞 Телефон: ${cleanPhone}`,
      "",
      "📦 Mini Printer",
      "💰 Ціна: 800 грн",
      "",
      `🕒 ${new Date().toLocaleString("uk-UA", {
        timeZone: "Europe/Kyiv",
      })}`,
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    if (!telegramResponse.ok) {
      const telegramError = await telegramResponse.text();
      console.error("Telegram error:", telegramError);

      return res.status(502).json({
        success: false,
        message: "Не вдалося передати замовлення.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Замовлення прийнято.",
    });
  } catch (error) {
    console.error("Order API error:", error);

    return res.status(500).json({
      success: false,
      message: "Сталася помилка. Спробуйте ще раз.",
    });
  }
}