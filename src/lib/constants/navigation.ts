/**
 * Navigation Constants
 * Centralized navigation configuration for the ancestor worship platform
 */

import {
  Home,
  Users,
  TreePine,
  Flame,
  ScrollText,
  Settings,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

// Navigation item type definition
export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

// Main navigation items for header/navbar
export const mainNavItems: NavItem[] = [
  {
    id: "home",
    label: "首页",
    href: "/",
    icon: Home,
    description: "回到主页",
  },
  {
    id: "families",
    label: "宗族",
    href: "/families",
    icon: Users,
    description: "管理宗族信息",
  },
  {
    id: "ancestors",
    label: "先祖",
    href: "/ancestors",
    icon: TreePine,
    description: "查看先祖谱系",
  },
  {
    id: "worship",
    label: "祭祀",
    href: "/worship",
    icon: Flame,
    description: "进行祭祀仪式",
  },
  {
    id: "eulogy",
    label: "祭文",
    href: "/eulogy",
    icon: ScrollText,
    description: "撰写与阅读祭文",
  },
  {
    id: "settings",
    label: "设置",
    href: "/settings",
    icon: Settings,
    description: "系统设置",
  },
];

// Sidebar navigation items (subset or same as main)
export const sidebarNavItems: NavItem[] = mainNavItems;

// Quick action items for sidebar footer
export const quickActions: NavItem[] = [
  {
    id: "help",
    label: "帮助",
    href: "/help",
    icon: ChevronRight,
  },
];

// App metadata
export const appMetadata = {
  name: "祖祀",
  fullName: "祖祀 - 祖先祭祀平台",
  tagline: "传承千年祭祀文化",
  description: "传统水墨风格的祖先祭祀平台",
  version: "1.0.0",
};

// Export icons for convenience
export { Menu, X, ChevronRight };
