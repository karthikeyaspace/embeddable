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


# authentication

@app.post("/login")
async def login(request: UserModels.LoginRequest):
    return await UserController.login(request)


@app.post("/register")
async def register(request: UserModels.CreateUserRequest):
    return await UserController.create_user(request)


@app.post("/verify/{token}")
async def verify_user(token: str):
    return await UserController.verify_user(token)


@app.post("/resend-verification")
async def resend_verification(request: UserModels.ResendVerificationRequest):
    return await UserController.resend_verification(request)


@app.post("/getbot")
async def get_chatbot(request: ChatbotModels.GetChatbotRequest):
    return await ChatbotController.get_users_chatbot(request.user_id)


@app.post("/makebot")
async def makebot(request: ChatbotModels.CreateChatbot):
    return await ChatbotController.create_edit_chatbot(request)


# after embedding routes

@app.post("/embedbot")
async def get_chatbot_details(request: ChatbotModels.GetChatbotDetailsRequest):
    return await ChatbotController.get_chatbot(request.chatbot_id)


@app.post("/chat")
async def chat(request: ChatbotModels.ChatRequest):
    return await ChatbotController.chatai(request)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8001)


# uvicorn server:app --reload
