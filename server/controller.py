from db import (
    create_user_db, get_user_db, get_dup_email, verify_user_db, get_chatbot_db,
    edit_chatbot_db, create_chatbot_db, get_users_chatbots_db, get_user_by_email
)
from uuid import uuid4
from ai import chatbot
from datetime import timedelta, datetime, timezone
import jwt
from utils.models import UserModels, ChatbotModels
from utils.mail import sendMail
from utils.logger import logger

SECRET_KEY = "secret"
VERIFICATION_EXPIRY = timedelta(minutes=5)
SESSION_EXPIRY = timedelta(hours=24)


class UserController:
    @staticmethod
    async def get_user(user_id: str):
        user = get_user_db(user_id)
        if user:
            return {"success": True, "user": user}
        return {"success": False, "message": "User not found"}

    @staticmethod
    async def login(user: UserModels.LoginRequest):
        try:
            userdb = get_user_by_email(email=user.email)
            if not userdb:
                return {"success": False, "message": "Invalid crediantials"}

            if userdb['password'] != user.password:
                return {"success": False, "message": "Invalid crediantials"}

            if not userdb.get("email_verified", False):
                return {"success": False, "message": "Email not verified"}

            expires_at = datetime.now(timezone.utc) + SESSION_EXPIRY
            token = jwt.encode({
                "user_id": userdb['user_id'],
                "exp": expires_at.timestamp(),
                "email": user.email,
            }, SECRET_KEY, algorithm="HS256")

            return {
                "success": True,
                "user_id": userdb['user_id'],
                "token": token,
                "expires_at": expires_at.timestamp()
            }

        except Exception as e:
            logger.error(f"Error logging in: {e}")
            return {"success": False, "message": "Failed to login"}

    @staticmethod
    async def create_user(user: UserModels.CreateUserRequest):
        try:
            if get_dup_email(user.email):
                return {"success": False, "message": "Mail already exists"}

            user_id = str(uuid4())

            verification_token = await UserController.gen_verification_token(user_id)

            result = create_user_db(
                email=user.email,
                password=user.password,
                user_id=user_id,
                role="user"
            )

            if result:
                await sendMail(verification_token, email=user.email)
                return {"success": True, "message": f"Verification mail sent to {user.email}", "user_id": user_id}
            return {"success": False, "message": "Failed to create user"}
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return {"success": False, "message": "Failed to create user"}

    @staticmethod
    async def verify_user(token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            expires_at = datetime.fromtimestamp(
                payload.get("exp"), timezone.utc)

            if datetime.now(timezone.utc) > expires_at:
                return {"success": False, "message": "Verification link has expired"}

            user = get_user_db(user_id)

            if not user:
                return {"success": False, "message": "User not found"}

            if user.get("email_verified", False):
                return {"success": False, "message": "Email already verified"}

            if verify_user_db(user_id):
                session_token = jwt.encode({
                    "user_id": user_id,
                    "exp": (datetime.now(timezone.utc) + SESSION_EXPIRY).timestamp(),
                    "email": user["email"],
                }, SECRET_KEY, algorithm="HS256")

                return {
                    "success": True,
                    "message": "Email verified successfully",
                    "token": session_token,
                    "user_id": user_id,
                    "expires_at": datetime.now(timezone.utc) + SESSION_EXPIRY
                }
            return {"success": False, "message": "Failed to verify email"}
        except jwt.ExpiredSignatureError:
            return {"success": False, "message": "Verification link has expired"}
        except jwt.InvalidTokenError:
            return {"success": False, "message": "Invalid verification link"}
        except Exception as e:
            logger.error(f"Error verifying user: {e}")
            return {"success": False, "message": "Verification failed"}

    @staticmethod
    async def resend_verification(request: UserModels.ResendVerificationRequest):
        try:
            user = get_user_by_email(email=request.email)
            if not user:
                return {"success": False, "message": "User not found"}

            if user.get("email_verified", False):
                return {"success": False, "message": "Email already verified"}

            verification_token = await UserController.gen_verification_token(user["user_id"])
            await sendMail(verification_token, email=request.email)

            return {"success": True, "message": f"New verification token sent to {request.email}"}

        except Exception as e:
            logger.error(f"Error resending verification: {e}")
            return {"success": False, "message": "Failed to resend verification"}

    @staticmethod
    async def gen_verification_token(user_id: str) -> str:
        expires_at = datetime.now(timezone.utc) + VERIFICATION_EXPIRY
        token = jwt.encode({
            "user_id": user_id,
            "exp": expires_at.timestamp(),
            "type": "verification"
        }, SECRET_KEY, algorithm="HS256")
        return token


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
            return {"success": result, "message": "Chatbot edited successfully" if result else "Failed to edit chatbot", "chatbot_id": user_chatbot['chatbot_id']}
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
