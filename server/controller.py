from db import (
    create_user_db, get_user_db, get_user_db_login, get_chatbot_db,
    edit_chatbot_db, create_chatbot_db, get_users_chatbots_db
)
from utils.models import UserModels, ChatbotModels
from uuid import uuid4
from ai import chatbot


class UserController:
    @staticmethod
    async def get_user(user_id: str):
        user = get_user_db(user_id)
        if user:
            return {"success": True, "user": user}
        return {"success": False, "message": "User not found"}

    @staticmethod
    async def login(user: UserModels.LoginRequest):
        userdb = get_user_db_login(email=user.email, password=user.password)
        if userdb:
            return {"success": True, "userId": userdb['user_id']}
        return {"success": False, "message": "Invalid credentials"}

    @staticmethod
    async def create_user(user: UserModels.CreateUserRequest):
        user_id = str(uuid4())
        result = create_user_db(
            user.email, user.password, user_id, role="user")
        if result:
            return {"success": True, "userId": user_id}
        return {"success": False, "message": "Failed to create user"}


class ChatbotController:
    @staticmethod
    async def get_users_chatbot(user_id: str):
        chatbot = get_users_chatbots_db(user_id)
        if chatbot != None:
            return {"success": True, "chatbot": chatbot}
        return {"success": False, "message": "Chatbot not found"}

    @staticmethod
    async def create_edit_chatbot(chatbot: ChatbotModels.CreateChatbot):
        user_chatbot = get_users_chatbots_db(chatbot.user_id)
        print("user", user_chatbot)
        if user_chatbot:
            result = edit_chatbot_db(chatbot, user_chatbot['chatbot_id'])
            return {"success": result, "message": "Chatbot edited successfully" if result else "Failed to edit chatbot"}
        result = create_chatbot_db(chatbot)
        if result:
            chatbot_id = result
            return {"success": True, "message": "Chatbot created succesfully", "chatbot_id": chatbot_id}
        return {"success": False, "message": "Failed to create chatbot"}

    @staticmethod
    async def get_chatbot(chatbot_id: str):
        chatbot = get_chatbot_db(chatbot_id)
        if chatbot:
            return {"success": True, "chatbot": chatbot}

    @staticmethod
    async def chatai(chat: ChatbotModels.ChatRequest):
        response = chatbot(chat)
        return {"success": True, "response": response}
