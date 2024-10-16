from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controller import UserController, ChatbotController
from utils.models import UserModels, ChatbotModels
from utils.config import env
import logging

app = FastAPI()

CORS_ORIGINS = [
    env["CORS_ORIGIN"],
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.get("/")
async def root():
    return "Embeddable AI"


@app.post("/user/get")
async def get_user(request: UserModels.GetUserRequest):
    return await UserController.get_user(request.user_id)


@app.post("/user/post")
async def create_user(request: UserModels.CreateUserRequest):
    return await UserController.create_user(request)


@app.post("/chatbots")
async def get_chatbot(request: ChatbotModels.GetChatbotRequest):
    return await ChatbotController.get_users_chatbots(request.user_id)


@app.post("/chatbots/{chatbot_id}/edit")
async def edit_chatbot(request: ChatbotModels.CreateChatbot):
    return await ChatbotController.edit_chatbot(request)


@app.post("/create-chatbot")
async def create_chatbot(request: ChatbotModels.CreateChatbot):
    return await ChatbotController.create_chatbot(request)


@app.post("/embedchatbot")
async def get_chatbot_details(request: ChatbotModels.GetChatbotDetailsRequest):
    return await ChatbotController.get_chatbot(request.chatbot_id)


@app.post("/chat")
async def chat(request: ChatbotModels.ChatRequest):
    return await ChatbotController.chatai(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)


# uvicorn server:app --reload
