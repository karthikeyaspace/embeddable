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
        logger.info(f"Chat: {chat}")
        # chatbot = get_chatbot_db(chat.chatbot_id)
        # if chatbot is None:
        #     return {"success": False, "message": "Chatbot not found"}

        # description = chatbot["description"]
        # prev_messages = chat.prev_messages
        # ai_configuration = chatbot["ai_configuration"]
        # user_message = chat.user_message

        # chatbot_history = "\n".join(prev_messages) if prev_messages else ""
        # ai_config_string = ""

        # for key, value in ai_configuration:
        #     text = "If users ask about " + key + " , then repond with " + value + "\n"
        #     ai_config_string += text

        # prompt_template = PromptTemplate(
        #     input_variables=["website_description", "user_message",
        #                      "previous_user_messages", "ai_configuration"],
        #     template=""" You are a customer service representative for a business. 
        #     You are chatting with a customer who is asking a question about the business. 
        #     +6You need to provide an answer to the customer's question.
        #     For your context, Here is the business description: {website_description}, 
        #     Previous Messages of customer: {previous_user_messages},
        #     Here is how you shall respond: {ai_configuration}
        #     Here is the customer's question you need to respond to: {user_message}
        #     Answer:
        #     """
        # )
        
        # logger.info(f"Prompt: {prompt_template}")

        # chain = LLMChain(llm=llm, prompt=prompt_template)
        # response = chain.invoke({
        #     "website_description": description,
        #     "user_message": user_message,
        #     "previous_user_messages": chatbot_history,
        #     "ai_configuration": ai_config_string
        # })

        # return response['text']
        
        return "ahihi"

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