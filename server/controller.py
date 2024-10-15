from db import (
    create_user_db, get_user_db, delete_chatbot_db, get_chatbot_db,
    edit_chatbot_db, create_chatbot_db, get_users_chatbots_db
)
from utils.models import UserModels, ChatbotModels
from uuid import uuid4
from langchain import chatbot


class UserController:
    @staticmethod
    async def get_user(user_id: str):
        user = get_user_db(user_id)
        if user:
            return {"success": True, "user": user}
        return {"success": False, "message": "User not found"}

    @staticmethod
    async def create_user(user: UserModels.CreateUserRequest):
        user_id = str(uuid4())
        result = create_user_db(
            user.email, user.password, user_id, role="user")
        return {"success": result, "message": "User created successfully" if result else "Failed to create user"}


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
    async def delete_chatbot(user_email: str, chatbot_name: str):
        result = delete_chatbot_db(user_email, chatbot_name)
        return {"success": result, "message": "Chatbot deleted successfully" if result else "Some error occurred"}

    @staticmethod
    async def edit_chatbot(chatbot: ChatbotModels.CreateChatbot):
        result = edit_chatbot_db(chatbot)
        return {"success": result, "message": "Chatbot edited successfully" if result else "Some error occurred"}

    @staticmethod
    async def chatai(chat: ChatbotModels.ChatRequest):
        response = chatbot(chat)
        return {"success": True, "response": response}
