import os
from uuid import uuid4
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CurveCraft API", version="1.0.0")

# CORS: allow all origins for development simplicity. In production, tighten this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Review(BaseModel):
    user: str
    rating: int
    comment: str

class Fabric(BaseModel):
    composition: str
    feel: str
    care: str

class Product(BaseModel):
    id: str
    name: str
    slug: str
    price: float
    sizes: List[str]
    colors: List[str]
    compression: str
    categories: List[str]
    description: str
    fabric: Fabric
    images: dict
    reviews: List[Review] = []

class CartItem(BaseModel):
    id: str
    slug: str
    name: str
    price: float
    qty: int
    size: Optional[str] = None
    color: Optional[str] = None

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    email: Optional[str] = None
    address: Optional[dict] = None
    promoCode: Optional[str] = None

class CheckoutResponse(BaseModel):
    orderId: str
    total: float
    currency: str = "USD"
    message: str


PRODUCTS: List[Product] = []


def _seed_products():
    global PRODUCTS
    if PRODUCTS:
        return PRODUCTS

    def p(
        name: str,
        slug: str,
        price: float,
        sizes: List[str],
        colors: List[str],
        compression: str,
        categories: List[str],
        description: str,
        fabric: Fabric,
        images: dict,
        reviews: List[Review],
    ) -> Product:
        return Product(
            id=str(uuid4()),
            name=name,
            slug=slug,
            price=price,
            sizes=sizes,
            colors=colors,
            compression=compression,
            categories=categories,
            description=description,
            fabric=fabric,
            images=images,
            reviews=reviews,
        )

    common_sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL"]
    nude_palette = ["Sand", "Almond", "Mocha", "Espresso", "Black", "Blush"]

    # Curated external images (Unsplash/Pexels) for demo use
    u1 = "https://images.unsplash.com/photo-1498137718264-3b05ac1d1b2a"
    u2 = "https://images.unsplash.com/photo-1631177066873-5048fbbad9f1"
    u3 = "https://images.unsplash.com/photo-1631177067264-23788a876d9a"
    p4 = "https://images.pexels.com/photos/8783527/pexels-photo-8783527.jpeg"
    p5 = "https://images.pexels.com/photos/8783523/pexels-photo-8783523.jpeg"
    p6 = "https://images.pexels.com/photos/8783485/pexels-photo-8783485.jpeg"
    p7 = "https://images.pexels.com/photos/7065467/pexels-photo-7065467.jpeg"
    p8 = "https://images.pexels.com/photos/4926693/pexels-photo-4926693.jpeg"
    p9 = "https://images.pexels.com/photos/7091854/pexels-photo-7091854.jpeg"
    p10 = "https://images.pexels.com/photos/17207356/pexels-photo-17207356.jpeg"

    PRODUCTS = [
        p(
            name="SculptFit Seamless Bodysuit",
            slug="sculptfit-seamless-bodysuit",
            price=78.0,
            sizes=common_sizes,
            colors=["Sand", "Black", "Mocha"],
            compression="Firm",
            categories=["bodysuits"],
            description="Seamless bodysuit with targeted compression for a smooth silhouette under any outfit.",
            fabric=Fabric(
                composition="78% Nylon, 22% Spandex",
                feel="Buttery-soft with breathable micro-mesh zones",
                care="Machine wash cold, lay flat to dry",
            ),
            images={
                "primary": u2,
                "gallery": [u2, p8, p9],
                "before": u3,
                "after": u2,
            },
            reviews=[
                Review(user="Maya", rating=5, comment="Sculpting without the squeeze. Love it!"),
                Review(user="Alina", rating=4, comment="Great fit, comfy all day."),
            ],
        ),
        p(
            name="Contour High-Waist Shorts",
            slug="contour-high-waist-shorts",
            price=58.0,
            sizes=common_sizes,
            colors=["Sand", "Black", "Mocha", "Blush"],
            compression="Medium",
            categories=["high-waist-shorts", "shorts"],
            description="High-rise shorts with anti-roll waistband and invisible leg finish.",
            fabric=Fabric(
                composition="76% Nylon, 24% Spandex",
                feel="Second-skin comfort with stay-cool knit",
                care="Machine wash cold, lay flat to dry",
            ),
            images={
                "primary": p9,
                "gallery": [p9, p6, p7],
                "before": p6,
                "after": p9,
            },
            reviews=[
                Review(user="Zoe", rating=5, comment="No rolling! Wore to a wedding and forgot I had them on."),
            ],
        ),
        p(
            name="WaistDefine Trainer",
            slug="waistdefine-trainer",
            price=64.0,
            sizes=["XS", "S", "M", "L", "XL"],
            colors=["Black", "Espresso"],
            compression="Firm",
            categories=["waist-trainers"],
            description="Adjustable waist trainer with flexible boning and breathable backing.",
            fabric=Fabric(
                composition="70% Nylon, 30% Spandex",
                feel="Supportive with flexible contouring",
                care="Spot clean",
            ),
            images={
                "primary": p7,
                "gallery": [p7, p9],
                "before": u3,
                "after": p7,
            },
            reviews=[
                Review(user="Gia", rating=4, comment="Great support, easy to adjust."),
            ],
        ),
        p(
            name="SmoothCurve Mid-Thigh Bodysuit",
            slug="smoothcurve-mid-thigh-bodysuit",
            price=84.0,
            sizes=common_sizes,
            colors=["Sand", "Almond", "Black"],
            compression="Medium",
            categories=["bodysuits"],
            description="Mid-thigh bodysuit with open-bust design for bra freedom and lift.",
            fabric=Fabric(
                composition="75% Nylon, 25% Spandex",
                feel="Sleek with airflow channels",
                care="Machine wash cold, lay flat to dry",
            ),
            images={
                "primary": p8,
                "gallery": [p8, u2],
                "before": u3,
                "after": p8,
            },
            reviews=[
                Review(user="Rae", rating=5, comment="Invisible under everything. Confidence booster!"),
            ],
        ),
        p(
            name="AirSculpt Lightweight Shorts",
            slug="airsculpt-lightweight-shorts",
            price=54.0,
            sizes=common_sizes,
            colors=["Blush", "Sand", "Black"],
            compression="Light",
            categories=["high-waist-shorts", "shorts"],
            description="Featherlight everyday shaping with breathable knit.",
            fabric=Fabric(
                composition="80% Nylon, 20% Spandex",
                feel="Ultra-light and smooth",
                care="Machine wash cold, lay flat to dry",
            ),
            images={
                "primary": p6,
                "gallery": [p6, p9],
                "before": p6,
                "after": p9,
            },
            reviews=[
                Review(user="Naya", rating=4, comment="Perfect for daily wear."),
            ],
        ),
        p(
            name="SculptLine Thong Bodysuit",
            slug="sculptline-thong-bodysuit",
            price=72.0,
            sizes=common_sizes,
            colors=["Almond", "Sand", "Black"],
            compression="Medium",
            categories=["bodysuits"],
            description="Thong-back bodysuit with seamless edges for no panty lines.",
            fabric=Fabric(
                composition="78% Nylon, 22% Spandex",
                feel="Soft and supportive",
                care="Machine wash cold, lay flat to dry",
            ),
            images={
                "primary": p4,
                "gallery": [p4, u2],
                "before": u3,
                "after": p4,
            },
            reviews=[
                Review(user="Ivy", rating=5, comment="So flattering and comfy!"),
            ],
        ),
    ]
    return PRODUCTS


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/products")
async def get_products():
    products = _seed_products()
    # Return a lean payload for listings
    listing = [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "price": p.price,
            "sizes": p.sizes,
            "colors": p.colors,
            "compression": p.compression,
            "categories": p.categories,
            "image": p.images.get("primary"),
            "rating": round(sum(r.rating for r in p.reviews) / len(p.reviews), 1) if p.reviews else None,
            "reviewsCount": len(p.reviews),
        }
        for p in products
    ]
    return {"products": listing}


@app.get("/api/products/{slug}")
async def get_product(slug: str):
    products = _seed_products()
    for p in products:
        if p.slug == slug:
            return {"product": p.model_dump()}
    raise HTTPException(status_code=404, detail="Product not found")


@app.post("/api/checkout", response_model=CheckoutResponse)
async def checkout(payload: CheckoutRequest):
    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    subtotal = sum(item.price * item.qty for item in payload.items)
    discount = 0.0
    if payload.promoCode and payload.promoCode.upper() in {"WELCOME10", "CURVECRAFT15"}:
        discount = 0.1 * subtotal if payload.promoCode.upper() == "WELCOME10" else 0.15 * subtotal
    total = max(0.0, round(subtotal - discount, 2))
    order_id = str(uuid4())
    return CheckoutResponse(
        orderId=order_id,
        total=total,
        message="Order received. This is a checkout stub.",
    )