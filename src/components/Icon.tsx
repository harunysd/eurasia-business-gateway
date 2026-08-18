import {
  Globe,
  Users,
  Handshake,
  UsersRound,
  BarChart3,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Target,
  Eye,
  HardHat,
  Cog,
  Wheat,
  Shirt,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Menu,
  X,
  ChevronDown,
  Settings,
  MailPlus,
  Info,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Pencil,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

// Curated icon map. The admin editor writes icon names as strings into the
// JSON content; this map resolves those names to lucide-react components.
// Keeping an explicit allowlist (instead of importing all of lucide) keeps
// the client bundle small and prevents invalid names from rendering nothing.
const iconMap: Record<string, ComponentType<LucideProps>> = {
  Globe,
  Users,
  Handshake,
  UsersRound,
  BarChart3,
  TrendingUp,
  Award,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Target,
  Eye,
  HardHat,
  Cog,
  Wheat,
  Shirt,
  ShoppingBag,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Menu,
  X,
  ChevronDown,
  Settings,
  MailPlus,
  Info,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Pencil,
};

export const iconNames = Object.keys(iconMap) as IconName[];

export type IconName = keyof typeof iconMap;

export function isValidIconName(name: string): name is IconName {
  return name in iconMap;
}

export function Icon({
  name,
  className,
  ...props
}: { name: string; className?: string } & Omit<LucideProps, 'ref'>) {
  const Cmp = isValidIconName(name) ? iconMap[name] : Globe;
  return <Cmp className={className} {...props} />;
}
