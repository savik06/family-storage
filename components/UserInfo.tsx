'use client';

import { useUser } from "@/app/customhooks";
import Image from "next/image";
import { Memory, User } from "./types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

type EditableKey = "hobbies" | "specializations" | "achievements";

interface EditableListProps {
    title: string;
    items?: string[];
    userId: string;
    fieldKey: EditableKey;
    mutate: () => Promise<any> | void;
    inputPlaceholder: string;
    successMessage: string;
}

function EditableList({
    title,
    items = [],
    userId,
    fieldKey,
    mutate,
    inputPlaceholder,
    successMessage,
}: EditableListProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedItems, setEditedItems] = useState<string[]>(items);
    const [newItem, setNewItem] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    // Синхронизация при входе/выходе из режима редактирования и при изменении исходных данных
    useEffect(() => {
        if (isEditing) {
            setEditedItems(items ?? []);
        } else {
            setEditedItems(items ?? []);
            setIsAdding(false);
            setNewItem("");
        }
    }, [isEditing, items]);

    const handleSave = async () => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
        try {
            const response = await fetch(`${backendUrl}/user/updateData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, [fieldKey]: editedItems }),
            });

            if (!response.ok) {
                toast.error("Ошибка при сохранении данных");
                return;
            }

            await mutate();
            setIsEditing(false);
            setIsAdding(false);
            setNewItem("");
            toast.success(successMessage);
        } catch (error) {
            console.error("Ошибка при сохранении данных:", error);
            toast.error("Не удалось сохранить изменения");
        }
    };

    const handleAddClick = () => setIsAdding(true);
    const handleConfirmAdd = () => {
        if (newItem.trim()) {
            setEditedItems([...editedItems, newItem.trim()]);
            setNewItem("");
            setIsAdding(false);
        }
    };
    const handleCancelAdd = () => {
        setNewItem("");
        setIsAdding(false);
    };

    const handleDelete = (index: number) => {
        setEditedItems(editedItems.filter((_, i) => i !== index));
    };

    // Показываем секцию, если есть элементы или активен режим редактирования
    if (!isEditing && (!items || items.length === 0)) {
        return null;
    }

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-row gap-2">
                        <p>{title}:</p>
                        {isEditing && (
                            <button onClick={handleAddClick} type="button">
                                +
                            </button>
                        )}
                    </div>
                    <button onClick={isEditing ? handleSave : () => setIsEditing(true)} type="button">
                        {isEditing ? "Сохранить" : "Изменить"}
                    </button>
                </div>
            </div>

            {isEditing ? (
                <>
                    <ul className="list-disc list-inside flex flex-col">
                        {editedItems.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span>{item}</span>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="w-5 h-5 flex items-center justify-center text-lg leading-none"
                                    type="button"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>

                    {isAdding && (
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                className="flex-1 border border-gray-300 rounded px-2 py-1"
                                placeholder={inputPlaceholder}
                                autoFocus
                            />
                            <button
                                onClick={handleConfirmAdd}
                                className="w-6 h-6 flex items-center justify-center text-green-600"
                                type="button"
                            >
                                ✓
                            </button>
                            <button
                                onClick={handleCancelAdd}
                                className="w-6 h-6 flex items-center justify-center text-red-600"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <ul className="list-disc list-inside flex flex-col">
                    {items?.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}



export default function UserInfo({ id }: { id: string }) {
    const { user, isLoading, isError, mutate } = useUser(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"></div>
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                    <p className="text-lg">Ошибка загрузки данных пользователя</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                    <p className="text-lg">Пользователь не найден</p>
                </div>
            </div>
        );
    }

    const userData = user as User;
    const fullName = `${userData.surname || ""} ${userData.name || ""} ${userData.middlename || ""}`.trim();
    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full relative bg-gray-300" style={{ aspectRatio: "16/9" }}>
                <Image
                    src={userData.avatar || "/my-photo.jpg"}
                    alt={fullName}
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div className="w-full flex flex-col items-start gap-4 px-4 pb-4">
                <div className="w-full">
                    <h1 className="text-xl font-semibold">{fullName || "Не указано"}</h1>
                </div>

                {userData.birthDate && (
                    <div className="w-full">
                        <p className="text-base">Дата рождения: {userData.birthDate}</p>
                    </div>
                )}

                {userData.livePosition && (
                    <div className="w-full">
                        <p className="text-base">{userData.livePosition}</p>
                    </div>
                )}

                <EditableList
                    title="Хобби"
                    items={userData.hobbies}
                    userId={id}
                    fieldKey="hobbies"
                    mutate={mutate}
                    inputPlaceholder="Название хобби"
                    successMessage="Хобби успешно сохранены"
                />

                <EditableList
                    title="Специализации"
                    items={userData.specializations}
                    userId={id}
                    fieldKey="specializations"
                    mutate={mutate}
                    inputPlaceholder="Название специализации"
                    successMessage="Специализации успешно сохранены"
                />

                <EditableList
                    title="Достижения"
                    items={userData.achievements}
                    userId={id}
                    fieldKey="achievements"
                    mutate={mutate}
                    inputPlaceholder="Название достижения"
                    successMessage="Достижения успешно сохранены"
                />

                <div className="w-full flex flex-col gap-2">
                    <h2 className="text-2xl font-bold">Воспоминания</h2>
                    {userData.memories?.map((memory: Memory, idx: number) => 
                        <div key={idx} className="flex flex-col gap-2 border border-black">
                            <Image
                                src={memory?.images?.[0] || '/my-photo.jpg'}
                                width={600}
                                height={600}
                                alt={memory?.title || 'Memory image'}
                                className="h-40 object-contain"
                            />
                            <p className="h-6 text-lg font-semibold">{memory?.title}</p>
                            <p className="line-clamp-2">{memory.text}</p>
                            <div className="flex flex-wrap justify-between">
                                <Link href={`/profile/${memory.creator.id}`}><span className="underline font-semibold">Автор:</span> {memory.creator.name}</Link>
                                <p><span className="underline font-semibold">О ком:</span> {userData.name}{memory.relatives.length > 1? ` и еще ${memory.relatives.length - 1}`: ""}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}