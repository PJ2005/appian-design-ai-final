from supabase import create_client, Client
from bs4 import BeautifulSoup
import subprocess
from fastapi import HTTPException
import os


from dotenv import load_dotenv
load_dotenv()

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def parse_html(content: bytes) -> str:
    """
    Parse HTML content using BeautifulSoup and return prettified HTML.
    """
    soup = BeautifulSoup(content, "html.parser")
    return soup.prettify()

def query_codellama(prompt: str) -> str:
    """
    Query the CodeLlama model via the Ollama CLI.
    """
    try:
        result = subprocess.run(
            ["ollama", "run", "codellama", prompt],
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Error querying CodeLlama: {e.stderr.strip()}")

def save_to_supabase(original_html: str, improved_html: str) -> None:
    """
    Save the original and improved HTML to Supabase.
    """
    supabase.table("html_files").insert({
        "original_html": original_html,
        "improved_html": improved_html
    }).execute()
