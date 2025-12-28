'use client';

import FamilyTree from "@/components/FamilyTree";
import { useMemories, useUsers } from "../customhooks";
import { User } from "@/components/types";
import { useState, useEffect } from "react";
import { MemoriesInfo } from "@/components/Memory";
import InfoModal from "@/components/InfoModal";
import Navbar from "@/components/Navbar";

type ChosenRelative = {
    relative: User;
    isChosen: boolean;
}

export default function Memories() {
    const { users, isLoading } = useUsers();
    const { memories } = useMemories();
    const [ chosenRelatives, setChosenRelatives ] = useState<ChosenRelative[]>(users);
    const [ chosenAmount, setChosenAmount ] = useState(0);
    const [ isMemoriesOpen, setIsMemoriesOpen ] = useState(false);

    useEffect(() => {
        if (!isLoading) {
            setChosenRelatives(users.map((user: User) => ({relative: user, isChosen: false})));
        }
    }, [isLoading, users])

    const handleClick = (id: string) => {
        setChosenRelatives(prev => prev.map((rel: ChosenRelative) => {
            if (rel.relative.id === id) {
                if (rel.isChosen) setChosenAmount(prev => prev - 1);
                else setChosenAmount(prev => prev + 1);
                return {relative: rel.relative, isChosen: !rel.isChosen };
            }
            return rel;
        }));
    }

    return (
        <div className="relative page-container">
            <div className="content-max-width mb-8">
                <h1 className="mb-3">Выбери родственников</h1>
                <p className="text-description mb-6">
                    Нажмите на карточки родственников, чтобы выбрать их и посмотреть общие воспоминания
                </p>
            </div>
            <FamilyTree onNodeClick={handleClick} isBorder={true} />
            <InfoModal isOpen={isMemoriesOpen} close={() => setIsMemoriesOpen(prev => !prev)}>
                <MemoriesInfo users={chosenRelatives?.reduce((a: User[], r) => r.isChosen ? [...a, r.relative]: a, [])} allMemories={memories}/>
            </InfoModal> 
            {chosenAmount > 0 && !isMemoriesOpen && (
                <button 
                    onClick={() => setIsMemoriesOpen(prev => !prev)} 
                    className="btn-primary fixed left-1/2 -translate-x-1/2 bottom-32 sm:bottom-3 z-40"
                >
                    Показать воспоминания
                </button>
            )}
            {!isMemoriesOpen && <Navbar />}
        </div>
    )

}