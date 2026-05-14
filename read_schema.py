import pandas as pd

try:
    df = pd.read_excel("E-commerce Backend Database.xlsx", header=None)
    product_headers = df.iloc[1].tolist()
    print("Product Headers:", product_headers)
    
    # Find where CATEGORIES TAXONOMY starts
    cat_idx = df[df[0] == "CATEGORIES TAXONOMY"].index[0]
    cat_headers = df.iloc[cat_idx + 1].tolist()
    print("Category Headers:", cat_headers)
    
except Exception as e:
    print(f"Error reading excel: {e}")
