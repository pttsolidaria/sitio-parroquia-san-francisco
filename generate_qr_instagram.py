import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask
from PIL import Image, ImageDraw, ImageFont
import os

os.makedirs("img", exist_ok=True)

insta_url = "https://www.instagram.com/franciscodeasistco/"

# Instagram color palette constants
INSTA_PINK = (225, 48, 108)     # #E1306C (Instagram Pink/Magenta)
INSTA_PURPLE = (131, 58, 180)   # #833AB4 (Instagram Deep Purple)
INSTA_ORANGE = (245, 96, 64)    # #F56040 (Instagram Sunset Orange)
INSTA_YELLOW = (252, 175, 69)   # #FCAF45 (Instagram Yellow Accent)
INSTA_BG_LIGHT = (250, 246, 252) # Soft subtle background
GOLD_ACCENT = (212, 160, 23)     # Franciscan Gold Accent
WHITE = (255, 255, 255)
DARK_TEXT = (38, 38, 38)

def draw_instagram_gradient_bar(draw, rect, colors):
    """Draws a multi-stop smooth linear gradient bar."""
    x0, y0, x1, y1 = rect
    width = x1 - x0
    height = y1 - y0
    
    num_stops = len(colors) - 1
    for x in range(width):
        t = x / float(width)
        stop_idx = int(t * num_stops)
        if stop_idx >= num_stops:
            stop_idx = num_stops - 1
        local_t = (t * num_stops) - stop_idx
        
        c1 = colors[stop_idx]
        c2 = colors[stop_idx + 1]
        
        r = int(c1[0] + (c2[0] - c1[0]) * local_t)
        g = int(c1[1] + (c2[1] - c1[1]) * local_t)
        b = int(c1[2] + (c2[2] - c1[2]) * local_t)
        
        draw.line([(x0 + x, y0), (x0 + x, y1)], fill=(r, g, b))

