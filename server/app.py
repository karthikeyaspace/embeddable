import os
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains.llm import LLMChain
from dotenv import load_dotenv
import logging
from db import get_website_description

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


# not dealing with vector store now

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


def chatbot(message: str, chatbot_id: str) -> str:
    try:
        business_description = get_website_description(chatbot_id)
        if not business_description:
            return "Sorry, I couldn't find information about this business."

        prompt_template = PromptTemplate(
            input_variables=["business_description", "question"],
            template="""
            Business Description: {business_description}
            Customer Question: {question}
            Answer:
            """
        )

        chain = LLMChain(llm=llm, prompt=prompt_template)
        response = chain.invoke({
            "business_description": business_description,
            "question": message
        })

        return response['text']

    except Exception as e:
        logger.error(f"Error running chatbot: \n{e}")
        return "I'm sorry, but I encountered an error while processing your request."


if __name__ == "__main__":
    print(chatbot("What is the best way to increase sales?", "We are a company that sells shoes."))
