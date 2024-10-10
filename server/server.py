from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# from app import chatbot
# from db import create_user_db, create_chatbot_db, database, get_chatbot
from utils.data import website1, website2
from utils.models import CreateUser, CreateChatbot, ChatMessage
import logging
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
        return {"success": True}

    return {"success": False, "message": "Some error occurred"}


@app.post("/create-chatbot")
async def create_chatbot(chatbot: CreateChatbot):
    result = create_chatbot_db(chatbot)
    if result.success is True:
        chatbot_id = result.chatbot_id
        script = f'<script src="http://localhost:5173/chatbot.js" data-id="{
            chatbot_id}"></script>'
        iframe = f'<iframe src="http://localhost:5173/chatbot/{
            chatbot_id}" width="300" height="400" frameborder="0"></iframe>'
        return {"chatbot_id": chatbot_id, "script": script, "iframe": iframe}

    return {"success": False, "message": result.message}


class GetWebsiteDetails(BaseModel):
    chatbot_id: str


@app.post('/getwebsitedetails')
async def get_website_details(request: GetWebsiteDetails):
    try:
        # chatbot = get_chatbot(chatbot_id)
        return {"success": True, "website": website1}
    except Exception as e:
        logger.error(f"Error getting chatbot details: {e}")
        return {"website": "", "description": ""}


class ChatRequest(BaseModel):
    chatbot_id: str
    message: str


@app.post("/chat")
async def chat(message: ChatRequest):
    try:
        # response = chatbot(chat)
        print(message)
        return {"success": True, "response": "Hey i am chatbot"}
    except Exception as e:
        logger.error(f"Error chatting: {e}")
        return {"success": False, "response": "Some error occurred"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

    # uvicorn server:app --reload
