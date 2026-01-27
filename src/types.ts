export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: "Google" | "GitHub" | "Email" | (string & {});
}
