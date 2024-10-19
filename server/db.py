import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import logging
from utils.models import ChatbotModels

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


# user

def get_user_db(user_id: str) -> dict | None:
    try:
        user = db.collection("embeddable.users").document(user_id).get()
        return user.to_dict() if user.exists else None
    except Exception as e:
        logger.error(f"Error retrieving user: {e}")
        return None


def get_user_db_login(email: str, password: str) -> dict | None:
    try:
        user = db.collection("embeddable.users").where(
            "email", "==", email).where("password", "==", password).get()
        return user[0].to_dict() if user else None
    except Exception as e:
        logger.error(f"Error retrieving user: {e}")
        return None


def create_user_db(email: str, password: str, user_id: str, role: str) -> bool:
    try:
        db.collection("embeddable.users").document(user_id).set({
            "user_id": user_id,
            "email": email,
            "password": password,
            "role": role,
            "chatbots": [],
            "created_at": firestore.SERVER_TIMESTAMP
        })
        return True
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return False


# chatbot

def get_chatbot_db(chatbot_id: str):
    try:
        chatbot = db.collection(
            "embeddable.chatbots").document(chatbot_id).get()
        return chatbot.to_dict() if chatbot.exists else None
    except Exception as e:
        logger.error(f"Error retrieving chatbot: {e}")
        return None


def generate_chatbot_id(n: int) -> str:
    import random
    import string
    return ''.join(random.choices(string.ascii_lowercase, k=n))


def create_chatbot_db(chatbot: ChatbotModels.CreateChatbot) -> str | bool:
    try:
        chatbot_id = generate_chatbot_id(8)
        chatbots = db.collection("embeddable.chatbots").document(chatbot_id)
        chatbot_dict = chatbot.model_dump()
        chatbot_dict["chatbot_id"] = chatbot_id
        chatbots.set(chatbot_dict)
        return chatbot_id
    except Exception as e:
        logger.error(f"Error creating chatbot: {e}")
        return False


def get_users_chatbots_db(user_id: str) -> list[dict] | None:
    try:
        chatbots = db.collection("embeddable.chatbots").where(
            "user_id", "==", user_id).stream()
        chatbots_list = []
        for chatbot in chatbots:
            chatbots_list.append(chatbot.to_dict())
        return chatbots_list[0] if chatbots_list else None
    except Exception as e:
        logger.error(f"Error retrieving chatbots: {e}")
        return None


def edit_chatbot_db(chatbot: ChatbotModels.CreateChatbot) -> bool:
    try:
        chatbot_id = chatbot.chatbot_id
        chatbot_dict = chatbot.model_dump()
        db.collection("embeddable.chatbots").document(
            chatbot_id).update(chatbot_dict)
        return True
    except Exception as e:
        logger.error(f"Error editing chatbot: {e}")
        return False


if __name__ == "__main__":
    print("DB Firestore")
