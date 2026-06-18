// ticket.models.ts

export interface Department {
  departmentId: number;
  name: string;
}

export interface SlaPolicy {
  slaPolicyId: number;
  name: string;
  responseTime?: string; // e.g. "4h", "24h" - optional display hint
}

// export interface CategoryDto {
//   categoryId: number;
//   name: string;
//   description?: string;
//   isActive?: boolean;
//   // Backend may send the parent link under any of these names depending on
//   // the endpoint/version. The tree builder checks all of them defensively.
//   parentId?: number | null;
//   parentCategoryId?: number | null;
//   parent?: { categoryId: number } | null;
// }

// Tree node used internally by the category tree-select
export interface CategoryNode {
  categoryId: number;
  name: string;
  description?: string;
  parentId: number | null;
  children: CategoryNode[];
  expanded: boolean;
  depth: number;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type Channel = 'WEB' | 'MOBILE' | 'EMAIL' | 'PHONE' | 'WALK_IN';

export interface TicketSubmitPayload {
  subject: string;
  description: string;
  priority: Priority;
  channel: Channel;
  departmentId: number;
  slaPolicyId: number;
  categoryId: number;
}