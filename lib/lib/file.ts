import { AttachmentItem } from '@/components/ui/previews';

export const urlToFile = async (url: string, fileName?: string) => {
  const blob = await fetch(url).then(r => r.blob());
  return new File([blob], fileName || url);
};

export const getImageThumbnail = (file: File) => URL.createObjectURL(file);

const getVideoThumbnail = (file: File) => {
  return new Promise<string>(resolve => {
    const canvas = document.createElement('canvas');
    const video = document.createElement('video');

    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL('image/png'));
    };
  });
};

export const getFileThumbnail = (file: File) => {
  if (file.type.includes('image')) return URL.createObjectURL(file);
  else if (file.type.includes('video')) return getVideoThumbnail(file);
};

export const filesToAttachments = async (files: File[]) => {
  const attachments: AttachmentItem[] = [];
  for (const file of files) {
    attachments.push({
      id: new Date().getTime(),
      file,
      contentType: file.type,
      fileName: file.name,
      url: await getFileThumbnail(file),
    });
  }
  return attachments;
};

export const appendAttachments = (
  payload: Record<string, unknown>,
  attachments?: AttachmentItem[],
) => {
  attachments?.forEach((attachment, i) => {
    if (attachment.file) payload['Image' + i] = attachment.file;
  });
};

export const selectFile = async (
  type?: string,
  onTypeMismatch?: (input: HTMLInputElement) => Promise<void>,
) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.click();
  const event = await new Promise<Event>(resolve => input.addEventListener('change', resolve));
  const file = (<HTMLInputElement>event.target)?.files?.[0];
  if (!file) return null;
  if (type && file.type !== type) {
    input.value = '';
    await onTypeMismatch?.(input);
    return null;
  }
  return file;
};

export const compressImage = async (file: File, { quality = 1, type = file.type } = {}) => {
  const imageBitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(imageBitmap, 0, 0);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));
  if (!blob) return file;
  return new File([blob], file.name, { type: blob.type });
};

export const compressFile = async (file: File, { quality = 1, type = file.type } = {}) => {
  if (quality === 1) return file;
  if (type.includes('image')) return compressImage(file, { quality, type });
  else return file;
};
