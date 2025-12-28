import TreeWithProfile from "@/components/TreeWithProfile";

export default function Home() {


  return (
    <div className="page-container">
      <div className="content-max-width mb-8">
        <h1 className="mb-3">Семейное древо</h1>
        <p className="text-description mb-6">
          Нажмите на карточку человека, чтобы открыть информацию о нем.
        </p>
      </div>
      <TreeWithProfile />
    </div>  
  );
}
