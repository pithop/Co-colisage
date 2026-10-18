import { useState } from "react";

export function Avatar({ name, src }: { name: string; src?: string }) {
  const [failedSource, setFailedSource] = useState<string>();
  return (
    <span className="avatar avatar-blue">
      {src && src !== failedSource ? (
        <img
          src={src}
          alt={`Avatar de ${name}`}
          onError={() => setFailedSource(src)}
        />
      ) : (
        name[0]
      )}
    </span>
  );
}
