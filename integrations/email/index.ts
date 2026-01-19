/* eslint-disable @typescript-eslint/no-empty-object-type */
import "server-only";

import type { FC } from "react";

import { createElement } from "react";

import Plunk from "@plunk/node";
import { render } from "@react-email/components";

type SendEmailOptions<Props extends {}> = {
    from?: string;
    to: string;
    subject: string;
    component: FC<Props>;
    props: Props;
};

function createEmailClient() {
    const resend = new Plunk(process.env.EMAIL_API_KEY);

    return {
        async send<Props extends {}>(options: SendEmailOptions<Props>) {
            options.from ??= process.env.EMAIL_FROM;

            const component = await render(
                createElement(options.component, {
                    ...options.props,
                })
            );

            const res = await resend.emails.send({
                to: options.to,
                from: options.from,
                subject: options.subject,
                type: "html",
                body: component,
            });

            return res.success;
        },
    };
}

/**
 * singleton instance of email client
 */
let _emailClient: ReturnType<typeof createEmailClient> | null = null;

export function getEmailClient() {
    _emailClient ??= createEmailClient();

    return _emailClient;
}
