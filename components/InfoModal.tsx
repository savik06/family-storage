import { XIcon } from "lucide-react";

type InfoModalProps = {
    isOpen: boolean;
    close: () => void;
    children: any;
}

export default function InfoModal({ isOpen, close, children }: InfoModalProps) {

    return (
        <>
            {isOpen && <div className="h-[80vh] absolute bottom-0 w-screen z-30 bg-white border-t-2 border-black">
                <div className="w-full flex flex-row justify-end">
                    <XIcon className="size-8" onClick={close} />
                </div>
                {children}
            </div>}
        </>
    )
}