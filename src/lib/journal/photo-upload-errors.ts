export type PhotoValidationErrorKey = "tooMany" | "tooLarge" | "invalidType";

export type PhotoUploadErrorKey =
  | PhotoValidationErrorKey
  | "storageNotConfigured"
  | "tableNotConfigured"
  | "uploadFailed";
