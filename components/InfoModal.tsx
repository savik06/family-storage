'use client';

import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

type InfoModalProps = {
    isOpen: boolean;
    close: () => void;
    children: any;
}

export default function InfoModal({ isOpen, close, children }: InfoModalProps) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Небольшая задержка для запуска анимации появления
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            // Запускаем анимацию исчезновения
            setIsAnimating(false);
            // Удаляем из DOM после завершения анимации
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300); // Длительность анимации
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <>
            <div 
                className={`h-[75vh] sm:h-[80vh] md:h-[85vh] fixed bottom-0 left-0 right-0 overflow-y-scroll scrollbar-hidden w-full z-30 border-t-2 border-border bg-card transition-transform duration-400 ease-out ${
                    isAnimating ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="w-full flex flex-row justify-end p-2">
                    <button 
                        onClick={close}
                        className="p-2 hover:bg-muted transition-colors"
                        aria-label="Закрыть"
                    >
                        <XIcon className="size-8" />
                    </button>
                </div>
                {children}
            </div>
        </>
    )
}