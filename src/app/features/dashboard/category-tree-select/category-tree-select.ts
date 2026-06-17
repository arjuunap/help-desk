// category-tree-select.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryDto, CategoryNode } from '../../../core/models/ticket';

@Component({
  selector: 'app-category-tree-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './category-tree-select.html',
  styleUrls: ['./category-tree-select.css']
})
export class CategoryTreeSelectComponent implements OnInit, OnChanges {
  @Input() categories: CategoryDto[] = [];
  @Input() loading = false;
  @Input() disabled = false;
  @Input() selectedId: number | null = null;
  @Input() invalid = false;

  @Output() selectionChange = new EventEmitter<CategoryNode | null>();

  isOpen = false;
  searchTerm = '';
  treeRoots: CategoryNode[] = [];
  visibleNodes: CategoryNode[] = [];
  selectedNode: CategoryNode | null = null;
  private nodeMap = new Map<number, CategoryNode>();

  constructor(private elRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buildTree();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories']) {
      this.buildTree();
    }
    if (changes['selectedId'] && !changes['selectedId'].firstChange) {
      this.selectedNode = this.selectedId != null ? this.nodeMap.get(this.selectedId) ?? null : null;
    }
  }

  private resolveParentId(c: CategoryDto): number | null {
    // Backend has been observed sending the parent link under different
    // names across endpoints. Check each in order; treat 0/undefined/null
    // consistently as "no parent" (root node).
    if (c.parentId !== undefined && c.parentId !== null) return c.parentId;
    if (c.parentCategoryId !== undefined && c.parentCategoryId !== null) return c.parentCategoryId;
    if (c.parent && c.parent.categoryId !== undefined && c.parent.categoryId !== null) return c.parent.categoryId;
    return null;
  }

  private buildTree(): void {
    this.nodeMap.clear();
    const nodesById = new Map<number, CategoryNode>();

    if (!this.categories || this.categories.length === 0) {
      this.treeRoots = [];
      this.refreshVisibleNodes();
      return;
    }

    this.categories.forEach(c => {
      if (c.categoryId === undefined || c.categoryId === null) {
        console.warn('[CategoryTreeSelect] category missing categoryId, skipping:', c);
        return;
      }
      nodesById.set(c.categoryId, {
        categoryId: c.categoryId,
        name: c.name,
        description: c.description,
        parentId: this.resolveParentId(c),
        children: [],
        expanded: false,
        depth: 0
      });
    });

    const roots: CategoryNode[] = [];

    nodesById.forEach(node => {
      this.nodeMap.set(node.categoryId, node);
      if (node.parentId === null || node.parentId === undefined) {
        roots.push(node);
      } else {
        const parent = nodesById.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // orphaned node (parent not found in this response) - treat as root
          // so it's still visible/selectable rather than silently dropped
          roots.push(node);
        }
      }
    });

    const assignDepth = (nodes: CategoryNode[], depth: number) => {
      nodes.forEach(n => {
        n.depth = depth;
        if (n.children.length) {
          assignDepth(n.children, depth + 1);
        }
      });
    };
    assignDepth(roots, 0);

    this.treeRoots = roots;

    if (this.selectedId != null) {
      this.selectedNode = this.nodeMap.get(this.selectedId) ?? null;
      this.expandAncestors(this.selectedNode);
    }

    this.refreshVisibleNodes();
  }

  private expandAncestors(node: CategoryNode | null): void {
    if (!node) return;
    let current: CategoryNode | undefined = node.parentId != null ? this.nodeMap.get(node.parentId) : undefined;
    while (current) {
      current.expanded = true;
      current = current.parentId != null ? this.nodeMap.get(current.parentId) : undefined;
    }
  }

  private refreshVisibleNodes(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (term) {
      // Search mode: flatten all matching nodes + their ancestor chain, ignore expand/collapse state
      const matches: CategoryNode[] = [];
      const matchIds = new Set<number>();

      const collectMatches = (nodes: CategoryNode[]) => {
        nodes.forEach(n => {
          const isMatch = n.name.toLowerCase().includes(term);
          if (isMatch) {
            matchIds.add(n.categoryId);
          }
          if (n.children.length) collectMatches(n.children);
        });
      };
      collectMatches(this.treeRoots);

      // include ancestors of matches so hierarchy context is visible
      const withAncestors = new Set<number>();
      matchIds.forEach(id => {
        let node: CategoryNode | undefined = this.nodeMap.get(id);
        while (node) {
          withAncestors.add(node.categoryId);
          node = node.parentId != null ? this.nodeMap.get(node.parentId) : undefined;
        }
      });

      const buildFlat = (nodes: CategoryNode[]) => {
        nodes.forEach(n => {
          if (withAncestors.has(n.categoryId)) {
            matches.push(n);
            if (n.children.length) buildFlat(n.children);
          }
        });
      };
      buildFlat(this.treeRoots);
      this.visibleNodes = matches;
      return;
    }

    // Normal mode: respect expanded/collapsed state
    const flat: CategoryNode[] = [];
    const walk = (nodes: CategoryNode[]) => {
      nodes.forEach(n => {
        flat.push(n);
        if (n.expanded && n.children.length) {
          walk(n.children);
        }
      });
    };
    walk(this.treeRoots);
    this.visibleNodes = flat;
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchTerm = '';
      this.refreshVisibleNodes();
    }
  }

  closeDropdown(): void {
    this.isOpen = false;
    this.searchTerm = '';
    this.refreshVisibleNodes();
  }

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.refreshVisibleNodes();
  }

  toggleExpand(node: CategoryNode, event: Event): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
    this.refreshVisibleNodes();
  }

  selectNode(node: CategoryNode): void {
    if (node.children.length > 0) {
      // Parent nodes are not directly selectable as the final value;
      // clicking expands/collapses instead so the user drills to a leaf.
      node.expanded = !node.expanded;
      this.refreshVisibleNodes();
      return;
    }
    this.selectedNode = node;
    this.isOpen = false;
    this.searchTerm = '';
    this.refreshVisibleNodes();
    this.selectionChange.emit(node);
  }

  clearSelection(event: Event): void {
    event.stopPropagation();
    this.selectedNode = null;
    this.selectionChange.emit(null);
  }

  getBreadcrumb(node: CategoryNode): string {
    const parts: string[] = [node.name];
    let current = node.parentId != null ? this.nodeMap.get(node.parentId) : undefined;
    while (current) {
      parts.unshift(current.name);
      current = current.parentId != null ? this.nodeMap.get(current.parentId) : undefined;
    }
    return parts.join(' / ');
  }

  isLeaf(node: CategoryNode): boolean {
    return node.children.length === 0;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
      this.cdr.markForCheck();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.closeDropdown();
    }
  }
}