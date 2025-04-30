from fastapi import APIRouter, File, UploadFile, HTTPException
import os
router = APIRouter(
    prefix="/files",
    tags=["files"],
    responses={404: {"description": "Not found"}},
)
if not os.path.exists('uploads'):
    os.makedirs('uploads')
    
@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Čuvanje fajla na disk
        with open(f"uploads/{file.filename}", "wb") as f:
            f.write(await file.read())
        return {"filename": file.filename, "message": "Fajl je uspesno uploadovan!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Neuspesan upload fajla.") from e