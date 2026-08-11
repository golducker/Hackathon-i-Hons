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


class GreenCommuteRequest(BaseModel):
    merchant: str
    amount_vnd: float


# Lớp 1 — hằng số phát thải, deterministic, KHÔNG do AI sinh ra.
# Nguồn: hệ số phát thải xe máy đo thực địa tại Hà Nội — 0,12g PM2.5 và 6,96g CO2 MỖI LẦN
# KHỞI ĐỘNG XE (per-trip, không phải per-km), nên 1 giao dịch vé xanh hợp lệ = 1 chuyến xe máy
# tránh được = đúng bằng các hằng số này, không nhân thêm với quãng đường.
MOTO_PM25_G_PER_TRIP = 0.12
MOTO_CO2_G_PER_TRIP = 6.96
# Hơn 65% chuyến xe máy tại Việt Nam ngắn hơn ngưỡng này — dùng để gắn nhãn "chuyến ngắn điển hình".
SHORT_TRIP_KM_THRESHOLD = 4.83
# Quy đổi điểm thưởng minh họa cho demo (không phải số liệu khoa học): 10 điểm / gam CO2 tránh phát thải.
POINTS_PER_GRAM_CO2 = 10
# WHO Air Quality Guideline 2021, mức khuyến nghị phơi nhiễm PM2.5 trung bình 24 giờ.
WHO_PM25_24H_GUIDELINE_UG_M3 = 15
# Ước tính phổ biến (Arbor Day Foundation/US EPA): một cây xanh trưởng thành hấp thụ ~21kg CO2/năm.
TREE_CO2_G_PER_HOUR = 21_000 / (365 * 24)


class GreenCommuteAIInference(BaseModel):
    transport_mode: str = Field(description="Phương thức di chuyển suy luận được từ tên merchant, ví dụ 'Xe buýt', 'Metro', 'Xe đạp công cộng'")
    avg_route_distance_km: float = Field(description="Quãng đường di chuyển TRUNG BÌNH của một hành khách điển hình trên tuyến/loại hình này — KHÔNG suy từ số tiền vé của giao dịch này (vé xe buýt VN phần lớn đồng giá, không tính theo km, và không biết điểm lên/xuống cụ thể); ước theo tuyến cụ thể nếu merchant nêu rõ tên tuyến, hoặc mức trung bình điển hình của loại hình đó nếu không rõ; 0 nếu không liên quan đến di chuyển")
    is_plausible_moto_replacement: bool = Field(description="true nếu giao dịch hợp lý là thay thế cho một chuyến xe máy cá nhân, false nếu merchant không liên quan đến di chuyển (vd quán ăn, tạp hóa)")
    explanation: str = Field(description="Giải thích ngắn gọn 1-2 câu bằng tiếng Việt vì sao suy luận như vậy")


class GreenCommuteResponse(BaseModel):
    ai: GreenCommuteAIInference
    pm25_avoided_g: float = Field(description="PM2.5 tránh phát thải, tính từ lớp 1 (0 nếu giao dịch không được công nhận là thay thế xe máy)")
    co2_avoided_g: float = Field(description="CO2 tránh phát thải, tính từ lớp 1")
    points: int = Field(description="Điểm thưởng quy đổi minh họa")
    is_short_trip: bool = Field(description="Quãng đường trung bình của tuyến/loại hình này có nằm trong nhóm chuyến ngắn điển hình (<4,83km) hay không")
    who_air_volume_m3: float = Field(description="Thể tích không khí (m3) mà lượng PM2.5 tránh phát thải đủ để làm ô nhiễm tới đúng ngưỡng khuyến nghị 24h của WHO — chỉ mang tính minh họa trực quan, không phải mô hình phát tán khí thải thực tế")
    tree_hours_equivalent: float = Field(description="Số giờ hấp thụ CO2 tương đương của một cây xanh trưởng thành")


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


