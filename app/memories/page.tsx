'use client';

import FamilyTree from "@/components/FamilyTree";
import { useMemories, useUsers } from "../customhooks";
import { User } from "@/components/types";
import { useState, useEffect } from "react";
import { MemoriesInfo } from "@/components/Memory";
import InfoModal from "@/components/InfoModal";

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
        <div className="w-full h-full relative flex flex-col items-center">
            <h1>Выбери родственников</h1>
            <FamilyTree onNodeClick={handleClick} isBorder={true} />
            <InfoModal isOpen={isMemoriesOpen} close={() => setIsMemoriesOpen(prev => !prev)}>
                <MemoriesInfo users={chosenRelatives?.reduce((a: User[], r) => r.isChosen ? [...a, r.relative]: a, [])} allMemories={memories}/>
            </InfoModal> 
            {chosenAmount > 0 && <button onClick={() => setIsMemoriesOpen(prev => !prev)} className="absolute bottom-5 border-2 border-black">Показать</button>}
        </div>
    )

}