export interface IStep {
    id: string;
    title: string;
    description: string;
    href: string;
    current: boolean;
    status: 'current' | 'upcoming' | 'complete';
    handler: boolean;
}
