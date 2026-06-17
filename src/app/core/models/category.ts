export interface Category {
  id: number;
  name: string;
  description: string;
  parentId: number | null;
  role : string;
}

export interface CategoryRequest {
  name: string;
  description: string;
}