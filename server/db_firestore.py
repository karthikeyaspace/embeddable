import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import logging
from utils.models import CreateUser, CreateChatbot

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()


def create_user(user: CreateUser):
    try:
        users = db.collection("embeddable.users").document()
        user_dict = user.model_dump()
        users.set(user_dict)
        return True
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return False


def create_chatbot(chatbot: CreateChatbot):
    try:
        chatbots = db.collection("embeddable.chatbots").document()
        chatbot_dict = chatbot.model_dump()
        chatbots.set(chatbot_dict)
        return True
    except Exception as e:
        logger.error(f"Error creating chatbot: {e}")
        return False


def retrieve_users_chatbots(user_id: str):
    try:
        chatbots = db.collection("embeddable.chatbots").where(
            "user_id", "==", user_id).stream()
        chatbot_list = []
        for chatbot in chatbots:
            chatbot_list.append(chatbot.to_dict())
        return chatbot_list
    except Exception as e:
        logger.error(f"Error retrieving chatbots: {e}")
        return []


def edit_chatbot(chatbot: CreateChatbot):
    try:
        chatbot_id = chatbot.chatbot_id
        chatbot_ref = db.collection("embeddable.chatbots").document(chatbot_id)
        chatbot_dict = chatbot.model_dump()
        chatbot_ref.update(chatbot_dict)
        return True
    except Exception as e:
        logger.error(f"Error editing chatbot: {e}")
        return False


def delete_chatbot(chatbot_id: str):
    try:
        chatbot_ref = db.collection("embeddable.chatbots").document(chatbot_id)
        chatbot_ref.delete()
        return True
    except Exception as e:
        logger.error(f"Error deleting chatbot: {e}")
        return False


if __name__ == "__main__":
    print("DB Firestore")
