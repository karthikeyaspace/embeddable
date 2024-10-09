from pydantic import BaseModel

class CreateUser(BaseModel):
    email: str
    password: str
    

class CreateChatbot(BaseModel):
    user_email: str
    website: str
    description: str
    greeting_message: str
    default_response: str
    

class ChatMessage(BaseModel):
    chatbot_id: str
    customer_id: str
    message: str
    response: str