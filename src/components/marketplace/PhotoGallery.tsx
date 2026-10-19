import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { readAttachment, type Attachment } from "../../services/uploads";
export function PhotoGallery({
  photos,
  onChange,
  label = "Photos du colis",
  limit = 6,
}: {
  photos: Attachment[];
  onChange: (photos: Attachment[]) => void;
  label?: string;
  limit?: number;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <fieldset className="photo-gallery" aria-busy={busy}>
      <legend>{label}</legend>
      <div className="photo-grid">
        {photos.map((photo) => (
          <figure key={photo.id}>
            <img src={photo.data} alt={photo.name} />
            <button
              type="button"
              disabled={busy}
              aria-label={`Supprimer ${photo.name}`}
              onClick={() =>
                onChange(photos.filter((item) => item.id !== photo.id))
              }
            >
              <X size={16} />
            </button>
            <figcaption>{photo.name}</figcaption>
          </figure>
        ))}
        {photos.length < limit && (
          <label className="photo-add">
            <ImagePlus size={28} />
            <span>{busy ? "Lecture…" : "Ajouter des photos"}</span>
            <input
              aria-label={label}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={limit > 1}
              disabled={busy}
              onChange={async (event) => {
                const files = Array.from(event.target.files || []);
                event.target.value = "";
                setError("");
                if (photos.length + files.length > limit) {
                  setError(`${limit} photos maximum.`);
                  return;
                }
                setBusy(true);
                try {
                  onChange([
                    ...photos,
                    ...(await Promise.all(
                      files.map((file) => readAttachment(file)),
                    )),
                  ]);
                } catch (cause) {
                  setError(
                    cause instanceof Error
                      ? cause.message
                      : "Lecture impossible.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
        )}
      </div>
      <small>JPEG, PNG ou WebP. 4 Mo par photo, {limit} maximum.</small>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}
