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
            return {"success": True, "userId": userdb.user_id}
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
    async def get_users_chatbots(user_id: str):
        chatbots = get_users_chatbots_db(user_id)
        if chatbots:
            return {"success": True, "chatbots": chatbots}
        return {"success": False, "message": "Chatbots not found"}

    @staticmethod
    async def create_chatbot(chatbot: ChatbotModels.CreateChatbot):
        result = create_chatbot_db(chatbot)
        if result:
            chatbot_id = result
            script = f'<script src="http://localhost:5173/chatbot.js" data-id="{
                chatbot_id}"></script>'
            return {"success": True, "script": script}
        return {"success": False, "message": "Some error occurred"}

    @staticmethod
    async def get_chatbot(chatbot_id: str):
        chatbot = get_chatbot_db(chatbot_id)
        if chatbot:
            return {"success": True, "chatbot": chatbot}

    @staticmethod
    async def edit_chatbot(chatbot: ChatbotModels.CreateChatbot):
        result = edit_chatbot_db(chatbot)
        return {"success": result, "message": "Chatbot edited successfully" if result else "Some error occurred"}

    @staticmethod
    async def chatai(chat: ChatbotModels.ChatRequest):
        response = chatbot(chat)
        return {"success": True, "response": response}
