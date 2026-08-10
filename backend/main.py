import os
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")


class ChatRequest(BaseModel):
    message: str


class RouteSuggestRequest(BaseModel):
    home_address: str
    destination_address: str


class RouteOption(BaseModel):
    name: str = Field(description="Tên phương án di chuyển, ví dụ 'Đi bộ', 'Xe đạp', hoặc tên tuyến xe buýt ước lượng")
    description: str = Field(description="Mô tả ngắn 1 câu, ví dụ quãng đường phù hợp hoặc tuyến gần đúng")
    pct: float = Field(description="Phần trăm quãng đường ước tính có thể đổi sang phương án này, khoảng 10-45")
    feas: float = Field(description="Độ khả thi ước tính, thang điểm 1 (thấp) đến 3 (cao)")


class RouteSuggestResponse(BaseModel):
    distance_km: float = Field(description="Khoảng cách một chiều ước tính giữa hai địa chỉ, đơn vị km")
    options: List[RouteOption] = Field(description="2 đến 4 phương án di chuyển xanh hơn xe máy, sắp theo mức độ phù hợp giảm dần")


@app.get("/")
def read_root():
    return {"status": "ok"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=request.message,
        )
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e}")


@app.post("/api/route-suggest", response_model=RouteSuggestResponse)
def route_suggest(request: RouteSuggestRequest):
    """Ước tính khoảng cách và gợi ý phương án di chuyển xanh hơn giữa 2 địa chỉ tại Hà Nội.

    Đây là ước tính của Gemini dựa trên kiến thức đã huấn luyện, KHÔNG tra cứu Google Maps
    trực tiếp (tool grounding Maps của Gemini chỉ chạy qua Vertex AI, không hỗ trợ trên
    Gemini Developer API dùng GEMINI_API_KEY). Frontend phải hiển thị rõ đây là ước tính AI.
    """
    prompt = (
        "Bạn là trợ lý ước tính di chuyển đô thị tại Hà Nội, Việt Nam.\n"
        f"Địa chỉ nhà: {request.home_address}\n"
        f"Địa chỉ điểm đến hàng ngày (trường học/công ty): {request.destination_address}\n\n"
        "Hãy ước tính khoảng cách một chiều giữa hai địa chỉ trên (km), và đề xuất 2-4 phương án "
        "di chuyển xanh hơn xe máy cá nhân (đi bộ, xe đạp, và/hoặc xe buýt nếu quãng đường phù hợp). "
        "Nếu quãng đường quá xa để đi bộ/xe đạp thì không đề xuất phương án đó. "
        "Đây chỉ là ước tính tham khảo, không cần chính xác tuyệt đối, nhưng phải hợp lý với vị trí địa lý Hà Nội."
    )
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RouteSuggestResponse,
            ),
        )
        return RouteSuggestResponse.model_validate_json(response.text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e}")
