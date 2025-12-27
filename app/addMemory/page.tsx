'use client';

import { FormEvent, useMemo, useState } from "react";
import { useUsers } from "../customhooks";
import { toast } from "sonner";
import { ChartBarStackedIcon } from "lucide-react";
import { User } from "@/components/types";

export default function AddMemory() {
    const { users } = useUsers();
    const [ title, setTitle ] = useState<string>("");
    const [ text, setText ] = useState<string>("");
    const [ relativesId, setRelativesId ] = useState<string[]>([]);
    const [ creatorId, setCreatorId ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        if (relativesId.length === 0) {
            toast.error("Введите все поля");
        }
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/memory/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                        title,
                        text,
                        relativesId,
                        creatorId
                })
                
            });
        } catch (error: any) {
            toast.error("Ошибка при добавлении:", error.message)
        } finally {
            toast.success("Успех!");
            setTitle("");
            setText("");
            setRelativesId([]);
            setCreatorId("");
            setIsSubmitting(false);
        }
        
    }

    return (
        <div className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Добавить воспоминание</h1>
                <p className="text-sm text-gray-600">
                Заполните поля ниже, чтобы добавить новое воспоминание.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 rounded-md bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Сохранение..." : "Сохранить"}
                </button>
            </form>
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
      <label className="flex flex-col gap-1">
        <span className="text-sm text-gray-800">{label}{required ? " *" : ""}</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className="h-10 rounded-md border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-black/60"
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
        <span className="text-sm text-gray-800">Относящиеся родственники</span>
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md divide-y">
          {options.length === 0 && (
            <div className="p-3 text-sm text-gray-500">Нет данных о родственниках</div>
          )}
          {options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={selectedIds.includes(option.id)}
                onChange={() => toggle(option.id)}
              />
              <span className="text-sm">{option.label}</span>
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
        <span className="text-sm text-gray-800">Создатель воспоминания</span>
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md divide-y">
          {options.length === 0 && (
            <div className="p-3 text-sm text-gray-500">Нет данных о родственниках</div>
          )}
          {options.map((option) => (
            <label key={option.id} className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={creatorId === option.id}
                onChange={() => onChange(option.id)}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
}
