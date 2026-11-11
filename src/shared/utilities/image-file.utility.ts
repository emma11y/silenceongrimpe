export const IMAGE_MAX_SIZE_BYTES = 500 * 1024;

export const IMAGE_ACCEPTED_TYPES: string[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const IMAGE_ACCEPT_ATTRIBUTE = '.jpeg,.jpg,.png,.webp';

export function validateImageFile(file: File): string | undefined {
  if (!IMAGE_ACCEPTED_TYPES.includes(file.type)) {
    return 'Le format de l’image doit être jpeg, jpg, png ou webp.';
  }

  if (file.size > IMAGE_MAX_SIZE_BYTES) {
    return 'L’image ne doit pas dépasser 500 Ko.';
  }

  return undefined;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
