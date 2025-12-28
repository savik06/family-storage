'use client';

import { useUsers } from "@/app/customhooks";
import '@xyflow/react/dist/style.css';
import { Background, Controls, ReactFlow, Node, Edge, Handle, Position, NodeTypes, NodeProps } from '@xyflow/react';
import { useEffect, useState } from "react";
import { User } from "./types";
import Image from "next/image";
import clsx from "clsx";

type RelativeData = { 
    id: string; 
    label: string; 
    photo: string; 
    onClick: (id: string) => void, 
    isBorder: boolean; 
};


const RelativeCard = (props: NodeProps) => {
    const { data } = props;
    const { id, label, photo, onClick, isBorder } = data as RelativeData;

    const [ isChosen, setIsChosen ] = useState(false);
    const [ imageError, setImageError ] = useState(false);
    
    const placeholderImage = "https://family-storage.storage.yandexcloud.net/images/user-placeholder.jpg";
    const imageSrc = (photo && photo.trim() && !imageError) ? photo : placeholderImage;

    return (
        <div className={clsx("custom-node cursor-pointer", isChosen && "border-4 border-black")} onClick={() => {onClick(id); isBorder && setIsChosen(prev => !prev)}}>
            <div className="p-1 border-2 border-border">
                <Image
                    src={imageSrc}
                    alt={label}
                    width={500}
                    height={500}
                    className="w-24 h-24 object-cover"
                    onError={() => setImageError(true)}
                    unoptimized={imageSrc === placeholderImage}
                />
                <p>{label}</p>
            </div>
            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
        
    )
};

const nodeTypes: NodeTypes = { relativeCard: RelativeCard };

