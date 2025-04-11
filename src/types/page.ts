
export interface PageSection {
  id: string;
  type: string;
  content: string;
  settings: Record<string, any>;
}

export interface PageData {
  id: string;
  title: string;
  path: string;
  content: PageSection[];
  meta_description?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