def create_instagram_badge(size=140):
    """Creates a high-res antialiased Instagram camera badge."""
    scale = 4
    s_size = size * scale
    img = Image.new("RGBA", (s_size, s_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer white quiet-zone circle
    draw.ellipse([0, 0, s_size, s_size], fill=WHITE, outline=INSTA_PINK, width=int(12 * scale / 4))
    
    # Inner Instagram Pink circle
    inner_pad = int(14 * scale / 4)
    draw.ellipse([inner_pad, inner_pad, s_size - inner_pad, s_size - inner_pad], fill=INSTA_PINK)
    
    # Draw Instagram Camera icon inside
    cam_pad = int(s_size * 0.28)
    cam_rect = [cam_pad, cam_pad, s_size - cam_pad, s_size - cam_pad]
    draw.rounded_rectangle(cam_rect, radius=int(s_size * 0.12), fill=None, outline=WHITE, width=int(12 * scale / 4))
    
    lens_pad = int(s_size * 0.38)
    draw.ellipse([lens_pad, lens_pad, s_size - lens_pad, s_size - lens_pad], fill=None, outline=WHITE, width=int(12 * scale / 4))
    
    dot_x = int(s_size * 0.65)
    dot_y = int(s_size * 0.35)
    dot_r = int(s_size * 0.032)
    draw.ellipse([dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r], fill=WHITE)
    
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img

def generate_all_instagram_assets():
    qr = qrcode.QRCode(
        version=3,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=16,
        border=3,
    )
    qr.add_data(insta_url)
    qr.make(fit=True)

    # 1. Instagram Radial Gradient Styled QR Code
    qr_img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(radius_ratio=0.8),
        color_mask=RadialGradiantColorMask(
            back_color=WHITE,
            center_color=INSTA_PINK,   # #E1306C (Pink center)
            edge_color=INSTA_PURPLE    # #833AB4 (Purple edges)
        )
    ).convert("RGBA")

    # Add Instagram Badge in Center
    badge_size = int(qr_img.width * 0.26)
    badge = create_instagram_badge(badge_size)
    
    pos = ((qr_img.width - badge_size) // 2, (qr_img.height - badge_size) // 2)
    qr_img.paste(badge, pos, badge)

    # Save standard & HD clean QR code images
    qr_img.save("img/qr_instagram.png")
    qr_img.save("img/qr_instagram_hd.png")
    print("[SUCCESS] Saved img/qr_instagram.png and img/qr_instagram_hd.png")

    # 2. Square Poster for WhatsApp & Instagram Stories/Posts (1080x1080)
    poster = Image.new("RGBA", (1080, 1080), WHITE)
    p_draw = ImageDraw.Draw(poster)

    # Top Header Bar with Instagram Gradient
    gradient_colors = [INSTA_YELLOW, INSTA_ORANGE, INSTA_PINK, INSTA_PURPLE]
    draw_instagram_gradient_bar(p_draw, [0, 0, 1080, 220], gradient_colors)
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
    p_draw.text((540, 138), "Temuco - Chile", font=font_sub, fill=(255, 240, 245), anchor="mm")

    # Content Box
    p_draw.rounded_rectangle([100, 260, 980, 980], radius=28, fill=INSTA_BG_LIGHT, outline=(235, 220, 240), width=2)
    
    p_draw.text((540, 325), "Siguenos en nuestro Instagram Oficial!", font=font_card_title, fill=INSTA_PINK, anchor="mm")
    p_draw.text((540, 375), "Escanea este codigo con la camara de tu celular", font=font_desc, fill=DARK_TEXT, anchor="mm")

    # Embedded scaled QR
    qr_display = qr_img.resize((450, 450), Image.Resampling.LANCZOS)
    p_draw.rounded_rectangle([290, 425, 790, 925], radius=24, fill=WHITE, outline=INSTA_PINK, width=4)
    poster.paste(qr_display, (315, 450), qr_display)

    # Footer url badge with Instagram Gradient
    draw_instagram_gradient_bar(p_draw, [180, 935, 900, 995], gradient_colors)
    p_draw.text((540, 965), "@franciscodeasistco", font=font_url, fill=WHITE, anchor="mm")

    poster.convert("RGB").save("img/qr_instagram_whatsapp.png")
    print("[SUCCESS] Saved img/qr_instagram_whatsapp.png")

    # 3. HD Landscape Poster for TV screens & Print Flyers (1920x1080)
    tv = Image.new("RGBA", (1920, 1080), INSTA_BG_LIGHT)
    t_draw = ImageDraw.Draw(tv)

    draw_instagram_gradient_bar(t_draw, [0, 0, 1920, 160], gradient_colors)
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
    t_draw.text((960, 120), "Nuestra Comunidad en Imagenes y Historias", font=font_tv_sub, fill=(255, 240, 245), anchor="mm")

    # Left content box
    t_draw.rounded_rectangle([100, 220, 1080, 980], radius=28, fill=WHITE, outline=(235, 220, 240), width=2)
    t_draw.text((590, 290), "Descubre la Vida Parroquial en Instagram", font=font_tv_head, fill=INSTA_PINK, anchor="mm")

    bullets = [
        "   Fotos de Eucaristias, Campamentos y Eventos",
        "   Historias diarias y avisos de actividades",
        "   Pastoral Juvenil, Grupo Scout y Cafe Fraterno",
        "   Momentos de oracion y espiritualidad franciscana"
    ]
    y_pos = 380
    for b in bullets:
        t_draw.text((150, y_pos), b, font=font_tv_bullet, fill=DARK_TEXT)
        y_pos += 85

    # Right QR box
    t_draw.rounded_rectangle([1140, 220, 1820, 980], radius=28, fill=WHITE, outline=INSTA_PINK, width=4)
    t_draw.text((1480, 290), " Escanea con tu Celular", font=font_tv_head, fill=INSTA_PINK, anchor="mm")

    qr_tv = qr_img.resize((510, 510), Image.Resampling.LANCZOS)
    tv.paste(qr_tv, (1225, 340), qr_tv)

    draw_instagram_gradient_bar(t_draw, [1160, 890, 1800, 960], gradient_colors)
    t_draw.text((1480, 925), "instagram.com/franciscodeasistco", font=font_tv_bullet, fill=WHITE, anchor="mm")

    tv.convert("RGB").save("img/qr_instagram_tv.png")
    print("[SUCCESS] Saved img/qr_instagram_tv.png")

if __name__ == "__main__":
    generate_all_instagram_assets()
