export type User = {
    id: string;
    name: string;
    surname: string;
    middlename: string;
    images: string[];
    birthDate: string;
    livePosition: string;
    hobbies: string[];
    specializations: string[];
    achievements: string[];
    parentsId: string[];
    memories?: Memory[];
    createdMemories?: Memory[];
}

export type Memory = {
    id: string;
    title?: string;
    images?: string[];
    text: string;
    creatorId: string;
    relativesId: string;
    creator: User;
    relatives: User[];
}