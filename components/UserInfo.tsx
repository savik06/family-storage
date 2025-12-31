'use client';

import { useUser } from "@/app/customhooks";
import Image from "next/image";
import { Memory, User } from "./types";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import Link from "next/link";
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeftIcon, ChevronLeft, ChevronRight } from "lucide-react";
import MemoryDetail from "./MemoryDetail";
import InfoModal from "./InfoModal";

type EditableKey = "hobbies" | "specializations" | "achievements";

interface EditableListProps {
    title: string;
    items?: string[];
    userId: string;
    fieldKey: EditableKey;
    mutate: () => Promise<any> | void;
    inputPlaceholder: string;
    successMessage: string;
    isChange: boolean;
}

function EditableList({
    title,
    items = [],
    userId,
    fieldKey,
    mutate,
    inputPlaceholder,
    successMessage,
    isChange

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
            const response = await fetch(`${backendUrl}/user/update`, {
                method: "PATCH",
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
    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex flex-row justify-between w-full items-center">
                    <div className="flex flex-row gap-2 items-center">
                        <h3>{title}</h3>
                        {isEditing && (
                            <button 
                                onClick={handleAddClick} 
                                type="button"
                                className="btn-ghost text-lg font-bold w-8 h-8 p-0 flex items-center justify-center"
                            >
                                +
                            </button>
                        )}
                    </div>
                    {isChange && (
                        <button 
                            onClick={isEditing ? handleSave : () => setIsEditing(true)} 
                            type="button"
                            className={isEditing ? "btn-primary" : "btn-outline"}
                        >
                            {isEditing ? "Сохранить" : "Изменить"}
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <>
                    <ul className="flex flex-col gap-2">
                        {editedItems.map((item, index) => (
                            <li key={index} className="flex items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
                                <span className="flex-1">{item}</span>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="btn-ghost text-destructive hover:bg-destructive/10 w-8 h-8 p-0 flex items-center justify-center"
                                    type="button"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>

                    {isAdding && (
                        <div className="flex items-center gap-2 mt-3">
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                className="flex-1 h-10 border border-border rounded-lg px-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder={inputPlaceholder}
                                autoFocus
                            />
                            <button
                                onClick={handleConfirmAdd}
                                className="btn-ghost text-green-600 hover:bg-green-50 w-10 h-10"
                                type="button"
                            >
                                ✓
                            </button>
                            <button
                                onClick={handleCancelAdd}
                                className="btn-ghost text-destructive hover:bg-destructive/10 w-10 h-10"
                                type="button"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {items && items.length > 0 ? (
                        <ul className="flex flex-col gap-2">
                            {items.map((item, index) => (
                                <li key={index} className="p-3 bg-muted/30 rounded-lg">{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">Не указано</p>
                    )}
                </>
            )}
        </div>
    );
}

type EditableFieldProps = {
    title: string;
    value?: string | null;
    userId: string;
    fieldKey: "livePosition";
    mutate: () => Promise<any> | void;
    inputPlaceholder: string;
    successMessage: string;
    isChange: boolean;
  };
  
  function EditableField({
    title,
    value,
    userId,
    fieldKey,
    mutate,
    inputPlaceholder,
    successMessage,
    isChange,
  }: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(value ?? "");
  
    useEffect(() => {
      if (isEditing) setEditedValue(value ?? "");
      else setEditedValue(value ?? "");
    }, [isEditing, value]);
  
    const handleSave = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  
      try {
        const response = await fetch(`${backendUrl}/user/update`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId, [fieldKey]: editedValue.trim() }),
        });
  
        if (!response.ok) {
          toast.error("Ошибка при сохранении данных");
          return;
        }
  
        await mutate();
        setIsEditing(false);
        toast.success(successMessage);
      } catch (error) {
        console.error("Ошибка при сохранении данных:", error);
        toast.error("Не удалось сохранить изменения");
      }
    };
  
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-label">{title}</p>
  
          {isChange && (
            <button
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              type="button"
              className={isEditing ? "btn-primary" : "btn-outline"}
            >
              {isEditing ? "Сохранить" : "Изменить"}
            </button>
          )}
        </div>
  
        {isEditing ? (
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className="w-full h-10 border border-border rounded-lg px-3 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder={inputPlaceholder}
            autoFocus
          />
        ) : (
          <p className="text-base">{value?.trim() ? value : "Не указано"}</p>
        )}
      </div>
    );
  }
  



export default function UserInfo({ id, isChange, memoryClick }: { id: string, isChange: boolean; memoryClick?: (memory: Memory) => void; }) {
    const { user, isLoading, isError, mutate } = useUser(id);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedUserId = localStorage.getItem('userId');
            setCurrentUserId(savedUserId);
        }
    }, []);

    // Редактирование доступно только если id совпадает с userId из localStorage И isChange === true
    const canEdit = isChange && currentUserId === id;

    const handleMemoryClick = (memory: Memory) => {
        setSelectedMemory(memory);
        setIsMemoryModalOpen(true);
    };

    const closeMemoryModal = () => {
        setIsMemoryModalOpen(false);
        setSelectedMemory(null);
    };

    const [emblaRef, emblaApi] = useEmblaCarousel({ 
        loop: true,
        containScroll: 'trimSnaps',
        dragFree: false
    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
        
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }
            formData.append("params", JSON.stringify({ id }));

            const response = await fetch(`${backendUrl}/user/update`, {
                method: "PATCH",
                body: formData,
            });

            if (!response.ok) {
                toast.error("Ошибка при загрузке фотографий");
                return;
            }

            await mutate();
            toast.success("Фотографии успешно загружены");
            
            // Сброс файлового input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error("Ошибка при загрузке фотографий:", error);
            toast.error("Не удалось загрузить фотографии");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };
    
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
    
    const images = userData.images && userData.images.length > 0 ? userData.images : ["/user-placeholder.jpg"];
    

    return (
        <div className="flex flex-col w-full">
            {isChange && <div className="content-max-width flex flex-row w-full justify-start my-2 sm:mt-4">
                <Link href="/tree" className="flex flex-row gap-1 items-center btn-outline">
                    <ArrowLeftIcon className="size-4" />
                    Главная
                </Link>
            </div>}
            <div className="w-full content-max-width relative h-64 sm:h-80 bg-muted mx-auto" style={{ aspectRatio: "16/9" }}>
                <div className="w-full h-full overflow-hidden" ref={emblaRef}>
                    <div className="flex h-full">
                        {images.map((image, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 relative">
                                <Image
                                    src={image}
                                    alt={`${fullName} - фото ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    priority={index === 0}
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
                {isChange && canEdit && (
                    <div className="absolute top-4 right-4 z-10">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={isUploading}
                        />
                        <button
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            className="btn-primary"
                            type="button"
                        >
                            {isUploading ? "Загрузка..." : "Загрузить фото"}
                        </button>
                    </div>
                )}
            </div>

            <div className="page-container">
                <div className="content-max-width">
                    <div className="mb-6">
                        <h1 className="mb-2">{fullName || "Не указано"}</h1>
                    </div>
                    
                    <div className="flex flex-col gap-4 mb-8">
                        <div>
                            <p className="text-label">Дата рождения</p>
                            <p className="text-base">{userData.birthDate || "не указано"}</p>
                        </div>
                        <EditableField
                            title="Жизненная позиция"
                            value={userData.livePosition}
                            userId={id}
                            fieldKey="livePosition"
                            mutate={mutate}
                            inputPlaceholder="Введите жизненную позицию"
                            successMessage="Жизненная позиция успешно сохранена"
                            isChange={canEdit}
                        />
                    </div>

                    <div className="section-spacing">
                        <EditableList
                            title="Хобби"
                            items={userData.hobbies}
                            userId={id}
                            fieldKey="hobbies"
                            mutate={mutate}
                            inputPlaceholder="Название хобби"
                            successMessage="Хобби успешно сохранены"
                            isChange={canEdit}
                        />
                    </div>

                    <div className="section-spacing">
                        <EditableList
                            title="Специализации"
                            items={userData.specializations}
                            userId={id}
                            fieldKey="specializations"
                            mutate={mutate}
                            inputPlaceholder="Название специализации"
                            successMessage="Специализации успешно сохранены"
                            isChange={canEdit}
                        />
                    </div>

                    <div className="section-spacing">
                        <EditableList
                            title="Достижения"
                            items={userData.achievements}
                            userId={id}
                            fieldKey="achievements"
                            mutate={mutate}
                            inputPlaceholder="Название достижения"
                            successMessage="Достижения успешно сохранены"
                            isChange={canEdit}
                        />
                    </div>

                    <div className="section-spacing">
                        <div className="flex flex-row justify-between mb-4">
                            <h2>Воспоминания</h2>
                            {isChange && canEdit && <Link 
                                href="/add-memory" 
                                className="btn-outline inline-block sm:w-auto"
                            >
                                добавить
                            </Link>}
                        </div>
                        {!!userData.memories && userData.memories.length === 0 && (
                            <div className="w-full h-40 flex border border-border rounded-lg items-center justify-center bg-muted/30">
                                <p className="text-muted-foreground">Здесь будут воспоминания о {canEdit ? "вас" : user.name}</p>
                            </div>
                        )}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {userData.memories?.map((memory: Memory, idx: number) => 
                                <div 
                                    key={idx} 
                                    className="card flex flex-col gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={memoryClick? () => memoryClick(memory): () => handleMemoryClick(memory)}
                                >
                                    {memory?.images?.[0] && (
                                        <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                                            <Image
                                                src={memory.images[0]}
                                                alt={memory?.title || 'Memory image'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-lg font-semibold">{memory?.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{memory.text}</p>
                                    <div className="flex flex-col gap-2 pt-2 border-t border-border">
                                        <Link 
                                            href={`/profile/${memory.creator.id}`}
                                            className="text-sm hover:text-primary transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <span className="font-semibold">Автор:</span> {memory.creator.name}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            <span className="font-semibold">О ком:</span> {userData.name}{memory.relatives.length > 1? ` и еще ${memory.relatives.length - 1}`: ""}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {isChange && selectedMemory && (
                <InfoModal isOpen={isMemoryModalOpen} close={closeMemoryModal}>
                    <MemoryDetail memory={selectedMemory} />
                </InfoModal>
            )}
        </div>
    );
}