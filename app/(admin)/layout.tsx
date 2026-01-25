import { Fragment } from "react";

import { Toaster } from "sonner";

type Props = React.PropsWithChildren;

export default async function Layout({ children }: Props) {
    return (
        <Fragment>
            {children}
            <Toaster position="top-right" />
        </Fragment>
    );
}
