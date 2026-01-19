import "server-only";
import Plunk from "@plunk/node";

let email: Plunk | null = null;

export function createEmailClient() {
    return new Plunk(process.env.EMAIL_API_KEY);
}

export function getEmailClient() {
    email ??= createEmailClient();
    return email;
}