@app.post("/api/green-commute", response_model=GreenCommuteResponse)
def green_commute(request: GreenCommuteRequest):
    """Ghi nhận 1 giao dịch (mock, nhập tay) và tính điểm thưởng Green Commute Reward.

    Hai lớp tính toán tách biệt:
    - Lớp 1 (deterministic, không AI): nếu giao dịch được công nhận là thay thế 1 chuyến xe máy,
      PM2.5/CO2 tránh phát thải LUÔN bằng đúng hằng số MOTO_PM25_G_PER_TRIP / MOTO_CO2_G_PER_TRIP
      (hệ số đo thực địa Hà Nội, tính theo mỗi lần khởi động xe — không nhân theo km).
    - Lớp 2 (Gemini): suy luận từ tên merchant + số tiền xem giao dịch có hợp lý là vé xe buýt/metro/
      xe đạp công cộng... (is_plausible_moto_replacement). KHÔNG thể biết hành khách lên/xuống ở điểm
      nào từ một dòng giao dịch, và phần lớn vé xe buýt VN là đồng giá (không tính theo km), nên thay vì
      suy distance từ số tiền, model được yêu cầu ước tính quãng đường di chuyển TRUNG BÌNH của một hành
      khách điển hình trên tuyến/loại hình đó (avg_route_distance_km) — chỉ dùng để hiển thị/gắn nhãn
      "chuyến ngắn điển hình", KHÔNG dùng để nhân vào công thức lớp 1.
    """
    prompt = (
        "Bạn là hệ thống phân tích giao dịch cho ứng dụng thưởng đi lại xanh (Green Commute Reward) "
        "tại các đô thị Việt Nam, dùng để phát hiện khi sinh viên trả tiền vé xe buýt/metro/xe đạp công cộng "
        "thay vì tự lái xe máy cá nhân.\n"
        f"Dòng giao dịch: tên merchant = \"{request.merchant}\", số tiền = {request.amount_vnd:,.0f} VND\n\n"
        "Lưu ý quan trọng: KHÔNG suy luận quãng đường của giao dịch này từ số tiền vé — phần lớn tuyến xe "
        "buýt tại Việt Nam dùng vé đồng giá (flat fare) không tính theo km, và hệ thống không biết hành "
        "khách lên/xuống ở điểm nào.\n"
        "- Nếu merchant rõ ràng là dịch vụ vận tải công cộng hoặc xe điện/xe đạp chia sẻ (xe buýt, metro, "
        "xe đạp công cộng, xe điện chia sẻ...), hãy ước tính QUÃNG ĐƯỜNG DI CHUYỂN TRUNG BÌNH của một hành "
        "khách điển hình trên tuyến/loại hình đó (dựa theo tên tuyến cụ thể nếu merchant có nêu, hoặc mức "
        "trung bình điển hình của loại hình phương tiện đó tại đô thị Việt Nam nếu không nêu rõ tuyến), và "
        "đặt is_plausible_moto_replacement = true.\n"
        "- Nếu merchant KHÔNG liên quan đến di chuyển (quán ăn, tạp hóa, mua sắm, xe ôm công nghệ/taxi cá nhân "
        "không phải phương tiện công cộng...), đặt is_plausible_moto_replacement = false và "
        "avg_route_distance_km = 0.\n"
        "Giải thích ngắn gọn 1-2 câu bằng tiếng Việt vì sao suy luận như vậy."
    )
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=GreenCommuteAIInference,
            ),
        )
        ai = GreenCommuteAIInference.model_validate_json(response.text)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e}")

    if ai.is_plausible_moto_replacement:
        pm25_avoided_g = MOTO_PM25_G_PER_TRIP
        co2_avoided_g = MOTO_CO2_G_PER_TRIP
        points = round(co2_avoided_g * POINTS_PER_GRAM_CO2)
    else:
        pm25_avoided_g = 0.0
        co2_avoided_g = 0.0
        points = 0

    return GreenCommuteResponse(
        ai=ai,
        pm25_avoided_g=pm25_avoided_g,
        co2_avoided_g=co2_avoided_g,
        points=points,
        is_short_trip=ai.avg_route_distance_km <= SHORT_TRIP_KM_THRESHOLD,
        who_air_volume_m3=(pm25_avoided_g * 1000) / WHO_PM25_24H_GUIDELINE_UG_M3,
        tree_hours_equivalent=co2_avoided_g / TREE_CO2_G_PER_HOUR,
    )
