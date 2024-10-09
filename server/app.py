import os
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains.llm import LLMChain
from dotenv import load_dotenv
import logging
from db import get_website_description, get_chatbot_history
from utils.models import ChatMessage

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

llm = GoogleGenerativeAI(
    model="gemini-1.5-flash",
    api_key=GOOGLE_API_KEY,
    temperature=0.5,
    max_tokens=100,
)


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


def chatbot(chat: ChatMessage) -> str:
    try:
        website_description = get_website_description(chat.chatbot_id)
        chatbot_history = get_chatbot_history(chat.chatbot_id)
        if not website_description:
            return "Sorry, I couldn't find information about this platform."

        prompt_template = PromptTemplate(
            input_variables=["website_description", "question", "chatbot_history"],
            template="""
            Website Description: {website_description}
            Customer Question: {question}
            Previous Messages of customer: {chatbot_history}
            Answer:
            """
        )

        chain = LLMChain(llm=llm, prompt=prompt_template)
        response = chain.invoke({
            "website_description": website_description,
            "question": chat.message,
            "chatbot_history": chatbot_history
        })

        return response['text']

    except Exception as e:
        logger.error(f"Error running chatbot: \n{e}")
        return "I'm sorry, but I encountered an error while processing your request."

  
