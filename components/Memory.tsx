import { User, Memory } from "./types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type MemoriesInfoProps = {
    users: User[];
    allMemories: Memory[];
}

export function MemoriesInfo({ users, allMemories }: MemoriesInfoProps) {
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const placeholderImage = "https://family-storage.storage.yandexcloud.net/images/memory-placeholder.jpg";
    
    // Фильтруем воспоминания: оставляем только те, где в relatives есть все пользователи из users
    const filteredMemories = allMemories?.filter((memory: Memory) => {
        return users.every((user: User) => 
            memory.relatives.some((relative: User) => relative.id === user.id)
        );
    }) || [];
    console.log(users, allMemories, filteredMemories);

    const userIds = users.map(user => user.id);
    
    const handleImageError = (memoryId: string) => {
        setImageErrors(prev => new Set(prev).add(memoryId));
    };

    return (
        <div className="h-full w-full flex flex-col p-4 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Воспоминания</h2>
            <div className="flex flex-wrap gap-3 mb-4">
                <p className="font-semibold underline">С кем:</p>
                {users.map((user: User, idx: number) => (
                    <p key={user.id}>{user.name}{idx < users.length - 1 ? ", " : ""}</p>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                {filteredMemories.map((memory: Memory) => {
                    const imageSrc = (memory?.images?.[0] && !imageErrors.has(memory.id)) 
                        ? memory.images[0] 
                        : placeholderImage;
                    return (
                    <div key={memory.id} className="flex flex-col gap-2 border border-black p-4">
                        <Image
                            src={imageSrc}
                            width={600}
                            height={600}
                            alt={memory?.title || 'Memory image'}
                            className="h-40 object-contain"
                            onError={() => handleImageError(memory.id)}
                            unoptimized={imageSrc === placeholderImage}
                        />
                        <p className="h-6 text-lg font-semibold">{memory?.title}</p>
                        <p className="line-clamp-2">{memory.text}</p>
                        <div className="flex flex-wrap justify-between">
                            <Link href={`/profile/${memory.creator.id}`}>
                                <span className="underline font-semibold">Автор:</span> {memory.creator.name}
                            </Link>
                            <p>
                                <span className="underline font-semibold">О ком:</span>{" "}
                                {memory.relatives[0].name}
                                {memory.relatives.length > 1 
                                    ? ` и еще ${memory.relatives.length - 1}` 
                                    : ""}
                            </p>
                        </div>
                    </div>
                    );
                })}
                {filteredMemories.length === 0 && (
                    <p className="text-gray-500">Воспоминания не найдены</p>
                )}
            </div>
        </div>
    )
}