export default function FamilyTree({ onNodeClick, isBorder = false }: { onNodeClick: (id: string) => void, isBorder?: boolean }) {
    const { users } = useUsers();
    const [nodes, setNodes] = useState<Node<RelativeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const getUser = (surname: string, name: string, middlename: string) => {
        const result = users.find((user: User) => user.name.trim() === name && user.surname.trim() === surname && user.middlename.trim() === middlename);
        return result;
    }

    const nodeData = (surname: string, name: string, middlename: string) => {
        const user = getUser(surname, name, middlename);
        return {
            id: user?.id || "",
            type: 'relativeCard',
            data: {
                id: user?.id || "",
                label: name,
                photo: user?.images?.[0] || "",
                onClick: onNodeClick,
                isBorder
            }
        }
    }

    useEffect(() => {
        if (users) {
            const parents: Node<RelativeData>[] = [];
            
            parents.push({ ...nodeData("Задворнова", "Татьяна", "Алексеевна"), position: { x: -180, y: 0 } });
            parents.push({ ...nodeData("Задворнов", "Владимир", "Алексеевич"), position: { x: 0, y: 0 } });
            parents.push({ ...nodeData("Задворнова", "Елена", "Викторовна"), position: { x: 180, y: 0 } });
            parents.push({ ...nodeData("Лобов", "Юрий", "Александрович"), position: { x: 360, y: 0 } });
            parents.push({ ...nodeData("Лобова", "Надежда", "Васильевна"), position: { x: 540, y: 0 } });
            parents.push({ ...nodeData("Стародубцева", "Людмила", "Васильевна"), position: { x: 720, y: 0 } });

            parents.push({ ...nodeData("Задворнова", "Екатерина", "Евгеньевна"), position: { x: -140, y: 200 } });
            parents.push({ ...nodeData("Задворнов", "Андрей", "Владимирович"), position: { x: 40, y: 200 } });
            parents.push({ ...nodeData("Задворнова", "Мария", "Юрьевна"), position: { x: 220, y: 200 } });
            parents.push({ ...nodeData("Задворнов", "Дмитрий", "Владимирович"), position: { x: 400, y: 200 } });
            parents.push({ ...nodeData("Бухтина-Задворнова", "Ксения", "Александровна"), position: { x: 580, y: 200 } });

            parents.push({ ...nodeData("Задворнов", "Савелий", "Андреевич"), position: { x: -40, y: 400 } });
            parents.push({ ...nodeData("Задворнова", "Дарья", "Андреевна"), position: { x: 140, y: 400 } });
            parents.push({ ...nodeData("Задворнов", "Виктор", "Дмитриевич"), position: { x: 320, y: 400 } });
            parents.push({ ...nodeData("Задворнова", "Нина", "Дмитриевна"), position: { x: 500, y: 400 } });
            parents.push({ ...nodeData("Задворнова", "Арина", "Дмитриевна"), position: { x: 680, y: 400 } });
            parents.push({ ...nodeData("Задворнова", "Тамара", "Дмитриевна"), position: { x: 860, y: 400 } });
            setNodes([...parents]);

            const children: Edge[] = [];
            const getUserId = (surname: string, name: string, middlename: string) => {
                const user = getUser(surname, name, middlename);
                return user?.id || "";
            };

            children.push({ id: "e1", source: getUserId("Задворнов", "Владимир", "Алексеевич"), target: getUserId("Задворнов", "Андрей", "Владимирович")});
            children.push({ id: "e2", source: getUserId("Задворнова", "Елена", "Викторовна"), target: getUserId("Задворнов", "Андрей", "Владимирович")});
            children.push({ id: "e3", source: getUserId("Задворнов", "Владимир", "Алексеевич"), target: getUserId("Задворнов", "Дмитрий", "Владимирович")});
            children.push({ id: "e4", source: getUserId("Задворнова", "Елена", "Викторовна"), target: getUserId("Задворнов", "Дмитрий", "Владимирович")});

            children.push({ id: "e5", source: getUserId("Задворнов", "Андрей", "Владимирович"), target: getUserId("Задворнов", "Савелий", "Андреевич")});
            children.push({ id: "e6", source: getUserId("Задворнова", "Мария", "Юрьевна"), target: getUserId("Задворнов", "Савелий", "Андреевич")});
            children.push({ id: "e7", source: getUserId("Задворнов", "Андрей", "Владимирович"), target: getUserId("Задворнова", "Дарья", "Андреевна")});
            children.push({ id: "e8", source: getUserId("Задворнова", "Мария", "Юрьевна"), target: getUserId("Задворнова", "Дарья", "Андреевна")});

            children.push({ id: "e9", source: getUserId("Задворнов", "Дмитрий", "Владимирович"), target: getUserId("Задворнов", "Виктор", "Дмитриевич")});
            children.push({ id: "e10", source: getUserId("Бухтина-Задворнова", "Ксения", "Александровна"), target: getUserId("Задворнов", "Виктор", "Дмитриевич")});
            children.push({ id: "e11", source: getUserId("Задворнов", "Дмитрий", "Владимирович"), target: getUserId("Задворнова", "Нина", "Дмитриевна")});
            children.push({ id: "e12", source: getUserId("Бухтина-Задворнова", "Ксения", "Александровна"), target: getUserId("Задворнова", "Нина", "Дмитриевна")});
            children.push({ id: "e13", source: getUserId("Задворнов", "Дмитрий", "Владимирович"), target: getUserId("Задворнова", "Арина", "Дмитриевна")});
            children.push({ id: "e14", source: getUserId("Бухтина-Задворнова", "Ксения", "Александровна"), target: getUserId("Задворнова", "Арина", "Дмитриевна")});
            children.push({ id: "e15", source: getUserId("Задворнов", "Дмитрий", "Владимирович"), target: getUserId("Задворнова", "Тамара", "Дмитриевна")});
            children.push({ id: "e16", source: getUserId("Бухтина-Задворнова", "Ксения", "Александровна"), target: getUserId("Задворнова", "Тамара", "Дмитриевна")});

            children.push({ id: "e17", source: getUserId("Лобов", "Юрий", "Александрович"), target: getUserId("Задворнова", "Мария", "Юрьевна")});
            children.push({ id: "e18", source: getUserId("Лобова", "Надежда", "Васильевна"), target: getUserId("Задворнова", "Мария", "Юрьевна")});

            children.push({ id: "e19", source: getUserId("Задворнова", "Татьяна", "Алексеевна"), target: getUserId("Задворнова", "Екатерина", "Евгеньевна")});

            setEdges([...children]);
        }
    }, [users]);

    return (
        <div className="w-full h-[60vh]">
            <ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} fitView>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}