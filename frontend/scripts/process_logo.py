import os
from PIL import Image
import numpy as np
from scipy.ndimage import binary_fill_holes, gaussian_filter

def process_logo():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.abspath(os.path.join(base_dir, ".."))
    input_path = os.path.join(frontend_dir, "src", "components", "Img", "Logo-otica.jpeg")
    
    print(f"Loading input image: {input_path}")
    img = Image.open(input_path).convert("RGB")
    arr = np.array(img, dtype=np.uint8)
    gray = np.array(img.convert("L"), dtype=np.uint8)
    h, w = gray.shape

    # 1. Contorno Superior da Coroa (Spikes e vales para cada coluna x)
    top_contour = np.full(w, 9999)
    for x in range(365, 1235):
        ys = np.where(gray[350:600, x] < 248)[0]
        if len(ys) > 0:
            top_contour[x] = 350 + ys.min()

    # 2. Contorno Inferior da Coroa (Arco de base acima dos oculos)
    bottom_crown = np.zeros(w, dtype=int)
    for x in range(365, 1235):
        ys_stroke = np.where(gray[870:925, x] < 240)[0]
        if len(ys_stroke) > 0:
            bottom_crown[x] = 870 + ys_stroke.max()
        else:
            bottom_crown[x] = 910

    # 3. Contorno Lateral com Inclinacao Exata da Coroa (para cada linha y entre 375 e 915)
    left_contour = np.full(h, 9999)
    right_contour = np.full(h, -1)
    for y in range(375, 915):
        xs = np.where(gray[y, :] < 240)[0]
        if len(xs) > 0:
            left_contour[y] = xs.min()
            right_contour[y] = xs.max()

    # 4. Construcao da Mascara da Coroa (Solida internamente, respeitando a inclinacao lateral)
    crown_mask = np.zeros((h, w), dtype=bool)
    for y in range(375, 915):
        l = left_contour[y]
        r = right_contour[y]
        if l < 9000 and r > 0:
            for x in range(l, r + 1):
                if y >= top_contour[x] and y <= bottom_crown[x]:
                    crown_mask[y, x] = True

    # 5. Mascara dos Oculos de Sol (Preenchimento solido das lentes e retencao dos reflexos brancos)
    glasses_area = (gray < 240) & (np.arange(h)[:, None] >= 930) & (np.arange(h)[:, None] <= 1225)
    glasses_filled = binary_fill_holes(glasses_area)

    # Mascara Solida Combinada
    solid_mask = crown_mask | glasses_filled

    # Suavizacao de bordas (Anti-aliasing sub-pixel)
    mask_float = solid_mask.astype(np.float32)
    mask_blurred = gaussian_filter(mask_float, sigma=0.9)
    alpha = np.clip(mask_blurred * 255.0, 0, 255).astype(np.uint8)

    # Combina RGBA
    rgba = np.dstack([arr, alpha])
    result_img = Image.fromarray(rgba, mode="RGBA")

    # Enquadramento e corte proporcional
    coords = np.argwhere(alpha > 10)
    y_min, x_min = coords.min(axis=0)
    y_max, x_max = coords.max(axis=0)

    emblem_w = x_max - x_min
    emblem_h = y_max - y_min
    size = max(emblem_w, emblem_h)
    pad = int(size * 0.05)  # 5% de margem de respiro
    total_size = size + 2 * pad

    cropped = result_img.crop((x_min, y_min, x_max, y_max))
    square_img = Image.new("RGBA", (total_size, total_size), (0, 0, 0, 0))
    offset_x = (total_size - emblem_w) // 2
    offset_y = (total_size - emblem_h) // 2
    square_img.paste(cropped, (offset_x, offset_y))

    # Diretorios de destino
    public_dir = os.path.join(frontend_dir, "public")
    app_dir = os.path.join(frontend_dir, "src", "app")
    img_dir = os.path.join(frontend_dir, "src", "components", "Img")
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(os.path.join(public_dir, "images"), exist_ok=True)
    os.makedirs(img_dir, exist_ok=True)

    # Salva Logo PNG Master com inclinacao perfeita
    logo_1024 = square_img.resize((1024, 1024), Image.Resampling.LANCZOS)
    logo_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
    logo_256 = square_img.resize((256, 256), Image.Resampling.LANCZOS)

    logo_1024.save(os.path.join(public_dir, "logo.png"), "PNG", optimize=True)
    logo_512.save(os.path.join(public_dir, "images", "logo.png"), "PNG", optimize=True)
    logo_512.save(os.path.join(img_dir, "logo.png"), "PNG", optimize=True)
    logo_256.save(os.path.join(img_dir, "logo-256.png"), "PNG", optimize=True)
    print("[OK] logo.png gerado em public/ e src/components/Img/")

    # Salva Favicons para o App Router do Next.js
    icon_192 = square_img.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(app_dir, "icon.png"), "PNG")
    print("[OK] icon.png (192x192) gerado em src/app/icon.png")

    icon_180 = square_img.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save(os.path.join(app_dir, "apple-icon.png"), "PNG")
    print("[OK] apple-icon.png (180x180) gerado em src/app/apple-icon.png")

    # Salva favicon.ico multi-resolucao
    favicon_sizes = [(16, 16), (32, 32), (48, 48)]
    square_img.save(
        os.path.join(public_dir, "favicon.ico"),
        format="ICO",
        sizes=favicon_sizes
    )
    square_img.save(
        os.path.join(app_dir, "favicon.ico"),
        format="ICO",
        sizes=favicon_sizes
    )
    print("[OK] favicon.ico multi-resolucao (16, 32, 48px) gerado em public/ e src/app/")

    print("Processamento concluido com sucesso!")

if __name__ == "__main__":
    process_logo()
