'use client';

import Image from "next/image";
import { Memory } from "./types";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from 'embla-carousel-react';
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MemoryDetailProps = {
    memory: Memory;
}

export default function MemoryDetail({ memory }: MemoryDetailProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const placeholderImage = "https://family-storage.storage.yandexcloud.net/images/memory-placeholder.jpg";
    
    const images = memory?.images && memory.images.length > 0 
        ? memory.images 
        : [placeholderImage];

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <div className="h-full w-full flex flex-col overflow-y-auto">
            {/* Photo Carousel */}
            <div className="w-full relative h-64 sm:h-80 bg-muted" style={{ aspectRatio: "16/9" }}>
                <div className="w-full h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {images.map((image, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                                <Image
                                    src={image}
                                    alt={memory?.title || `Воспоминание - фото ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
                                    unoptimized={image === placeholderImage}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {images.length > 1 && (
                    <>
                        <button
                            onClick={scrollPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
                            aria-label="Предыдущее фото"
                        >
                            <ChevronLeft className="size-6" />
                        </button>
                        <button
                            onClick={scrollNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full p-2 transition-colors"
                            aria-label="Следующее фото"
                        >
                            <ChevronRight className="size-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="page-container">
                <div className="content-max-width">
                    {/* Title */}
                    {memory?.title && (
                        <div className="mb-6">
                            <h1 className="mb-2">{memory.title}</h1>
                        </div>
                    )}

                    {/* Full Text */}
                    <div className="mb-6">
                        <p className="text-base whitespace-pre-wrap">{memory.text}</p>
                    </div>

                    {/* Author */}
                    <div className="mb-6">
                        <p className="text-label mb-2">Автор</p>
                        <Link 
                            href={`/profile/${memory.creator.id}`}
                            className="text-base hover:text-primary transition-colors"
                        >
                            {`${memory.creator.surname || ""} ${memory.creator.name || ""} ${memory.creator.middlename || ""}`.trim() || "Не указано"}
                        </Link>
                    </div>

                    {/* Relatives - All people */}
                    <div className="mb-6">
                        <p className="text-label mb-2">О ком это воспоминание</p>
                        <div className="flex flex-col gap-2">
                            {memory.relatives && memory.relatives.length > 0 ? (
                                memory.relatives.map((relative) => {
                                    const fullName = `${relative.surname || ""} ${relative.name || ""} ${relative.middlename || ""}`.trim();
                                    return (
                                        <Link
                                            key={relative.id}
                                            href={`/profile/${relative.id}`}
                                            className="text-base hover:text-primary transition-colors p-2 bg-muted/30 rounded-lg"
                                        >
                                            {fullName || "Не указано"}
                                        </Link>
                                    );
                                })
                            ) : (
                                <p className="text-muted-foreground">Не указано</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

