from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains.llm import LLMChain
import logging

from utils.models import ChatbotModels
from db import get_chatbot_db
from utils.config import env


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


llm = GoogleGenerativeAI(
    model="gemini-1.5-flash",
    api_key=env["GOOGLE_API_KEY"],
    temperature=0.5,
    max_tokens=100,
)


def chatbot(chat: ChatbotModels.ChatRequest) -> str:
    try:
        chatbot = get_chatbot_db(chat.chatbot_id)
        if chatbot is None:
            return {"success": False, "message": "Chatbot not found"}

        description = chatbot["description"]
        prev_messages = chat.prev_messages
        ai_configuration = chatbot["ai_configuration"]
        user_message = chat.user_message

        chatbot_history = "\n".join(
            prev_messages) if prev_messages else "No previous messages"
        ai_config_string = ""

        for config in ai_configuration:
            text = "If users ask about " + \
                config['user_question'] + " , then repond with " + \
                config['ai_response'] + "\n"
            ai_config_string += text

        prompt_template = PromptTemplate(
            input_variables=["website_description", "user_message",
                             "previous_user_messages", "ai_configuration"],
            template="""You are a chatbot acting as a professional representative of a business or individual. 
                    Your purpose is to provide clear, accurate, and helpful responses to customer inquiries 
                    while maintaining a natural and conversational tone. You must strictly use the provided information 
                    for context but have the flexibility to rephrase or enhance the phrasing for improved clarity and grammar, 
                    ensuring a polished response.
                    
                    Guidelines:
                    1. Rely solely on the provided business description, configuration, and previous conversation history to craft your responses.
                    2. Rephrase or refine any provided content as needed to make the response natural and grammatically correct while retaining the original intent.
                    3. Avoid speculative statements, placeholder content.
                    4. Do not generate code or any unrelated content in your response.

                    Context:
                    1. Business Description: {website_description}
                    2. Previous Conversation History (if any): {previous_user_messages}
                    3. Personalized Chatbot Configuration: {ai_configuration}

                    Customer Question:
                    {user_message}

                    Using the provided information, craft a professional and well-phrased response to the customer's question. 
                    Ensure the response aligns with the business tone and avoids unnecessary or irrelevant details.
                        """)
        print()
        chain = LLMChain(llm=llm, prompt=prompt_template)
        response = chain.invoke({
            "website_description": description,
            "user_message": user_message,
            "previous_user_messages": chatbot_history,
            "ai_configuration": ai_config_string
        })

        return response['text']

    except Exception as e:
        logger.error(f"Error running chatbot: \n{e}")
        return "I'm sorry, but I encountered an error while processing your request."


# not dealing with vector store any time soon

# def vector_store():
#     try:
#         if os.path.exists("faiss"):
#             store = FAISS.load_local("faiss", embeddings=embeddings)
#         else:
#             store = FAISS.from_texts([""], embeddings=embeddings)
#             store.save_local("faiss")
#         return store
#     except Exception as e:
#         logger.error(f"Error initializing vector store: \n{e}")
#         return None


# def add_to_vector_store(description: str):
#     try:
#         store = vector_store()
#         store.add_texts([description])
#         store.save_local("faiss")
#         return True
#     except Exception as e:
#         logger.error(f"Error adding to vector store: \n{e}")
#         return False


# def update_vector_store(old_description: str, new_description: str):
#     try:
#         store = vector_store()
#         store.delete([old_description])
#         store.add_texts([new_description])
#         store.save_local("faiss")
#         return True
#     except Exception as e:
#         logger.error(f"Error updating vector store: \n{e}")
#         return False
