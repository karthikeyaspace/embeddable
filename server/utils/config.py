import os
from dotenv import load_dotenv

load_dotenv()

env = {
    "GOOGLE_API_KEY": os.getenv('GOOGLE_API_KEY'),
    'CORS_ORIGIN': os.getenv('CORS_ORIGIN'),
    "FRONTEND_URL": os.getenv('FRONTEND_URL')
}
