from db import (
    create_user_db, get_user_db, get_user_db_login, get_dup_email, verify_user_db, get_chatbot_db,
    edit_chatbot_db, create_chatbot_db, get_users_chatbots_db
)
from uuid import uuid4
from ai import chatbot
from datetime import timedelta, datetime, timezone
import jwt
from utils.models import UserModels, ChatbotModels
from utils.mail import sendMail
from utils.logger import logger

SECRET_KEY = "secret"


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
        if not userdb['email_verified']:
            return {"success": False, "message": "Mail not verified"}
        expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
        token = jwt.encode({
            "user_id": userdb['user_id'],
            "exp": expires_at,
            "email": user.email,
        }, SECRET_KEY, algorithm="HS256")
        if userdb:
            return {"success": True, "user_id": userdb['user_id'], "token": token, "expires_at": expires_at}
        return {"success": False, "message": "Invalid credentials"}

    @staticmethod
    async def create_user(user: UserModels.CreateUserRequest):
        
        dup = get_dup_email(email=user.email)
        if dup:
            return {"success": False, "message": "Mail already exists"}

        user_id = str(uuid4())

        # token expiry
        expires_at = datetime.now(timezone.utc) + \
            timedelta(minutes=5)  # token expiration

        mailtoken = jwt.encode({
            "user_id": user_id,
            "exp": expires_at,
        }, SECRET_KEY, algorithm="HS256")

        result = create_user_db(
            user.email, user.password, user_id, expires_at, role="user")
        if result:
            await sendMail(mailtoken, email=user.email)
            return {"success": True, "message": f"Mail sent <{user.email}>", "user_id": user_id}
        return {"success": False, "message": "Failed to create user"}

    @staticmethod
    async def verify_user(token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            expires_at = payload.get("exp")
            current_time = datetime.now(timezone.utc)
            if current_time < expires_at:
                return {"success": False, "message": "Token expired"}

            user_id = payload.get("user_id")
            res = verify_user_db(user_id)

            if (res):
                return {"success": True, "message": "User verified"}
            return {"success": False, "message": "Failed to verify user"}

        except Exception as e:
            logger.info(f"Error Verifing user {user_id}")


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
