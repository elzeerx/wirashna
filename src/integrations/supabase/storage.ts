
export const BUCKETS = {
  WORKSHOP_IMAGES: "workshop-images",
  INSTRUCTOR_IMAGES: "instructor-images",
  WORKSHOP_COVERS: "workshop-covers",
} as const;

export const getRandomFileName = (fileExt: string) =>
  `${crypto.randomUUID()}.${fileExt}`;

export const getStoragePath = (prefix: string, fileName: string) =>
  `${prefix}/${fileName}`;
