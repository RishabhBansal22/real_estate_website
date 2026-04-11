"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname
    .split('/')
    .filter(Boolean)
    .slice(0, 3); // Limit to 3 levels

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];

  let path = '';
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const label = segment
      .replace(/[-_]/g, ' ')
      .replace(/\d+/g, '') // Remove IDs
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    if (index === segments.length - 1) {
      breadcrumbs.push({ label: label.trim() }); // Last item, no link
    } else {
      breadcrumbs.push({ label: label.trim(), href: path });
    }
  });

  return breadcrumbs;
}

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Don't show breadcrumb on homepage
  if (pathname === '/') return null;

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav className="py-4 mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
      <Link href="/" className="flex items-center gap-2 text-primary-blue hover:text-accent-gold transition-colors">
        <Home size={14} />
        Home
      </Link>

      {breadcrumbs.slice(1).map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <ChevronRight size={14} className="text-slate-300" />
          {item.href ? (
            <Link href={item.href} className="text-primary-blue hover:text-accent-gold transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-600">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
