'use client';

import { FormEvent, useMemo, useState } from "react";
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

  const handleChange =
    <K extends keyof FormState>(field: K) =>
    (value: FormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${backendUrl}/user/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          parentsId: formData.parentsId,
        }),
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
    } catch (error) {
      console.error("Ошибка при создании родственника:", error);
      toast.error("Произошла ошибка при сохранении");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto p-4 flex flex-col gap-6">
        
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Добавить родственника</h1>
        <p className="text-sm text-gray-600">
          Заполните поля ниже, чтобы добавить нового родственника в дерево.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 rounded-md bg-black text-white disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
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
      <span className="text-sm text-gray-800">Родители</span>
      <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md divide-y">
        {options.length === 0 && (
          <div className="p-3 text-sm text-gray-500">Нет данных о родителях</div>
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

