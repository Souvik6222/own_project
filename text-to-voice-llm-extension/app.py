from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # {jan na paraga }
from pydantic import BaseModel
import ollama

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

@app.post("/ask")
def ask_llm(data: TextRequest):
    response = ollama.chat(
        model="llama3",
        messages=[
            {"role": "user",
             "content": data.text}
        ]
    )

    return {
        "reply": response["message"]["content"]
    }
