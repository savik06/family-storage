export default function Loading() {
    return (
        <div className="page-container flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin h-12 w-12 border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent mx-auto mb-4"/>
                <p className="text-muted-foreground">Загрузка...</p>
            </div>
        </div>
    );
}