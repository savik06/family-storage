'use client';

import { FormEvent, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useUsers } from "../customhooks";
import { User } from "@/components/types";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

type FormState = {
  name: string;
  surname: string;
  middlename: string;
  birthDate: string;
  parentsId: string[];
};

export default function CreateParentPage() {
  const { users, mutate } = useUsers();
  const [formData, setFormData] = useState<FormState>({
    name: "",
    surname: "",
    middlename: "",
    birthDate: "",
    parentsId: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    for (const file of list) {
      if (!file.type.startsWith("image/")) {
        toast.error("Допустимы только изображения");
        e.target.value = ""; // Сброс input при ошибке
        return;
      }
    }
    setImages(Array.from(list));
  }

  const handleChange =
    <K extends keyof FormState>(field: K) =>
    (value: FormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const userData = new FormData();
      for (const file of images) {
        userData.append("files", file);
      }

      userData.append("params", JSON.stringify(
        formData
      ));

      const response = await fetch(`${backendUrl}/user/create`, {
        method: "POST",
        body: userData,
      });

      if (!response.ok) {
        toast.error("Не удалось сохранить данные");
        return;
      }

      toast.success("Родственник успешно добавлен");
      await mutate();
      setFormData({
        name: "",
        surname: "",
        middlename: "",
        birthDate: "",
        parentsId: [],
      });
      setImages([]);
      // Сброс файлового input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Ошибка при создании родственника:", error);
      toast.error("Произошла ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-max-width">
        <div className="mb-8">
          <h1 className="mb-3">Добавить родственника</h1>
          <p className="text-description">
            Заполните поля ниже, чтобы добавить нового родственника в дерево.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Field
          label="Фамилия"
          value={formData.surname}
          onChange={handleChange("surname")}
          placeholder="Иванов"
          required
        />

        <Field
          label="Имя"
          value={formData.name}
          onChange={handleChange("name")}
          placeholder="Иван"
          required
        />

        <Field
          label="Отчество"
          value={formData.middlename}
          onChange={handleChange("middlename")}
          placeholder="Иванович"
        />

        <Field
          label="Дата рождения"
          value={formData.birthDate}
          onChange={handleChange("birthDate")}
          placeholder="DD.MM.YYYY"
          required
        />

        <ParentsSelector
          users={users}
          selectedIds={formData.parentsId}
          onChange={handleChange("parentsId")}
        />

        <div className="flex flex-col gap-2">
          <label className="text-label">Загрузите изображения:</label>
          <input 
            ref={fileInputRef}
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
            {isSubmitting ? "Сохранение..." : "Сохранить родственника"}
          </button>
        </form>
      </div>
    </div>
  );
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
      <span className="text-label">Родители</span>
      <div className="max-h-48 overflow-y-auto border-2 border-border divide-y bg-card">
        {options.length === 0 && (
          <div className="p-4 text-sm text-muted-foreground text-center">Нет данных о родителях</div>
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

