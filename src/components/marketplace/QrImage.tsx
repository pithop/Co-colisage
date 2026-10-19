import { useEffect, useState } from "react";
import QRCode from "qrcode";
export function QrImage({ value }: { value: string }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    let current = true;
    QRCode.toDataURL(value, { width: 360, margin: 2 }).then((url) => {
      if (current) setSrc(url);
    });
    return () => {
      current = false;
    };
  }, [value]);
  return src ? (
    <img
      className="qr-image"
      src={src}
      alt="QR code de validation de la remise"
    />
  ) : (
    <span>Création du QR code…</span>
  );
}
