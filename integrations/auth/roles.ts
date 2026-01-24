import { createAccessControl, Role, Statements } from "better-auth/plugins";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

import { ROLE_ENUM } from "@/integrations/auth/constants";

const statements = {
    // default statements from better-auth admin plugin
    ...defaultStatements,

    // define roles and their permissions here
} satisfies Statements;

export const ac = createAccessControl(statements);

export const ROLES = {
    // define role constants here
    [ROLE_ENUM.SYSTEM]: ac.newRole({
        ...adminAc.statements,
    }),
    [ROLE_ENUM.SUPERADMIN]: ac.newRole({
        ...adminAc.statements,
    }),
    [ROLE_ENUM.ADMIN]: ac.newRole({
        ...adminAc.statements,
        user: ["get", "list", "set-password", "update"],
        session: [],
    }),
} satisfies Record<string, Role>;
