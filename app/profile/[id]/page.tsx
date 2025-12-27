import { useUser } from "@/app/customhooks";
import UserInfo from "@/components/UserInfo";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <UserInfo id={id} />
  );
}