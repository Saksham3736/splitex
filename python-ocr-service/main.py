from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
import cv2
import numpy as np
from PIL import Image
import io
import re
import json
import logging

app = FastAPI(title="SplitEX OCR Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: set tesseract cmd if required on windows
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

@app.post("/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocessing for better OCR
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        extracted_text = pytesseract.image_to_string(thresh)
        items = parse_receipt_text(extracted_text)
        
        if not items:
            return get_mock_data()
            
        total = sum([item["price"] for item in items])
        return {"items": items, "total": total, "method": "ocr"}
        
    except Exception as e:
        logging.error(f"OCR Error: {str(e)}")
        # Graceful fallback to mock data if tesseract is missing
        return get_mock_data()

def parse_receipt_text(text: str):
    items = []
    lines = text.split('\n')
    
    # A very basic regex to find lines with a price at the end
    price_pattern = re.compile(r'(.*?)\s+[\$£€₹]?\s*(\d+[\.,]\d{2})\s*$')
    
    for line in lines:
        if not line.strip():
            continue
            
        match = price_pattern.match(line)
        if match:
            description = match.group(1).strip()
            # Ignore totals/taxes from parsing as items
            if any(x in description.lower() for x in ['total', 'tax', 'subtotal', 'tip']):
                continue
            
            price_str = match.group(2).replace(',', '.')
            try:
                price = float(price_str)
                items.append({"description": description, "price": price})
            except ValueError:
                pass
                
    return items

def get_mock_data():
    return {
        "method": "mock",
        "items": [
            {"description": "Margherita Pizza", "price": 450.0},
            {"description": "Garlic Bread", "price": 120.0},
            {"description": "Coca Cola 500ml", "price": 60.0},
            {"description": "Pasta Alfredo", "price": 320.0}
        ],
        "total": 950.0
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
