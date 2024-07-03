interface User {
    createdAt: Date | string;
    email: string;
    firstName: string;
    interests: string[];
    lastName: string[];
    lastViews: [];
    lastsLocations: [];
    newsletter: boolean;
    role: Exclude<AccessMode, "all" | "*">;
    telephone: string;
    updatedAt: Date | string;
    _id: string;
}