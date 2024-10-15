import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from app import chatbot
from db import create_user as create_user_db, create_chatbot as create_chatbot_db, retrieve_chatbot, retrieve_user, retrieve_users_chatbots
from utils.models import CreateUser, CreateChatbot, ServerChatMessageRequest
import logging
from pydantic import BaseModel

app = FastAPI()
load_dotenv()

CORS_ORIGINS = [
    os.getenv("CORS_ORIGIN"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# database()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.get("/")
async def root():
    return "Embeddable AI"


@app.post("/user")
async def create_user(user: CreateUser):
    result = create_user_db(user.email, user.password)
    if result is True:
        return {"success": True, "message": "User created successfully"}

    return {"success": False, "message": "Some error occurred"}


@app.get("/user")
async def get_user(email: str):
    user = retrieve_user(email)
    if user not in [None, []]:
        return {"success": True, "user": user}
    return {"success": False, "message": "User not found"}


@app.get("/chatbot")
async def get_chatbot(user_email: str):
    chatbots = retrieve_users_chatbots(user_email)
    if chatbots is not None:
        return {"success": True, "chatbots": chatbots}
    return {"success": False, "message": "Chatbot not found"}


@app.post("/create-chatbot")
async def create_chatbot(chatbot: CreateChatbot):
    result = create_chatbot_db(chatbot)
    if result:
        chatbot_id = result
        script = f'<script src="http://localhost:5173/chatbot.js" data-id="{
            chatbot_id}"></script>'
        return {"success": True, "chatbot_id": chatbot_id, "script": script}
    return {"success": False, "message": result.message}


class GetWebsiteDetails(BaseModel):
    chatbot_id: str


@app.post('/getwebsitedetails')
async def get_website_details(request: GetWebsiteDetails):
    try:
        chatconfig = retrieve_chatbot(request.chatbot_id)
        if (chatconfig is None):
            return {"success": False, "message": "Chatbot not found"}
        return {"success": True, "chatbot": chatconfig}
    except Exception as e:
        logger.error(f"Error getting chatbot details: {e}")
        return {"success": False, "message": "Some error occurred"}


@app.post("/chat")
async def chat(chat: ServerChatMessageRequest):
    try:
        # response = chatbot(chat)
        print(chat)
        return {"success": True, "response": "Hey i am chatbot"}
    except Exception as e:
        logger.error(f"Error chatting: {e}")
        return {"success": False, "response": "Some error occurred"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

    # uvicorn server:app --reload
