import type { PostMetadata } from "$lib/types";

export const getFullTitle = (metadata: Pick<PostMetadata, "icon" | "title">) =>
  `${metadata.icon ?? ""} ${metadata.title}`.trim();
