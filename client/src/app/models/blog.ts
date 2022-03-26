import { RegisterUser } from "./registerUser";

export class Blog {
    id?: string;
    title?: string;
    body?: string;
    imagePath?: string;
    createdBy?: RegisterUser;
}