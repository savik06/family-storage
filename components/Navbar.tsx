'use client';

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const currentPage = usePathname();
    return (
        <div className="sm:hidden fixed bottom-4 w-[90vw] max-w-md left-1/2 -translate-x-1/2 grid grid-cols-2 gap-0 bg-card border-2 border-border z-40">
            <Link 
                className={clsx(
                    "w-full text-center py-3 px-4 font-semibold transition-colors border-r border-border",
                    currentPage === "/tree" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-muted"
                )} 
                href="/tree"
            >
                Древо
            </Link>
            <Link 
                className={clsx(
                    "w-full text-center py-3 px-4 font-semibold transition-colors",
                    currentPage === "/memories" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-muted"
                )} 
                href="/memories"
            >
                Воспоминания
            </Link>
        </div>
    )
}   