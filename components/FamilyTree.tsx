'use client';

import { useUsers } from "@/app/customhooks";
import '@xyflow/react/dist/style.css';
import { Background, Controls, ReactFlow, Node, Edge, NodeProps, NodeTypes, Handle, Position } from '@xyflow/react';
import { useEffect, useState } from "react";
import { User } from "./types";
import Image from "next/image";
import clsx from "clsx";

type RelativeData = { id: string; label: string; photo: string; onClick: (id: string) => void, isBorder: boolean; };

const RelativeCard = ({ id, data }: NodeProps<RelativeData>) => {

    const [ isChosen, setIsChosen ] = useState(false);

    return (
        <div className={clsx("custom-node cursor-pointer", isChosen && "border-4 border-black")} onClick={() => {data.onClick(id); data.isBorder && setIsChosen(prev => !prev)}}>
            <div className="p-1 shadow-sm shadow-gray-900">
                <Image
                    src={data.photo}
                    alt={data.label}
                    width={300}
                    height={300}
                    className="w-24 h-24"
                />
                <p>{data.label}</p>
            </div>
            <Handle type="source" position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
        
    )
};

const nodeTypes = { relativeCard: RelativeCard };

export default function FamilyTree({ onNodeClick, isBorder = false }: { onNodeClick: (id: string) => void, isBorder?: boolean }) {
    const { users } = useUsers();
    const [nodes, setNodes] = useState<Node<RelativeData>[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    const getId = (users: User[], surname: string, name: string, middlename: string) => {
        const result = users.find(user => user.name.trim() === name && user.surname.trim() === surname && user.middlename.trim() === middlename)?.id || "";
        return result;
    }

    

    useEffect(() => {
        if (users) {
            const parents: Node<RelativeData>[] = [];
            
            parents.push({ id: getId(users, "Задворнова", "Татьяна", "Алексеевна"), type: 'relativeCard', position: { x: -180, y: 0 }, data: { id: getId(users, "Задворнова", "Татьяна", "Алексеевна"), label: "Татьяна", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнов", "Владимир", "Алексеевич"), type: 'relativeCard', position: { x: 0, y: 0 }, data: { id: getId(users, "Задворнов", "Владимир", "Алексеевич"), label: "Владимир", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнова", "Елена", "Викторовна"), type: 'relativeCard', position: { x: 180, y: 0 }, data: { id: getId(users, "Задворнова", "Елена", "Викторовна"), label: "Елена", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Лобов", "Юрий", "Александрович"), type: 'relativeCard', position: { x: 360, y: 0 }, data: { id: getId(users, "Лобов", "Юрий", "Александрович"), label: "Юрий", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Лобова", "Надежда", "Васильевна"), type: 'relativeCard', position: { x: 540, y: 0 }, data: { id: getId(users, "Лобова", "Надежда", "Васильевна"), label: "Надежда", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Стародубцева", "Людмила", "Васильевна"), type: 'relativeCard', position: { x: 720, y: 0 }, data: { id: getId(users, "Стародубцева", "Людмила", "Васильевна"), label: "Людмила", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });

            parents.push({ id: getId(users, "Задворнова", "Екатерина", "Артемовна"), type: 'relativeCard', position: { x: -140, y: 200 }, data: { id: getId(users, "Задворнова", "Екатерина", "Артемовна"), label: "Екатерина", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнов", "Андрей", "Владимирович"), type: 'relativeCard', position: { x: 40, y: 200 }, data: { id: getId(users, "Задворнов", "Андрей", "Владимирович"), label: "Андрей", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнова", "Мария", "Юрьевна"), type: 'relativeCard', position: { x: 220, y: 200 }, data: { id: getId(users, "Задворнова", "Мария", "Юрьевна"), label: "Мария", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнов", "Дмитрий", "Владимирович"), type: 'relativeCard', position: { x: 400, y: 200 }, data: { id: getId(users, "Задворнов", "Дмитрий", "Владимирович"), label: "Дмитрий", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнова", "Ксения", "Артемовна"), type: 'relativeCard', position: { x: 580, y: 200 }, data: { id: getId(users, "Задворнова", "Ксения", "Артемовна"), label: "Ксения", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });

            parents.push({ id: getId(users, "Задворнов", "Савелий", "Андреевич"), type: 'relativeCard', position: { x: 0, y: 400 }, data: { id: getId(users, "Задворнов", "Савелий", "Андреевич"), label: "Савелий", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнова", "Дарья", "Андреевна"), type: 'relativeCard', position: { x: 180, y: 400 }, data: { id: getId(users, "Задворнова", "Дарья", "Андреевна"), label: "Дарья", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнов", "Виктор", "Дмитриевич"), type: 'relativeCard', position: { x: 360, y: 400 }, data: { id: getId(users, "Задворнов", "Виктор", "Дмитриевич"), label: "Виктор", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнова", "Нина", "Дмитриевна"), type: 'relativeCard', position: { x: 540, y: 400 }, data: { id: getId(users, "Задворнова", "Нина", "Дмитриевна"), label: "Нина", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнова", "Арина", "Дмитриевна"), type: 'relativeCard', position: { x: 720, y: 400 }, data: { id: getId(users, "Задворнова", "Арина", "Дмитриевна"), label: "Арина", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            parents.push({ id: getId(users, "Задворнова", "Тамара", "Дмитриевна"), type: 'relativeCard', position: { x: 900, y: 400 }, data: { id: getId(users, "Задворнова", "Тамара", "Дмитриевна"), label: "Тамара", photo: "/my-photo.jpg", onClick: onNodeClick, isBorder } });
            setNodes([...parents]);

            const children: Edge[] = [];
            children.push({ id: "e1", source: getId(users, "Задворнов", "Владимир", "Алексеевич"), target: getId(users, "Задворнов", "Андрей", "Владимирович")});
            children.push({ id: "e2", source: getId(users, "Задворнова", "Елена", "Викторовна"), target: getId(users, "Задворнов", "Андрей", "Владимирович")});
            children.push({ id: "e3", source: getId(users, "Задворнов", "Владимир", "Алексеевич"), target: getId(users, "Задворнов", "Дмитрий", "Владимирович")});
            children.push({ id: "e4", source: getId(users, "Задворнова", "Елена", "Викторовна"), target: getId(users, "Задворнов", "Дмитрий", "Владимирович")});

            children.push({ id: "e5", source: getId(users, "Задворнов", "Андрей", "Владимирович"), target: getId(users, "Задворнов", "Савелий", "Андреевич")});
            children.push({ id: "e6", source: getId(users, "Задворнова", "Мария", "Юрьевна"), target: getId(users, "Задворнов", "Савелий", "Андреевич")});
            children.push({ id: "e7", source: getId(users, "Задворнов", "Андрей", "Владимирович"), target: getId(users, "Задворнова", "Дарья", "Андреевна")});
            children.push({ id: "e8", source: getId(users, "Задворнова", "Мария", "Юрьевна"), target: getId(users, "Задворнова", "Дарья", "Андреевна")});

            children.push({ id: "e9", source: getId(users, "Задворнов", "Дмитрий", "Владимирович"), target: getId(users, "Задворнов", "Виктор", "Дмитриевич")});
            children.push({ id: "e10", source: getId(users, "Задворнова", "Ксения", "Артемовна"), target: getId(users, "Задворнов", "Виктор", "Дмитриевич")});
            children.push({ id: "e11", source: getId(users, "Задворнов", "Дмитрий", "Владимирович"), target: getId(users, "Задворнова", "Нина", "Дмитриевна")});
            children.push({ id: "e12", source: getId(users, "Задворнова", "Ксения", "Артемовна"), target: getId(users, "Задворнова", "Нина", "Дмитриевна")});
            children.push({ id: "e13", source: getId(users, "Задворнов", "Дмитрий", "Владимирович"), target: getId(users, "Задворнова", "Арина", "Дмитриевна")});
            children.push({ id: "e14", source: getId(users, "Задворнова", "Ксения", "Артемовна"), target: getId(users, "Задворнова", "Арина", "Дмитриевна")});
            children.push({ id: "e15", source: getId(users, "Задворнов", "Дмитрий", "Владимирович"), target: getId(users, "Задворнова", "Тамара", "Дмитриевна")});
            children.push({ id: "e16", source: getId(users, "Задворнова", "Ксения", "Артемовна"), target: getId(users, "Задворнова", "Тамара", "Дмитриевна")});

            children.push({ id: "e17", source: getId(users, "Лобов", "Юрий", "Александрович"), target: getId(users, "Задворнова", "Мария", "Юрьевна")});
            children.push({ id: "e18", source: getId(users, "Лобова", "Надежда", "Васильевна"), target: getId(users, "Задворнова", "Мария", "Юрьевна")});

            children.push({ id: "e19", source: getId(users, "Задворнова", "Татьяна", "Алексеевна"), target: getId(users, "Задворнова", "Екатерина", "Артемовна")});

            setEdges([...children]);
        }
    }, [users]);

    return (
        <div className="w-screen h-[70vh]">
            <ReactFlow nodes={nodes} nodeTypes={nodeTypes} edges={edges} fitView>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    )
}