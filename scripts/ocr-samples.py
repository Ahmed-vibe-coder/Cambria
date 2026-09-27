import os
import pytesseract
from PIL import Image

files = [
    "design-references/certificates/cert-landscape-geometric-filled-sample.png",
    "design-references/certificates/cert-portrait-elegant-gold-filled-sample.png",
    "design-references/id-card/id-card-cr80-filled-sample.png"
]

for f in files:
    if os.path.exists(f):
        print(f"\n=======================================================")
        print(f"FILE: {f}")
        print(f"=======================================================")
        try:
            img = Image.open(f)
            data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
            n_boxes = len(data['level'])
            print(f"Dimensions: {img.size}")
            
            # Print full text
            full_text = pytesseract.image_to_string(img)
            print("\n--- OCR TEXT ---")
            print(full_text.strip())
            print("----------------\n")
            
            # Print significant text lines with bounding boxes
            lines = {}
            for i in range(n_boxes):
                text = data['text'][i].strip()
                if text:
                    top = data['top'][i]
                    # bucket by ~15 pixels
                    line_key = round(top / 15) * 15
                    if line_key not in lines:
                        lines[line_key] = []
                    lines[line_key].append({
                        'text': text,
                        'left': data['left'][i],
                        'top': data['top'][i],
                        'width': data['width'][i],
                        'height': data['height'][i]
                    })
            
            print("--- POSITIONED LINES ---")
            for k in sorted(lines.keys()):
                words = lines[k]
                line_text = " ".join([w['text'] for w in words])
                min_l = min([w['left'] for w in words])
                max_r = max([w['left'] + w['width'] for w in words])
                avg_t = min([w['top'] for w in words])
                max_h = max([w['height'] for w in words])
                print(f"y={avg_t:4d}, x={min_l:4d}, w={max_r-min_l:4d}, h={max_h:2d} | {line_text}")
        except Exception as e:
            print(f"Error on {f}: {e}")
