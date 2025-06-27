import asyncio
from telegram.ext import MessageHandler, filters
import threading
import random
import os
import http.server
import socketserver
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, BotCommand, MenuButtonCommands
from telegram.ext import Application, CommandHandler, ContextTypes, CallbackQueryHandler
import nest_asyncio
# --- Telegram-бот ---
nest_asyncio.apply()

# Команда /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        keyboard = [
            [InlineKeyboardButton("🎮 Играть в TapKraken", url="https://czolowek.github.io/taptaphomak0/")],
            [InlineKeyboardButton("📢 Пригласить друзей", callback_data="invite")],
            [InlineKeyboardButton("📋 Правила игры", callback_data="rules")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        # Пытаемся открыть файл изображения
        try:
            with open("Cover image.png", "rb") as photo:
                await context.bot.send_photo(
                    chat_id=update.effective_chat.id,
                    photo=photo,
                    caption=(
                        "🎉 *Добро пожаловать в TapKraken!* 🐙\n\n"
                        "Готов к настоящему веселью и эпичным кликам? 🚀\n\n"
                        "💰 Сокровища ждут — не заставляй Кракена скучать! 💝🌊\n"
                        "👇 Жми на кнопку ниже и погружайся в игру! 💥\n"
                    ),
                    parse_mode="Markdown",
                    reply_markup=reply_markup
                )
        except FileNotFoundError:
            # Если файл не найден, отправляем только текст
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=(
                    "🎉 *Добро пожаловать в TapKraken!* 🐙\n\n"
                    "Готов к настоящему веселью и эпичным кликам? 🚀\n\n"
                    "💰 Сокровища ждут — не заставляй Кракена скучать! 💝🌊\n"
                    "👇 Жми на кнопку ниже и погружайся в игру! 💥\n"
                ),
                parse_mode="Markdown",
                reply_markup=reply_markup
            )
    except Exception as e:
        print(f"Ошибка в команде /start: {e}")
        # Запасной вариант без медиа
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="🎉 Добро пожаловать в TapKraken! Нажмите на кнопку, чтобы начать игру.",
            reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("Играть", url="https://czolowek.github.io/taptaphomak0/")]])
        )

