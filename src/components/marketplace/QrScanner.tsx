import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw } from "lucide-react";

export function QrScanner({
  onRead,
  matched,
}: {
  onRead: (value: string) => boolean;
  matched: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const read = useRef(onRead);
  read.current = onRead;
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState(
    "Autorisez l’accès à la caméra pour scanner la remise.",
  );
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (matched) return;
    let cancelled = false;
    let stream: MediaStream | undefined;
    let frame = 0;
    let lastScan = 0;
    const stop = () => stream?.getTracks().forEach((track) => track.stop());
    setFailed(false);
    setReady(false);
    const start = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia)
          throw new Error("unsupported");
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
          },
          audio: false,
        });
        if (cancelled) {
          stop();
          return;
        }
        const element = video.current;
        if (!element) {
          stop();
          return;
        }
        element.srcObject = stream;
        await element.play();
        const { default: jsQR } = await import("jsqr");
        if (cancelled) {
          stop();
          return;
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context) throw new Error("canvas");
        setReady(true);
        setStatus("Caméra active. Placez le QR code dans le cadre.");
        const scan = (time: number) => {
          if (cancelled) return;
          if (
            element.readyState >= 2 &&
            element.videoWidth &&
            time - lastScan > 180
          ) {
            lastScan = time;
            const scale = Math.min(1, 720 / element.videoWidth);
            canvas.width = element.videoWidth * scale;
            canvas.height = element.videoHeight * scale;
            context.drawImage(element, 0, 0, canvas.width, canvas.height);
            const pixels = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height,
            );
            const result = jsQR(pixels.data, pixels.width, pixels.height, {
              inversionAttempts: "attemptBoth",
            });
            if (result && read.current(result.data)) {
              stop();
              return;
            }
          }
          frame = requestAnimationFrame(scan);
        };
        frame = requestAnimationFrame(scan);
      } catch (error) {
        stop();
        if (cancelled) return;
        setFailed(true);
        setStatus(
          error instanceof DOMException && error.name === "NotAllowedError"
            ? "Accès caméra refusé. Autorisez la caméra dans votre navigateur, importez un QR code ou utilisez le PIN."
            : "Caméra indisponible. Importez un QR code ou utilisez le PIN de secours.",
        );
      }
    };
    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      stop();
    };
  }, [attempt, matched]);
  return (
    <div className={`handover-scanner ${matched ? "matched" : ""}`}>
      <div className="scanner-viewfinder">
        <video
          ref={video}
          muted
          playsInline
          aria-label="Caméra de scan de la remise"
        />
        {!ready && !matched && (
          <Camera size={40} className="scanner-placeholder" />
        )}
        <div className="scanner-frame">
          {ready && !matched && <span className="scanner-laser" />}
        </div>
        {matched && <div className="scanner-confirmed">QR code reconnu</div>}
      </div>
      <p role="status">
        {matched
          ? "Code vérifié. Vérifiez la photo de l’article avant de valider."
          : status}
      </p>
      {failed && (
        <button
          className="outline-button"
          onClick={() => setAttempt((n) => n + 1)}
        >
          <RefreshCw size={16} /> Réessayer la caméra
        </button>
      )}
    </div>
  );
}
