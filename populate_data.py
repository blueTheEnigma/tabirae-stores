import pandas as pd
import os

# Product Headers: ['id', 'name', 'category', 'price', 'variants', 'in_stock', 'image_url', 'description', 'is_featured']

shirts_dir = "Shirts"
scarves_dir = "Scarves"

shirts = [f for f in os.listdir(shirts_dir) if f.endswith('.jpeg')]
scarves = [f for f in os.listdir(scarves_dir) if f.endswith('.jpeg')]

data = []

# Link Mappings
scarf_links = {
    "IMG_8885": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507527/IMG_8885.JPG_fzyvhg.jpg",
    "IMG_8884": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507526/IMG_8884.JPG_ln07so.jpg",
    "IMG_8883": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507524/IMG_8883.JPG_waskmy.jpg",
    "IMG_8882": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507523/IMG_8882.JPG_uoyejy.jpg",
    "IMG_8881": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507520/IMG_8881.JPG_f9azkd.jpg",
    "IMG_8880": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507519/IMG_8880.JPG_kf2uoc.jpg",
    "IMG_8879": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507518/IMG_8879.JPG_usulfz.jpg",
    "IMG_8878": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507516/IMG_8878.JPG_o9xpbu.jpg",
    "IMG_8877": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507514/IMG_8877.JPG_xf2rqd.jpg",
    "IMG_8876": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507513/IMG_8876.JPG_mf6hlu.jpg",
    "IMG_8875": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507512/IMG_8875.JPG_zipm4i.jpg",
    "IMG_8874": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507511/IMG_8874.JPG_jmejos.jpg"
}

shirt_links = {
    "IMG_8902": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507852/IMG_8902.JPG_ptfmfo.jpg",
    "IMG_8872": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507852/IMG_8872.JPG_aelw8g.jpg",
    "IMG_8901": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507851/IMG_8901.JPG_e83ook.jpg",
    "IMG_8871": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507847/IMG_8871.JPG_ukyjud.jpg",
    "IMG_8870": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507845/IMG_8870.JPG_pjg4vc.jpg",
    "IMG_8869": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507844/IMG_8869.JPG_mryugd.jpg",
    "IMG_8868": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507842/IMG_8868.JPG_yi6wdr.jpg",
    "IMG_8867": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507840/IMG_8867.JPG_w8p1id.jpg",
    "IMG_8866": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507839/IMG_8866.JPG_tgwhug.jpg",
    "IMG_8864": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507837/IMG_8864.JPG_vecufu.jpg",
    "IMG_8865": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507836/IMG_8865.JPG_qf4gwi.jpg",
    "IMG_8863": "https://res.cloudinary.com/dfnjf2b5q/image/upload/v1778507834/IMG_8863.JPG_tp01vw.jpg"
}

# Populate Shirts
for i, filename in enumerate(shirts):
    base = filename.split('.')[0]
    data.append({
        'id': f'SHRT-{i+1:03d}',
        'name': f'Vertical Stripe Knit Polo - Variant {i+1}',
        'category': 'Shirts',
        'price': 27000,
        'variants': 'S, M, L, XL',
        'in_stock': True,
        'image_url': shirt_links.get(base, f'placeholder_for_{filename}'),
        'description': 'Modern knit polo shirt with a stylish quarter-zip collar and bold vertical stripe patterns. Crafted for a premium, athletic fit.',
        'is_featured': True if i < 3 else False
    })

# Populate Scarves
for i, filename in enumerate(scarves):
    base = filename.split('.')[0]
    data.append({
        'id': f'SCRF-{i+1:03d}',
        'name': f'Silk-Finish Paisley Scarf - Variant {i+1}',
        'category': 'Scarves',
        'price': 4000,
        'variants': 'One Size',
        'in_stock': True,
        'image_url': scarf_links.get(base, f'placeholder_for_{filename}'),
        'description': 'Exquisite silk-finish scarf featuring a sophisticated paisley design. Perfect for adding a touch of luxury to any outfit.',
        'is_featured': True if i < 3 else False
    })

df_products = pd.DataFrame(data)

# Categories Taxonomy
categories = [
    {'id': 'CAT-01', 'name': 'Shirts', 'slug': 'shirts', 'is_active': True},
    {'id': 'CAT-02', 'name': 'Scarves', 'slug': 'scarves', 'is_active': True}
]
df_categories = pd.DataFrame(categories)

# We'll save them as separate sheets or combined as per the current excel layout if needed,
# but for Google Sheets integration, separate tabs are better.
# For now, I'll just create a clean CSV for products.

df_products.to_csv("populated_products.csv", index=False)
df_categories.to_csv("populated_categories.csv", index=False)

print("Generated populated_products.csv and populated_categories.csv")
