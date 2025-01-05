export interface IRoomTypePersistence {
    domainId: string;
    typeName: string;
    status: 'suitable' | 'unsuitable';
}