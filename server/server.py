from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import chatbot, add_to_vector_store
from db import new_user, get_user, new_chatbot, database
from utils.models import CreateUser, CreateChatbot, ChatMessage

import logging
import uuid
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


    
    
@app.get("/")
async def root():
    return {"message": "Hello aWorld"}

@app.post("/user")
async def create_user(user: CreateUser):
    result = new_user(user.email, user.password)
    if result is True:
        add_to_vector_store(user.description)
        return {"message": "User created successfully"}
    else:
        raise HTTPException(status_code=400, detail=result)

@app.get("/user/{email}")
async def retrieve_user(email: str):
    user = get_user(email)
    if user:
        return user
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/create_chatbot")
async def create_chatbot(chatbot: CreateChatbot):
    result = new_chatbot(chatbot)
    if result.success is True:
        chatbot_id = result.chatbot_id
        script = f'<script src="https://embeddable.com/chatbot.js" data-id="{chatbot_id}"></script>'
        iframe = f'<iframe src="https://embeddable.com/chatbot/{chatbot_id}" width="300" height="400" frameborder="0"></iframe>'
        return {"chatbot_id": chatbot_id, "script": script, "iframe": iframe}
    else:
        raise HTTPException(status_code=400, detail=result.message)


@app.post("/chat")
async def chat(message: ChatMessage):
    response = chatbot(message.message, message.chatbot_id)
    return {"response": response}



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)