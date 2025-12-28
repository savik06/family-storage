'use client';

import { useState } from "react";
import FamilyTree from "./FamilyTree";
import UserInfo from "./UserInfo";
import { XIcon } from "lucide-react";
import InfoModal from "./InfoModal";
import Navbar from "./Navbar";

export default function TreeWithProfile() {
    const [ isProfileOpen, setIsProfileOpen ] = useState(false);
    const [ userId, setUserId ] = useState("");

    const handleClick = (id: string) => {
        setIsProfileOpen(true);
        setUserId(id);
    };

    return (
        <div className="relative">
            <FamilyTree onNodeClick={handleClick} />
            <InfoModal isOpen={isProfileOpen} close={() => setIsProfileOpen(prev => !prev)}>
                <UserInfo id={userId} isChange={false} />
            </InfoModal>
            {!isProfileOpen && <Navbar />}
        </div>

    )
}