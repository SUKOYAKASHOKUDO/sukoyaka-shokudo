// Hero sky at (20, 180) and (1550, 190) in the original 1672px artwork.
export const HEADER_SKY_COLOR = "#cbeef2";
export const HEADER_ARTWORK_SOURCE = "/images/sukoyaka-header-pc-reference.png";

/** Change only the near-white background connected to the inside of the frame.
 * Enclosed whites (logo lettering, rice character and envelope) are untouched.
 */
export function recolorHeaderBackground(image: {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}) {
  const { width, height, data } = image;
  const visited = new Uint8Array(width * height);
  const queue = new Uint32Array(width * height);
  let read = 0;
  let write = 0;

  const insideFrame = (x: number, y: number) => {
    const dx = Math.max(84 - x, 0, x - (width - 84));
    const dy = Math.max(303 - y, 0, y - 402);
    return y >= 227 && y <= 478 && dx * dx + dy * dy <= 76 * 76;
  };

  const enqueue = (pixel: number) => {
    if (pixel < 0 || pixel >= visited.length || visited[pixel]) return;
    visited[pixel] = 1;
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (!insideFrame(x, y)) return;
    const offset = pixel * 4;
    const minimum = Math.min(data[offset], data[offset + 1], data[offset + 2]);
    const maximum = Math.max(data[offset], data[offset + 1], data[offset + 2]);
    if (minimum < 240 || maximum - minimum > 10) return;
    queue[write++] = pixel;
  };

  enqueue(245 * width + 1000);
  while (read < write) {
    const pixel = queue[read++];
    const x = pixel % width;
    if (x > 0) enqueue(pixel - 1);
    if (x < width - 1) enqueue(pixel + 1);
    enqueue(pixel - width);
    enqueue(pixel + width);
  }

  for (let index = 0; index < write; index++) {
    const offset = queue[index] * 4;
    const minimum = Math.min(data[offset], data[offset + 1], data[offset + 2]);
    const amount = Math.min(1, (minimum - 239) / 9);
    [203, 238, 242].forEach((channel, position) => {
      data[offset + position] = Math.round(
        data[offset + position] * (1 - amount) + channel * amount,
      );
    });
  }
  return write;
}

let artworkPromise: Promise<string> | undefined;

// Render locally in canvas; the original image file is never modified.
export function getSkyHeaderArtwork() {
  artworkPromise ??= new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas unavailable");
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        recolorHeaderBackground(pixels);
        context.putImageData(pixels, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    image.onerror = () => reject(new Error("Header artwork unavailable"));
    image.src = HEADER_ARTWORK_SOURCE;
  });
  return artworkPromise;
}
