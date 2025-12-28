"use client";

import { useUser } from "@/app/customhooks";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Topbar() {
    const [userId, setUserId] = useState<string>("");
    const [imageError, setImageError] = useState(false);
    
    const currentPage = usePathname();
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);
    
    const { user, isLoading } = useUser(userId);
    
    const placeholderImage = "https://family-storage.storage.yandexcloud.net/images/user-placeholder.jpg";
    const imageSrc = (user?.images?.[0] && !imageError) ? user.images[0] : placeholderImage;

    if (isLoading || !userId) {
        return (
            <div className="w-full h-16 flex flex-row items-center justify-between container-padding border-b border-border bg-card">
                <Link href="/tree" className="text-2xl sm:text-3xl font-bold text-primary hover:opacity-80 transition-opacity">WeFamily</Link>
                <div className="flex flex-row items-center gap-3">
                    <div className="h-5 w-24 bg-muted animate-pulse"></div>
                    <div className="size-10 bg-muted animate-pulse border border-border"></div>
                </div>
            </div>
        )
    }
    
    if (!user) {
        return (
            <div className="w-full h-16 flex flex-row items-center justify-between container-padding border-b border-border bg-card sticky top-0 z-50">
                <Link href="/tree" className="text-2xl sm:text-3xl font-bold text-primary hover:opacity-80 transition-opacity">WeFamily</Link>
                <div className="flex flex-row gap-4">
                    <Link href="/tree" className={clsx("hidden sm:block", currentPage === "/tree" && "font-bold border-b-2")}>Древо</Link>
                    <Link href="/memories" className={clsx("hidden sm:block", currentPage === "/memories" && "font-bold border-b-2")}>Воспоминания</Link>
                </div>
                <div className="flex flex-row items-center gap-3 px-3 py-2">
                    <span className="text-sm sm:text-base font-medium text-muted-foreground">Пользователь не найден</span>
                </div>
            </div>
        )
    }
    
    return (
        <div className="w-full h-16 flex flex-row items-center justify-between container-padding border-b border-border bg-card sticky top-0 z-50">
          <Link href="/tree" className="text-2xl sm:text-3xl font-bold text-primary hover:opacity-80 transition-opacity">WeFamily</Link>
          <div className="flex flex-row gap-4">
            <Link href="/tree" className={clsx("hidden sm:block", currentPage === "/tree" && "font-bold border-b-2")}>Древо</Link>
            <Link href="/memories" className={clsx("hidden sm:block", currentPage === "/memories" && "font-bold border-b-2")}>Воспоминания</Link>
          </div>
          <Link 
            href={`/profile/${user.id}`} 
            className="flex flex-row items-center gap-3 px-3 py-2 border border-transparent hover:border-border transition-colors group"
          >
            <span className="text-sm sm:text-base font-medium text-foreground">
              {user.name}
            </span>
            <Image
                src={imageSrc}
                alt={user.name}
                width={200}
                height={200}
                className="size-10 object-cover border-2 border-border"
                onError={() => setImageError(true)}
                unoptimized={imageSrc === placeholderImage}
            />
          </Link>
        </div>
    )
}