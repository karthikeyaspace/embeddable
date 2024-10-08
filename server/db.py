import os
import psycopg2.pool
import logging
from dotenv import load_dotenv
from utils.models import CreateUser, CreateChatbot, ChatMessage
import uuid

load_dotenv()

DBNAME = os.getenv("DBNAME")
DBUSER = os.getenv("DBUSER")
DBPASS = os.getenv("DBPASS")
DBHOST = os.getenv("DBHOST")
DBPORT = os.getenv("DBPORT")


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


connection_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=1, maxconn=10,
    dbname=DBNAME, user=DBUSER, password=DBPASS, host=DBHOST, port=DBPORT
)


def get_connection():
    try:
        return connection_pool.getconn()
    except Exception as e:
        logger.error(f"Error getting connection: {e}")
        raise e


def release_connection(connection):
    connection_pool.putconn(connection)


def get_cursor():
    conn = get_connection()
    try:
        cursor = conn.cursor()
        yield cursor
        conn.commit()
    except Exception as e:
        logger.error(f"Error getting cursor: {e}")
        conn.rollback()
        raise e
    finally:
        cursor.close()
        release_connection(conn)


def database():
    try:
        with get_cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    email VARCHAR(255) PRIMARY KEY,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) DEFAULT 'user',
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW(),
                    UNIQUE (email)
                );

                CREATE TABLE IF NOT EXISTS chatbots (
                    id VARCHAR(255) PRIMARY KEY,
                    user_email VARCHAR(255) NOT NULL,
                    website VARCHAR(255),
                    description TEXT,
                    greeting_message TEXT,
                    default_response TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    FOREIGN KEY (user_email) REFERENCES users(email)
                );
            
                CREATE TABLE IF NOT EXISTS chatbot_messages (
                    id SERIAL PRIMARY KEY,
                    chatbot_id VARCHAR(255) NOT NULL,
                    customer_id VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    response TEXT NOT NULL,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    FOREIGN KEY (chatbot_id) REFERENCES chatbots(id)
                """)
        logger.info("Tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")


# CRUD

def create_user_db(user: CreateUser) -> bool | str:
    try:
        with get_cursor() as cur:
            cur.execute(
                "INSERT INTO users (email, password) VALUES (%s, %s)",
                (user.email, user.password)
            )
        logger.info(f"New user {user.email} created")
        return True
    except Exception as e:
        logger.error(f"Error adding new user: {e}")
        return "Some error occurred"


def create_chatbot_db(chatbot: CreateChatbot) -> bool | str:
    try:
        with get_cursor() as cur:
            cur.execute(
                "SELECT * FROM users WHERE email = %s", (chatbot.user_email,)
            )
            if cur.fetchone() is None:
                return {"success": False, "message": "User not found"}
            chatbot_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO chatbots (id, user_email, website, description, greeting_message, default_response) VALUES (%s, %s, %s, %s, %s, %s)",
                (chatbot_id, chatbot.user_email, chatbot.website, chatbot.description,
                 chatbot.greeting_message, chatbot.default_response)
            )
        logger.info(f"New chatbot {chatbot_id} added successfully.")
        return {"success": True, "chatbot_id": chatbot_id}
    except Exception as e:
        logger.error(f"Error adding new chatbot: {e}")
        return {"success": False, "message": "Some error occurred"}


def put_chatbot_history(chat: ChatMessage) -> bool | str:
    try:
        with get_cursor() as cur:
            cur.execute(
                "INSERT INTO chatbot_messages (chatbot_id, customer_id, message, response) VALUES (%s, %s, %s, %s)",
                (chat.chatbot_id, chat.customer_id, chat.message, chat.response)
            )
        logger.info(f"Chatbot message added successfully.")
    except Exception as e:
        logger.error(f"Error retrieving chatbot messages: {e}")
        return "Some error occurred"


def get_chatbot_history(chatbot_id: str, customer_id: str) -> list | str:
    try:
        with get_cursor() as cur:
            cur.execute(
                "SELECT * FROM chatbot_messages WHERE chatbot_id = %s AND customer_id = %s",
                (chatbot_id, customer_id)
            )
            messages = cur.fetchall()
            if messages:
                return messages
        return "No messages history"
    except Exception as e:
        logger.error(f"Error retrieving chatbot messages: {e}")
        return "Some error occurred"


def find_user(email: str) -> bool | str:
    try:
        with get_cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cur.fetchone()
            if user:
                return True
        return None
    except Exception as e:
        logger.error(f"Error retrieving user: {e}")
        return "Some error occurred"


def get_website_description(chatbot_id: str) -> str | None:
    try:
        with get_cursor() as cur:
            cur.execute(
                "SELECT description FROM chatbots WHERE id = %s", (chatbot_id,)
            )
            description = cur.fetchone()
            if description:
                return description[0]
        return None
    except Exception as e:
        logger.error(f"Error retrieving website description: {e}")
        return None


def get_chatbot(user_email: str) -> dict | str:
    try:
        with get_cursor() as cur:
            cur.execute(
                "SELECT * FROM chatbots WHERE user_email = %s", (user_email,))
            chatbot = cur.fetchone()
            if chatbot:
                return {
                    "website": chatbot[2],
                    "description": chatbot[3],
                    "greeting_message": chatbot[4],
                    "default_response": chatbot[5]
                }
        return None
    except Exception as e:
        logger.error(f"Error retrieving chatbot: {e}")
        return "Some error occurred"
