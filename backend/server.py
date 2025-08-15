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
                "primary": "/images/bodysuit1.jpg",
                "gallery": [
                    "/images/bodysuit1.jpg",
                    "/images/bodysuit1_alt1.jpg",
                    "/images/bodysuit1_alt2.jpg",
                ],
                "before": "/images/bodysuit_before.jpg",
                "after": "/images/bodysuit_after.jpg",
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
                "primary": "/images/shorts1.jpg",
                "gallery": [
                    "/images/shorts1.jpg",
                    "/images/shorts1_alt1.jpg",
                ],
                "before": "/images/shorts_before.jpg",
                "after": "/images/shorts_after.jpg",
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
                "primary": "/images/waist1.jpg",
                "gallery": [
                    "/images/waist1.jpg",
                    "/images/waist1_alt1.jpg",
                ],
                "before": "/images/waist_before.jpg",
                "after": "/images/waist_after.jpg",
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
                "primary": "/images/bodysuit2.jpg",
                "gallery": [
                    "/images/bodysuit2.jpg",
                    "/images/bodysuit2_alt1.jpg",
                ],
                "before": "/images/bodysuit2_before.jpg",
                "after": "/images/bodysuit2_after.jpg",
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
                "primary": "/images/shorts2.jpg",
                "gallery": [
                    "/images/shorts2.jpg",
                    "/images/shorts2_alt1.jpg",
                ],
                "before": "/images/shorts2_before.jpg",
                "after": "/images/shorts2_after.jpg",
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
                "primary": "/images/bodysuit3.jpg",
                "gallery": [
                    "/images/bodysuit3.jpg",
                    "/images/bodysuit3_alt1.jpg",
                ],
                "before": "/images/bodysuit3_before.jpg",
                "after": "/images/bodysuit3_after.jpg",
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