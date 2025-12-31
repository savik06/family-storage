'use client';

import { useState } from "react";
import FamilyTree from "./FamilyTree";
import UserInfo from "./UserInfo";
import { XIcon } from "lucide-react";
import InfoModal from "./InfoModal";
import Navbar from "./Navbar";
import MemoryDetail from "./MemoryDetail";
import { Memory } from "./types";

export default function TreeWithProfile() {
    const [ isProfileOpen, setIsProfileOpen ] = useState(false);
    const [ userId, setUserId ] = useState("");
    const [ selectedMemory, setSelectedMemory ] = useState<Memory | null>(null);

    const handleClick = (id: string) => {
        setIsProfileOpen(true);
        setUserId(id);
    };

    return (
        <div className="relative">
            <FamilyTree onNodeClick={handleClick} />
            <InfoModal isOpen={isProfileOpen} close={() => setIsProfileOpen(prev => !prev)}>
                <UserInfo id={userId} isChange={false} memoryClick={(memory) => {setSelectedMemory(memory); setIsProfileOpen(false)}}/>
            </InfoModal>
            <InfoModal isOpen={selectedMemory !== null} close={() => {setSelectedMemory(null); setIsProfileOpen(true);}}>
                {selectedMemory && <MemoryDetail memory={selectedMemory} />}
            </InfoModal>
            {!isProfileOpen && <Navbar />}
        </div>

    )
}