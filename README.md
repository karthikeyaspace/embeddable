# EmbeddableAI

A platform to create and embed chatbot for your business or personal website. It is built using Reactjs, Fastapi, Python, Postgres, and Tailwind CSS. Featuring custom user authentication and authorization using jwt.



### Tech Stack

- **Frontend**: Reactjs, Typescript
- **Backend**: Fastapi, Python
- **Database**: Firebase
- **AI**: Langchain, Google Gemini 


## Quick local setup

Follow these steps to get Photolic running on your local machine for development and testing.

### Prerequisites

Requirements for the software and other tools to build, test, and push:

- [NPM](https://www.npmjs.com/) (or any other package manager)
- [Node](https://nodejs.org/en/download/package-manager)
- [Python](https://www.python.org/downloads/)

### Installation Steps


1. **Clone the repository**:
    ```bash
    git clone https://github.com/karthikeyaspace/embeddable.git
    cd photolic
    ```

2. **Setup Firebase**: \
    get a file **serviceAccountsKey.json** from your firebase console and keep the file at /server directory
3. **Install Dependencies** \
    ```bash
    at /client
    npm install
    ```
    ```bash
    at server, make sure you have all the packages from requirements.txt or r.txt
    ```

### Environment Variables Setup

1. Copy the `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```

2. Replace the placeholders with your credentials in the `.env` file:
    ```bash
    GOOGLE_API_KEY = 
    CORS_ORIGIN = http://localhost:5173
    FRONTEND_URL = http://localhost:5173
    SECRET_KEY = 
    EMAIL_ID = your email
    EMAIL_PASS = your google app password
    ```


### Running the Development Server

Once your environment is set up, start the development server with:

```bash
/frontend
npm run dev
```
```bash
/server
uvicorn server:app --reload
```
The application should now be accessible at http://localhost:5173/ with backend at http://localhost:8000/  
