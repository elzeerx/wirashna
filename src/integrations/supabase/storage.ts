
export const BUCKET_ID = "workshop-media";

export const getRandomFileName = (fileExt: string) =>
  `${crypto.randomUUID()}.${fileExt}`;

export const getStoragePath = (prefix: string, fileName: string) =>
  `${prefix}/${fileName}`;
