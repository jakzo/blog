export interface Post {
  slug: string;
  metadata: PostMetadata;
  content: string;
}

export interface PostMetadata {
  icon?: string;
  title: string;
  date: string;
  excerpt: string;
}
