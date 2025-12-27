import Link from "next/link";

export default function Navbar() {
    return (
        <div className="fixed bottom-2 w-[80vw] left-1/2 -translate-x-1/2 grid grid-cols-2 py-2 bg-white border-2 border-black">
            <Link className="w-full text-center" href="/">Древо</Link>
            <Link className="w-full text-center" href="/memories">Воспоминания</Link>
        </div>
    )
}