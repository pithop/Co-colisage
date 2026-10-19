export interface Attachment {
  id: string;
  name: string;
  type: string;
  data: string;
}
export async function readAttachment(
  file: File,
  document = false,
): Promise<Attachment> {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    ...(document ? ["application/pdf"] : []),
  ];
  if (!allowed.includes(file.type))
    throw new Error(
      "Format accepté : JPEG, PNG, WebP" + (document ? " ou PDF." : "."),
    );
  if (!file.size || file.size > 4 * 1024 * 1024)
    throw new Error("Chaque fichier doit contenir entre 1 octet et 4 Mo.");
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
  return { id: crypto.randomUUID(), name: file.name, type: file.type, data };
}
export function localActorId(): string {
  let id = localStorage.getItem("bagvoyage-actor");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("bagvoyage-actor", id);
  }
  return id;
}
