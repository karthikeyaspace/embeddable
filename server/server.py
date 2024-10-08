from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app import chatbot, add_to_vector_store
from db import new_user, get_user, change_description, new_chatbot, create_tables
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

create_tables()


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UserCreate(BaseModel):
    email: str
    password: str
    website: str
    description: str

class ChatMessage(BaseModel):
    message: str
    chatbot_id: str

class DescriptionUpdate(BaseModel):
    email: str
    description: str

class ChatbotCreate(BaseModel):
    user_mail: str
    website: str
    description: str

@app.post("/user")
async def create_user(user: UserCreate):
    result = new_user(user.email, user.password, user.website, user.description)
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

@app.post("/chatbot")
async def create_chatbot(chatbot: ChatbotCreate):
    chatbot_id = str(uuid.uuid4())
    result = new_chatbot(chatbot_id, chatbot.user_email, chatbot.website, chatbot.description)
    if result is True:
        add_to_vector_store(chatbot.description, chatbot_id)
        script = f'<script src="https://embeddable.com/chatbot.js" data-id="{chatbot_id}"></script>'
        iframe = f'<iframe src="https://embeddable.com/chatbot/{chatbot_id}" width="300" height="400" frameborder="0"></iframe>'
        return {"chatbot_id": chatbot_id, "script": script, "iframe": iframe}
    else:
        raise HTTPException(status_code=400, detail=result)

@app.post("/chat")
async def chat(message: ChatMessage):
    response = chatbot(message.message, message.chatbot_id)
    return {"response": response}

@app.put("/description")
async def update_description(update: DescriptionUpdate):
    result = change_description(update.email, update.description)
    if result is True:
        add_to_vector_store(update.description)
        return {"message": "Description updated successfully"}
    else:
        raise HTTPException(status_code=400, detail=result)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)