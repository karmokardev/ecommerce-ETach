export interface Post {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  type: 'news' | 'blog' | 'event';
  status: 'active' | 'inactive';
  created_at: string;
}