from pydantic import BaseModel
from typing import List, Dict


class UserModels:
    class GetUserRequest(BaseModel):
        user_id: str

    class LoginRequest(BaseModel):
        email: str
        password: str

    class CreateUserRequest(BaseModel):
        email: str
        password: str

    class ResendVerificationRequest(BaseModel):
        email: str


class ChatbotModels:
    class GetChatbotRequest(BaseModel):
        user_id: str

    class GetChatbotDetailsRequest(BaseModel):
        chatbot_id: str

    class CreateChatbot(BaseModel):
        user_id: str
        logo_url: str
        image_url: str
        user_name: str
        website_url: str
        chatbot_type: str
        home_message: str
        description: str
        contact_link: str
        default_questions: List[str]
        greeting_message: str
        error_response: str
        ai_configuration: List[Dict[str, str]]

    class ChatRequest(BaseModel):
        # customer_id: str - used for analytics, no need now
        chatbot_id: str
        user_message: str
        prev_messages: list[str] | None


'''
    db schema
    
    users - user_id, email, password, role, chatbots,created_at
    chatbots - chatbot_id, user_id, website, logo_url, image_url, 
                user_name, website_url, chatbot_type, home_message, description,           
                contact_link, default_questions, greeting_message, error_response, ai_configuration, created_at
        
'''
