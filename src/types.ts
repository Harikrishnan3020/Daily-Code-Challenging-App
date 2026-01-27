/**
 * Represents a registered user in the application.
 */
export interface User {
    /** Unique identifier for the user */
    id: string;
    /** User's primary email address */
    email: string;
    /** Display name of the user */
    name: string;
    /** Optional URL to the user's avatar image */
    avatar?: string;
    /** Authentication provider used by the user */
    provider: "Google" | "GitHub" | "Email" | (string & {});
}