# Команда /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        help_text = (
            "ℹ️ *Доступные команды TapKraken:*\n\n"
            "🎮 /start - Начать игру и получить ссылку\n"
            "❓ /help - Помощь и поддержка\n"
            "🔗 /invite - Пригласить друзей\n"
            "📋 /rules - Правила игры\n"
            "✍️ /review - Оставить отзыв\n"
            "ℹ️ /info - О проекте\n"
            "🎁 /daily - Ежедневная награда\n"
            "🎁 /gift - Отправить подарок другу\n"
            "⚡ /boost - Получить временный бонус\n\n"
            "📩 *Связаться с нами:*\n"
            "Email: [tapkraken@gmail.com](mailto:tapkraken@gmail.com)\n"
            "WhatsApp: [+48516015761](https://wa.me/+48516015761)\n"
            "Мы всегда рады помочь! 😊"
        )

        keyboard = [
            [InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")],
            [InlineKeyboardButton("📋 Правила", callback_data="rules"), 
             InlineKeyboardButton("✍️ Отзыв", callback_data="review")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=help_text,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка в команде /help: {e}")

# Команда /invite
async def invite(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Получаем имя пользователя
        user = update.effective_user
        username = user.username or user.first_name or "Друг"
        
        # Генерируем QR-код с помощью callback_data
        keyboard = [
            [InlineKeyboardButton("🔗 Отправить приглашение", switch_inline_query="Присоединяйся к TapKraken!")],
            [InlineKeyboardButton("🎮 Играть в TapKraken", url="https://czolowek.github.io/taptaphomak0/")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        # Подготовка сообщения для пересылки
        invite_message = (
            f"🎉 *{username} приглашает тебя в игру TapKraken!* 🐙\n\n"
            f"🔗 Присоединяйся к увлекательной игре - кликай на Кракена и собирай сокровища!\n\n"
            f"💥 Выполняй задания, решай головоломки и побеждай друзей в таблице лидеров!\n\n"
            f"👉 Начни играть прямо сейчас: https://czolowek.github.io/taptaphomak0/"
        )
        
        # Отправляем приглашение с картинкой или без (если не найдена)
        try:
            with open("баннер.webp", "rb") as banner_image:
                await context.bot.send_photo(
                    chat_id=update.effective_chat.id,
                    photo=banner_image,
                    caption=invite_message,
                    parse_mode="Markdown",
                    reply_markup=reply_markup
                )
        except FileNotFoundError:
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=invite_message,
                parse_mode="Markdown",
                reply_markup=reply_markup
            )

    except Exception as e:
        print(f"Ошибка в команде /invite: {e}")
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="Произошла ошибка при создании приглашения. Пожалуйста, попробуйте позже."
        )

# Команда /rules
async def rules(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        rules_text = (
            "📋 *Правила игры TapKraken:*\n\n"
            "👆 *Основной геймплей:*\n"
            "• Нажимай на Кракена для получения монет\n"
            "• Улучшай тапы в магазине для увеличения дохода\n"
            "• Следи за энергией - она восстанавливается со временем\n\n"
            
            "🧩 *Головоломки:*\n"
            "• Собирай цветные блоки для дополнительных наград\n"
            "• Чем сложнее уровень, тем больше награда\n\n"
            
            "👥 *Социальная система:*\n"
            "• Отправляй подарки друзьям\n"
            "• Соревнуйся в таблице лидеров\n"
            "• Приглашай новых игроков\n\n"
            
            "🏆 *Задания:*\n"
            "• Выполняй ежедневные задания для бонусов\n"
            "• Получай награды за достижения\n\n"
            
            "🎮 *Удачной игры!* 🐙"
        )
        
        keyboard = [
            [InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")],
            [InlineKeyboardButton("🔙 Назад", callback_data="start")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=rules_text,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка в команде /rules: {e}")

# Команда /review (для отзывов)
async def review(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        feedback_text = (
            "✍️ *Оставьте свой отзыв о TapKraken!*\n\n"
            "📝 Расскажите, что вам понравилось и что можно улучшить.\n\n"
            "🌟 Ваше мнение очень важно для нас и поможет сделать игру ещё лучше!"
        )
        
        # Эмодзи для рейтинга
        keyboard = [
            [
                InlineKeyboardButton("😍", callback_data="rating_5"),
                InlineKeyboardButton("🙂", callback_data="rating_4"),
                InlineKeyboardButton("😐", callback_data="rating_3"),
                InlineKeyboardButton("😕", callback_data="rating_2"),
                InlineKeyboardButton("😢", callback_data="rating_1")
            ],
            [InlineKeyboardButton("💬 Написать отзыв", callback_data="write_review")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=feedback_text,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка в команде /review: {e}")

# Сбор отзывов
async def collect_feedback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        feedback_message = update.message.text
        username = update.effective_user.username or update.effective_user.first_name

        # Сохраняем отзыв в файл
        try:
            with open("otzivi.txt", "a", encoding="utf-8") as file:
                file.write(f"Отзыв от {username}: {feedback_message}\n")
        except Exception as file_error:
            print(f"Ошибка при записи отзыва в файл: {file_error}")

        # Кнопка "Играть"
        keyboard = [[InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")]]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text="💬 *Спасибо за ваш отзыв!*\n\nМы обязательно учтём ваше мнение при улучшении игры! 🎮✨",
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка при сборе отзыва: {e}")

# Команда /info
async def info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        info_text = (
            "ℹ️ *О проекте TapKraken:*\n\n"
            "🎮 TapKraken - это увлекательная кликер-игра в стиле Hamster Combat с уникальным дизайном в сине-красно-белой гамме.\n\n"
            "🐙 Главный герой - красный Кракен, который приносит вам очки за каждый тап!\n\n"
            "✨ *Особенности:*\n"
            "• Улучшенная система головоломок с цветными блоками\n"
            "• Стильный магазин с полезными предметами\n"
            "• Социальные функции для игры с друзьями\n"
            "• Регулярные обновления и новый контент\n\n"
            "👨‍💻 Разработано с любовью командой энтузиастов в 2025 году\n\n"
            "🌐 Версия: 2.0"
        )
        
        keyboard = [
            [InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")],
            [InlineKeyboardButton("📢 Пригласить друзей", callback_data="invite")],
            [InlineKeyboardButton("✍️ Оставить отзыв", callback_data="review")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=info_text,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка в команде /info: {e}")

# Команда /daily - Ежедневная награда
async def daily_reward(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        # Эмулируем получение награды
        reward_amount = random.randint(50, 200)
        
        reward_text = (
            f"🎁 *Ежедневная награда!*\n\n"
            f"Поздравляем! Вы получили *{reward_amount} Kraken Coins* 🪙\n\n"
            f"⏰ Приходите завтра за новой наградой!"
        )
        
        keyboard = [[InlineKeyboardButton("🎮 Играть сейчас", url="https://czolowek.github.io/taptaphomak0/")]]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=reward_text,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка в команде /daily: {e}")

# Команда /gift - Отправка подарка другу
async def gift(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        gift_text = (
            "🎁 *Отправить подарок другу*\n\n"
            "Выберите тип подарка, который хотите отправить:"
        )
        
        keyboard = [
            [InlineKeyboardButton("🪙 50 монет", callback_data="gift_coins_50")],
            [InlineKeyboardButton("⚡ Энергия", callback_data="gift_energy")],
            [InlineKeyboardButton("🚀 Бустер", callback_data="gift_booster")],
            [InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=gift_text,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка в команде /gift: {e}")

# Команда /boost - Временные бустеры
async def boost(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        boost_text = (
            "⚡ *Активировать бустер*\n\n"
            "Выберите тип бустера, который хотите активировать:"
        )
        
        keyboard = [
            [InlineKeyboardButton("🚀 2× множитель (30 мин)", callback_data="boost_double")],
            [InlineKeyboardButton("⚡ Бесконечная энергия (15 мин)", callback_data="boost_energy")],
            [InlineKeyboardButton("💰 +50% монет (1 час)", callback_data="boost_coins")],
            [InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await context.bot.send_message(
            chat_id=update.effective_chat.id,
            text=boost_text,
            parse_mode="Markdown",
            reply_markup=reply_markup
        )
    except Exception as e:
        print(f"Ошибка в команде /boost: {e}")

# Обработчик callback-запросов
async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        query = update.callback_query
        await query.answer()  # Отвечаем на запрос, чтобы убрать "часики" на кнопке
        
        callback_data = query.data
        
        if callback_data == "start":
            return await start(update, context)
        elif callback_data == "rules":
            return await rules(update, context)
        elif callback_data == "invite":
            return await invite(update, context)
        elif callback_data == "review":
            return await review(update, context)
        elif callback_data == "write_review":
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text="📝 Пожалуйста, напишите ваш отзыв в следующем сообщении:"
            )
        elif callback_data.startswith("rating_"):
            rating = callback_data.split("_")[1]
            username = update.effective_user.username or update.effective_user.first_name
            
            # Сохраняем рейтинг
            try:
                with open("otzivi.txt", "a", encoding="utf-8") as file:
                    file.write(f"Рейтинг от {username}: {rating} звезд\n")
            except Exception as file_error:
                print(f"Ошибка при записи рейтинга в файл: {file_error}")
            
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=f"⭐ Спасибо за вашу оценку! Вы поставили игре {rating} из 5 звезд.",
                reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")]])
            )
        elif callback_data.startswith("gift_") or callback_data.startswith("boost_"):
            # Обработка подарков и бустеров (эмуляция)
            message = "🎉 Функция успешно активирована! Проверьте изменения в игре."
            
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=message,
                reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("🎮 Играть", url="https://czolowek.github.io/taptaphomak0/")]])
            )
            
    except Exception as e:
        print(f"Ошибка при обработке callback: {e}")

# Локальный сервер
def run_server():
    try:
        os.chdir("docs")  # Переходим в папку docs, где находится сайт
        PORT = 5000
        Handler = http.server.SimpleHTTPRequestHandler
        
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"Сервер запущен на http://127.0.0.1:{PORT}")
            httpd.serve_forever()
    except OSError as e:
        print(f"Ошибка при запуске сервера: {e}")
    except Exception as e:
        print(f"Неожиданная ошибка при запуске сервера: {e}")

# Основная функция для запуска бота
async def main():
    try:
        # Запуск локального сервера в отдельном потоке
        server_thread = threading.Thread(target=run_server)
        server_thread.daemon = True
        server_thread.start()

        application = Application.builder().token("8160638043:AAGVn4wvRKKamkSPrfoxWDv19LTp3mSFFU8").build()

        # Обработчики команд
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(CommandHandler("invite", invite))
        application.add_handler(CommandHandler("rules", rules))
        application.add_handler(CommandHandler("review", review))
        application.add_handler(CommandHandler("info", info))
        application.add_handler(CommandHandler("daily", daily_reward))
        application.add_handler(CommandHandler("gift", gift))
        application.add_handler(CommandHandler("boost", boost))

        # Обработчик callback-запросов
        application.add_handler(CallbackQueryHandler(handle_callback))
        
        # Обработчик сообщений (для отзывов)
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, collect_feedback))

        # Кнопки меню
        commands = [
            BotCommand("start", "Начать игру"),
            BotCommand("help", "Справка и контакты"),
            BotCommand("invite", "Пригласить друзей"),
            BotCommand("rules", "Правила игры"),
            BotCommand("review", "Оставить отзыв"),
            BotCommand("info", "О проекте"),
            BotCommand("daily", "Ежедневная награда"),
            BotCommand("gift", "Отправить подарок"),
            BotCommand("boost", "Активировать бустер")
        ]
        await application.bot.set_my_commands(commands)

        # Настроим кнопки меню
        await application.bot.set_chat_menu_button(menu_button=MenuButtonCommands())
        print("Кнопка Menu установлена ✅")

        # Запуск бота
        print("Telegram-бот TapKraken запущен. Ожидание команд...")
        await application.run_polling()

    except Exception as e:
        print(f"Ошибка при запуске бота: {e}")

# Запуск
if __name__ == "__main__":
    asyncio.run(main())  # Работает благодаря nest_asyncio