from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import chatbot
from db import create_user, create_chatbot, database

from utils.models import CreateUser, CreateChatbot, ChatMessage
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.get("/")
async def root():
    return "Embeddable AI"


@app.post("/user")
async def create_user(user: CreateUser):
    result = create_user(user.email, user.password)
    if result is True:
        return {"success": True}

    return {"success": False, "message": "Some error occurred"}


@app.post("/create-chatbot")
async def create_chatbot(chatbot: CreateChatbot):
    result = create_chatbot(chatbot)
    if result.success is True:
        chatbot_id = result.chatbot_id
        script = f'<script src="http://localhost:5173/chatbot.js" data-id="{
            chatbot_id}"></script>'
        iframe = f'<iframe src="http://localhost:5173/chatbot/{
            chatbot_id}" width="300" height="400" frameborder="0"></iframe>'
        return {"chatbot_id": chatbot_id, "script": script, "iframe": iframe}

    return {"success": False, "message": result.message}


@app.post("/chat")
async def chat(chat: ChatMessage):
    try:
        response = chatbot(chat)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error chatting: {e}")
        return {"response": "Some error occurred"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
