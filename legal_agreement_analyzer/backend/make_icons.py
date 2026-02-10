from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    # Colors
    bg_color = "#0f3460" # Navy Blue
    fg_color = "#ffd700" # Gold

    # Create image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw rounded background
    padding = size // 8
    draw.rounded_rectangle(
        [(padding, padding), (size - padding, size - padding)],
        radius=size // 4,
        fill=bg_color
    )

    # Draw symbol (Simple 'L' or scale representation)
    # Using simple geometric drawing for scale
    center_x = size // 2
    center_y = size // 2
    
    # Scale base (triangle)
    base_w = size // 3
    base_h = size // 6
    draw.polygon([
        (center_x, center_y + size//4),
        (center_x - base_w//2, center_y + size//4 + base_h),
        (center_x + base_w//2, center_y + size//4 + base_h)
    ], fill=fg_color)
    
    # Scale bar
    draw.line(
        [(center_x, center_y - size//4), (center_x, center_y + size//4)],
        fill=fg_color, width=max(1, size//16)
    )
    
    # Beam
    beam_w = size // 2
    draw.line(
        [(center_x - beam_w//2, center_y - size//6), (center_x + beam_w//2, center_y - size//6)],
        fill=fg_color, width=max(1, size//20)
    )
    
    # Plates
    plate_r = size // 8
    draw.ellipse(
        [(center_x - beam_w//2 - plate_r, center_y - size//6 + size//6),
         (center_x - beam_w//2 + plate_r, center_y - size//6 + size//6 + 2*plate_r)],
        outline=fg_color, width=max(1, size//32)
    )
    draw.ellipse(
        [(center_x + beam_w//2 - plate_r, center_y - size//6 + size//6),
         (center_x + beam_w//2 + plate_r, center_y - size//6 + size//6 + 2*plate_r)],
        outline=fg_color, width=max(1, size//32)
    )

    # Add 'L' text over it for clarity? No, the symbol is better.
    
    img.save(f"../extension/{filename}")
    print(f"Created {filename}")

if __name__ == "__main__":
    sizes = [(16, "icon16.png"), (48, "icon48.png"), (128, "icon128.png")]
    for s, f in sizes:
        create_icon(s, f)
