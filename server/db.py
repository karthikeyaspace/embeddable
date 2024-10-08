import psycopg2
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_connection():
    try:
        connection = psycopg2.connect(
            dbname="mydb",
            user="postgres",
            password="testpass123",
            host="localhost",
            port=5432
        )
        return connection
    except Exception as e:
        logger.error(f"Error connecting to the database: {e}")
        raise e
    
def create_tables():
    connection = get_connection()
    try:
        cur = connection.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                email VARCHAR(255) PRIMARY KEY,
                password VARCHAR(255) NOT NULL,
                website VARCHAR(255),
                description TEXT
            );

            CREATE TABLE IF NOT EXISTS chatbots (
                id VARCHAR(255) PRIMARY KEY,
                user_email VARCHAR(255) NOT NULL,
                website VARCHAR(255),
                description TEXT,
                FOREIGN KEY (user_email) REFERENCES users(email)
            );
        """)
        connection.commit()
        logger.info("Tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating tables: {e}")
    finally:
        cur.close()
        connection.close()

def new_user(email: str, password: str, website: str, description: str) -> bool | str:
    connection = get_connection()
    try:
        cur = connection.cursor()
        cur.execute(
            "INSERT INTO users (email, password, website, description) VALUES (%s, %s, %s, %s)",
            (email, password, website, description)
        )
        connection.commit()
        logger.info(f"New user {email} added successfully.")
        return True
    except Exception as e:
        logger.error(f"Error adding new user: {e}")
        return "Some error occurred"
    finally:
        cur.close()
        connection.close()

def get_user(email: str) -> dict | str:
    connection = get_connection()
    try:
        cur = connection.cursor()
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        if user:
            return {
                "email": user[0],
                "password": user[1],
                "website": user[2],
                "description": user[3]
            }
        return None
    except Exception as e:
        logger.error(f"Error retrieving user: {e}")
        return "Some error occurred"
    finally:
        cur.close()
        connection.close()

def get_website_description(chatbot_id: str) -> str | None:
    connection = get_connection()
    try:
        cur = connection.cursor()
        cur.execute("SELECT description FROM chatbots WHERE id = %s", (chatbot_id,))
        description = cur.fetchone()
        if description:
            return description[0]
        return None
    except Exception as e:
        logger.error(f"Error retrieving chatbot description: {e}")
        return None
    finally:
        cur.close()
        connection.close()


def get_old_description(email: str) -> str | None:
    connection = get_connection()
    try:
        cur = connection.cursor()
        cur.execute("SELECT description FROM users WHERE email = %s", (email,))
        description = cur.fetchone()
        if description:
            return description[0]
        return None
    except Exception as e:
        logger.error(f"Error retrieving old description: {e}")
        return None
    finally:
        cur.close()
        connection.close()

def change_description(email: str, description: str) -> bool | str:
    connection = get_connection()
    try:
        old_description = get_old_description(email)
        if old_description is None:
            return "User not found"

        cur = connection.cursor()
        cur.execute("UPDATE users SET description = %s WHERE email = %s", (description, email))
        connection.commit()
        logger.info(f"Description updated successfully for {email}.")
        
        # Update the vector store
        from app import update_vector_store
        update_vector_store(old_description, description)
        
        return True
    except Exception as e:
        logger.error(f"Error updating description: {e}")
        return "Some error occurred"
    finally:
        cur.close()
        connection.close()
    
def new_chatbot(chatbot_id: str, user_email: str, website: str, description: str) -> bool | str:
    connection = get_connection()
    try:
        cur = connection.cursor()
        cur.execute("SELECT email FROM users WHERE email = %s", (user_email,))
        if cur.fetchone() is None:
            return "User not found"
        
        cur.execute(
            "INSERT INTO chatbots (id, user_email, website, description) VALUES (%s, %s, %s, %s)",
            (chatbot_id, user_email, website, description)
        )
        connection.commit()
        logger.info(f"New chatbot {chatbot_id} added successfully.")
        return True
    except Exception as e:
        logger.error(f"Error adding new chatbot: {e}")
        return str(e)
    finally:
        cur.close()
        connection.close()

def get_chatbot_description(chatbot_id: str) -> str | None:
    connection = get_connection()
    try:
        cur = connection.cursor()
        cur.execute("SELECT description FROM chatbots WHERE id = %s", (chatbot_id,))
        description = cur.fetchone()
        if description:
            return description[0]
        return None
    except Exception as e:
        logger.error(f"Error retrieving chatbot description: {e}")
        return None
    finally:
        cur.close()
        connection.close()