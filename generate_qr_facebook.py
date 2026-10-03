import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("img", exist_ok=True)

fb_url = "https://www.facebook.com/franciscodeasisTco"

FB_BLUE = (24, 119, 242)       # #1877F2 (Official Facebook Blue)
FB_BG_LIGHT = (240, 242, 245)  # #F0F2F5 (Facebook Light UI BG)
GOLD_ACCENT = (212, 160, 23)   # #D4A017 (Franciscan Gold accent)
WHITE = (255, 255, 255)
DARK_TEXT = (28, 30, 33)

def create_facebook_badge(size=140):
    """Creates a high-res crisp Facebook circular badge with white outer ring."""
    scale = 4
    s_size = size * scale
    img = Image.new("RGBA", (s_size, s_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer white quiet-zone circle
    draw.ellipse([0, 0, s_size, s_size], fill=WHITE, outline=FB_BLUE, width=int(12 * scale / 4))
    
    # Inner Facebook Blue circle
    inner_pad = int(14 * scale / 4)
    draw.ellipse([inner_pad, inner_pad, s_size - inner_pad, s_size - inner_pad], fill=FB_BLUE)
    
    # Draw 'f' text in white
    try:
        font_size = int(s_size * 0.72)
        font = ImageFont.truetype("arialbd.ttf", font_size)
    except:
        font = ImageFont.load_default()
        
    draw.text((s_size * 0.54, s_size * 0.45), "f", font=font, fill=WHITE, anchor="mm")
    
    # Resize down with high quality antialiasing
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img

def generate_all_assets():
    qr = qrcode.QRCode(
        version=3,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=3,
    )
    qr.add_data(fb_url)
    qr.make(fit=True)

    # 1. Base QR Code with Facebook Blue modules
    qr_img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(radius_ratio=0.75),
        color_mask=SolidFillColorMask(back_color=WHITE, front_color=FB_BLUE)
    ).convert("RGBA")

    # Add Facebook Icon Badge in Center
    badge_size = int(qr_img.width * 0.26)
    badge = create_facebook_badge(badge_size)
    
    pos = ((qr_img.width - badge_size) // 2, (qr_img.height - badge_size) // 2)
    qr_img.paste(badge, pos, badge)

    # Save standard & HD clean QR code images
    qr_img.save("img/qr_facebook.png")
    qr_img.save("img/qr_facebook_hd.png")
    print("[SUCCESS] Saved img/qr_facebook.png and img/qr_facebook_hd.png")

    # 2. Square Poster for WhatsApp & Instagram (1080x1080)
    poster = Image.new("RGBA", (1080, 1080), WHITE)
    p_draw = ImageDraw.Draw(poster)

    # Header Bar
    p_draw.rectangle([0, 0, 1080, 220], fill=FB_BLUE)
    p_draw.rectangle([0, 212, 1080, 220], fill=GOLD_ACCENT)

    try:
        font_title = ImageFont.truetype("arialbd.ttf", 44)
        font_sub = ImageFont.truetype("arial.ttf", 28)
        font_card_title = ImageFont.truetype("arialbd.ttf", 36)
        font_desc = ImageFont.truetype("arial.ttf", 26)
        font_url = ImageFont.truetype("arialbd.ttf", 30)
    except:
        font_title = font_sub = font_card_title = font_desc = font_url = ImageFont.load_default()

    p_draw.text((540, 70), "Parroquia San Francisco de Asis", font=font_title, fill=WHITE, anchor="mm")
    p_draw.text((540, 138), "Temuco - Chile", font=font_sub, fill=(230, 240, 255), anchor="mm")

    # Content Box
    p_draw.rounded_rectangle([100, 260, 980, 980], radius=28, fill=FB_BG_LIGHT, outline=(218, 224, 233), width=2)
    
    p_draw.text((540, 325), "Siguenos en nuestro Facebook Oficial!", font=font_card_title, fill=FB_BLUE, anchor="mm")
    p_draw.text((540, 375), "Escanea este codigo con la camara de tu celular", font=font_desc, fill=DARK_TEXT, anchor="mm")

    # Embedded scaled QR
    qr_display = qr_img.resize((450, 450), Image.Resampling.LANCZOS)
    p_draw.rounded_rectangle([290, 425, 790, 925], radius=24, fill=WHITE, outline=FB_BLUE, width=4)
    poster.paste(qr_display, (315, 450), qr_display)

    # Footer url badge
    p_draw.rounded_rectangle([180, 935, 900, 995], radius=16, fill=FB_BLUE)
    p_draw.text((540, 965), "facebook.com/franciscodeasisTco", font=font_url, fill=WHITE, anchor="mm")

    poster.convert("RGB").save("img/qr_facebook_whatsapp.png")
    print("[SUCCESS] Saved img/qr_facebook_whatsapp.png")

    # 3. HD Landscape Poster for TV screens & Print Flyers (1920x1080)
    tv = Image.new("RGBA", (1920, 1080), FB_BG_LIGHT)
    t_draw = ImageDraw.Draw(tv)

    t_draw.rectangle([0, 0, 1920, 160], fill=FB_BLUE)
    t_draw.rectangle([0, 152, 1920, 160], fill=GOLD_ACCENT)

    try:
        font_tv_title = ImageFont.truetype("arialbd.ttf", 52)
        font_tv_sub = ImageFont.truetype("arial.ttf", 32)
        font_tv_head = ImageFont.truetype("arialbd.ttf", 40)
        font_tv_bullet = ImageFont.truetype("arial.ttf", 30)
        font_tv_url = ImageFont.truetype("arialbd.ttf", 34)
    except:
        font_tv_title = font_tv_sub = font_tv_head = font_tv_bullet = font_tv_url = ImageFont.load_default()

    t_draw.text((960, 60), "Parroquia San Francisco de Asis - Temuco", font=font_tv_title, fill=WHITE, anchor="mm")
    t_draw.text((960, 120), "Comunidad Franciscana en Conexion", font=font_tv_sub, fill=(230, 240, 255), anchor="mm")

    # Left content box
    t_draw.rounded_rectangle([100, 220, 1080, 980], radius=28, fill=WHITE, outline=(218, 224, 233), width=2)
    t_draw.text((590, 290), "Mantente conectado en Redes Sociales", font=font_tv_head, fill=FB_BLUE, anchor="mm")

    bullets = [
        "   Transmisiones en Vivo de la Santa Misa",
        "   Avisos Parroquiales y Horarios de Eucaristias",
        "   Galerias de Eventos, Campamentos y Festividades",
        "   Reflexiones del Parroco y Noticias Franciscanas"
    ]
    y_pos = 380
    for b in bullets:
        t_draw.text((150, y_pos), b, font=font_tv_bullet, fill=DARK_TEXT)
        y_pos += 85

    # Right QR box
    t_draw.rounded_rectangle([1140, 220, 1820, 980], radius=28, fill=WHITE, outline=FB_BLUE, width=4)
    t_draw.text((1480, 290), " Escanea con tu Celular", font=font_tv_head, fill=FB_BLUE, anchor="mm")

    qr_tv = qr_img.resize((510, 510), Image.Resampling.LANCZOS)
    tv.paste(qr_tv, (1225, 340), qr_tv)

    t_draw.rounded_rectangle([1200, 890, 1760, 960], radius=16, fill=FB_BLUE)
    t_draw.text((1480, 925), "facebook.com/franciscodeasisTco", font=font_tv_url, fill=WHITE, anchor="mm")

    tv.convert("RGB").save("img/qr_facebook_tv.png")
    print("[SUCCESS] Saved img/qr_facebook_tv.png")

if __name__ == "__main__":
    generate_all_assets()
