import QRCode from "qrcode";

export async function generateQrDataUri(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: {
        dark: "#020B5A",
        light: "#FFFFFF",
      },
    });
  } catch (err) {
    console.error("Failed to generate QR Code data URI:", err);
    throw err;
  }
}

export async function generateQrSvg(url: string): Promise<string> {
  try {
    return await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      color: {
        dark: "#020B5A",
        light: "#FFFFFF",
      },
    });
  } catch (err) {
    console.error("Failed to generate QR Code SVG:", err);
    throw err;
  }
}
