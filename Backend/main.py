from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import app as backend_app

# Initialize FastAPI app
app = FastAPI()

# CORS Middleware - for frontend integration apparently
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FastAPI app
app = FastAPI()

# This currently only parses the html. Use it to check integration part
@app.post("/improve-code/")
async def improve_code(file: UploadFile = File(...)):
    """
    Endpoint to upload an HTML file, improve it, and return the result.
    """
    if file.content_type != "text/html":
        raise HTTPException(status_code=400, detail="Only HTML files are supported.")
    
    # Read file content
    content = await file.read()

    # Parse HTML
    parsed_html = backend_app.parse_html(content)
    return JSONResponse(content={"improved_html": parsed_html}, status_code=200)

    # Query CodeLlama for improvements
    prompt = f"Improve the aesthetics, colour palette and responsiveness of the following HTML Code and give me the new code.\n\n{parsed_html}"
    improved_html = backend_app.query_codellama(prompt)

    # Save to Supabase
    backend_app.save_to_supabase(parsed_html, improved_html)

    # Return improved HTML
    return JSONResponse(content={"improved_html": improved_html}, status_code=200)


# @app.post("/save/")
# async def save_changes(original_html: str = Form(...), modified_html: str = Form(...), metadata: str = Form(...)):
#     try:
#         # Insert data into Supabase
#         response = supabase.table("changes").insert({
#             "original_html": original_html,
#             "modified_html": modified_html,
#             "metadata": metadata
#         }).execute()

#         if response.get("status_code") != 201:
#             raise HTTPException(status_code=500, detail="Failed to save changes to Supabase.")
        
#         return {"status": "Changes saved successfully!"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/history/")
# async def get_change_history():
#     try:
#         # Fetch data from Supabase
#         response = supabase.table("changes").select("*").execute()

#         if response.get("status_code") != 200:
#             raise HTTPException(status_code=500, detail="Failed to fetch change history from Supabase.")
        
#         return {"history": response.get("data", [])}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))