<!-- docker run -d -e POSTGRES_DB=embed -e POSTGRES_PASSWORD=embed -e POSTGRES_USER=embed -p 6500:5432 postgres:latest -->

store customer id and chat history in frontend local storage

des as optional field for users
ai configurations as optional field for users
further tests needed for the ai configurations
all in types be stored in chatbots table in db 

import databases
from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Get your Supabase connection string from the Supabase dashboard
SUPABASE_CONNECTION_STRING = "your_supabase_connection_string"

# Create a SQLAlchemy engine
engine = create_engine(SUPABASE_CONNECTION_STRING)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a FastAPI app
app = FastAPI()

# Create a dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Example route that uses the database session
@app.get("/")
async def root(db: SessionLocal = Depends(get_db)):
    # Execute a query using the database session
    result = db.execute("SELECT 1").scalar()
    return {"message": "Hello from Supabase!", "result": result}
