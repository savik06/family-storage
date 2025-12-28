'use client';

import { User } from "@/components/types";
import { useUsers } from "./customhooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WhoAmI() {
  const { users, isLoading } = useUsers();
  const router = useRouter();

  // Проверка localStorage при загрузке и редирект если есть сохраненный id
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        router.push(`/profile/${savedUserId}`);
      }
    }
  }, [router]);

  const handleUserClick = (userId: string) => {
    // Сохраняем id в localStorage
    localStorage.setItem('userId', userId);
    // Переходим на страницу профиля
    router.push(`/profile/${userId}`);
  };

  if (isLoading) {
    return (
        <div className="page-container flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin h-12 w-12 border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent mx-auto mb-4"></div>
                <p className="text-muted-foreground">Загрузка...</p>
            </div>
        </div>
    );
}
  return (
    <div className="page-container flex flex-col items-center justify-center content-max-width">
      <div className="w-full max-w-md">
        <h1 className="text-center mb-2">Кто вы?</h1>
        <p className="text-description text-center mb-8">
          Выберите себя из списка или войдите как гость
        </p>
        <div className="flex flex-col gap-0 max-h-96 overflow-y-auto border-2 border-border bg-card">
          <button
            className="px-6 py-4 text-left border-b border-border last:border-b-0 hover:bg-muted transition-colors"
            onClick={() => router.push('/tree')}
          >
            <span className="font-medium">Гость</span>
            <p className="text-sm text-muted-foreground mt-1">Просмотр без авторизации</p>
          </button>
          {users.map((user: User, idx: number) => (
            <button
              key={idx} 
              className="px-6 py-4 text-left border-b border-border last:border-b-0 hover:bg-muted transition-colors"
              onClick={() => handleUserClick(user.id)}
            >
              <span className="font-medium">{user.name}</span>
              {user.surname && (
                <p className="text-sm text-muted-foreground mt-1">
                  {user.surname} {user.middlename || ''}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}