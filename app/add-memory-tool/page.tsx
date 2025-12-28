'use client';

import { FormEvent, useMemo, useState } from "react";
import { useUsers } from "../customhooks";
import { toast } from "sonner";
import { User } from "@/components/types";

export default function AddMemoryTool() {
    const { users } = useUsers();
    const [ title, setTitle ] = useState<string>("");
    const [ text, setText ] = useState<string>("");
    const [ relativesId, setRelativesId ] = useState<string[]>([]);
    const [ creatorId, setCreatorId ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ images, setImages ] = useState<File[]>([]);

    const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list) return;
      for (const file of list) {
        if (!file.type.startsWith("image/")) {
          toast.error("Допустимы только изображения");
          return;
        }
      }
      setImages(Array.from(list));
    }

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const memoryData = new FormData();
        for (const file of images) {
            memoryData.append("files", file);
        }

        memoryData.append("params", JSON.stringify({
          title,
          text,
          relativesId,
          creatorId
        }));

        if (relativesId.length === 0) {
            toast.error("Заполните все поля");
            setIsSubmitting(false);
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/create`, {
                method: 'POST',
                body: memoryData
            });
            if (!res.ok) {
              toast.error(res.text);
            }
        } catch (error: any) {
            toast.error("Ошибка при добавлении:", error.message)
        } finally {
            toast.success("Успех!");
            setTitle("");
            setText("");
            setRelativesId([]);
            setCreatorId("");
            setImages([]);
            setIsSubmitting(false);
        }
        
    }

    return (
        <div className="page-container">
            <div className="content-max-width">
                <div className="mb-8">
                    <h1 className="mb-3">Добавить воспоминание</h1>
                    <p className="text-description">
                        Заполните поля ниже, чтобы добавить новое воспоминание.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Field 
                    label="Заголовок"
                    value={title}
                    onChange={setTitle}
                    placeholder="Забытое воспоминание..."
                />

                <Field 
                    label="Текст"
                    value={text}
                    onChange={setText}
                    placeholder="Я вспомнил, что как-то раз я вспомнил..."
                />

                <ParentsSelector
                    users={users}
                    selectedIds={relativesId}
                    onChange={setRelativesId}
                />

                <CreatorSelector
                    users={users}
                    creatorId={creatorId}
                    onChange={setCreatorId}
                />

                    <div className="flex flex-col gap-2">
                        <label className="text-label">Загрузите изображения:</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={addImages}
                            className="px-4 py-2 border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full sm:w-auto"
                    >
                        {isSubmitting ? "Сохранение..." : "Сохранить воспоминание"}
                    </button>
                </form>
            </div>
        </div>
    )


}

type FieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
};
  
function Field({ label, value, onChange, placeholder, required }: FieldProps) {
    return (
      <label className="flex flex-col gap-2">
        <span className="text-label">{label}{required ? " *" : ""}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-11 border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
        />
      </label>
    );
  }
  
type ParentsSelectorProps = {
    users?: User[];
    selectedIds: string[];
    onChange: (value: string[]) => void;
};
  
function ParentsSelector({ users = [], selectedIds, onChange }: ParentsSelectorProps) {
    const options = useMemo(
      () =>
        users.map((user) => ({
          id: user.id,
          label: `${user.surname} ${user.name} ${user.middlename}`,
        })),
      [users]
    );
  
    const toggle = (id: string) => {
      const exists = selectedIds.includes(id);
      onChange(exists ? selectedIds.filter((v) => v !== id) : [...selectedIds, id]);
    };
  
    return (
      <div className="flex flex-col gap-2">
        <span className="text-label">О ком: *</span>
        <div className="max-h-48 overflow-y-auto border-2 border-border divide-y bg-card">
          {options.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">Нет данных о родственниках</div>
          )}
          {options.map((option) => (
            <label 
              key={option.id} 
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(option.id)}
                onChange={() => toggle(option.id)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
}

type CreatorSelectorProps = {
    users?: User[];
    creatorId: string;
    onChange: (value: string) => void;
}

function CreatorSelector({ users = [], creatorId, onChange}: CreatorSelectorProps) {

    const options = useMemo(() => users.map((user) => ({
        id: user.id,
        label: `${user.surname} ${user.name} ${user.middlename}`
    })), [users]);

    return (
        <div className="flex flex-col gap-2">
        <span className="text-label">Создатель воспоминания</span>
        <div className="max-h-48 overflow-y-auto border-2 border-border divide-y bg-card">
          {options.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground text-center">Нет данных о родственниках</div>
          )}
          {options.map((option) => (
            <label 
              key={option.id} 
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={creatorId === option.id}
                onChange={() => onChange(option.id)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/50"
              />
              <span className="text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
}
