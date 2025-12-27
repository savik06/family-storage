import TreeWithProfile from "@/components/TreeWithProfile";

export default function Home() {


  return (
    <div className="w-full h-full ">
      <h1>Семейное древо</h1>
      <p>Нажмите на человека, чтобы увидеть информацию о нем. </p>
      <TreeWithProfile />
    </div>  
  );
}
