from pydantic import BaseModel


class CreateUser(BaseModel):
    user_id: str
    email: str
    password: str
    role: str = "user"


class CreateChatbot(BaseModel):
    chatbot_id: str
    user_id: str
    website: str
    logo_url: str
    image_url: str
    user_name: str
    website_url: str
    chatbot_type: str
    home_message: str
    description: str | None
    contact_link: str
    default_questions: list[str]
    greeting_message: str
    error_response: str
    ai_configuration: list[dict[str, str]] | None
