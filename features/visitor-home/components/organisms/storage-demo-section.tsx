import { FileUploadCard } from "../molecules/file-upload-card";
import { TextStorageCard } from "../molecules/text-storage-card";

/**
 * StorageDemoSection
 *
 * An organism that demonstrates R2 storage capabilities:
 * - File upload with presigned URLs (client-side)
 * - Text/JSON storage (server-side binding)
 */
export function StorageDemoSection() {
    return (
        <section className="bg-muted/50 py-16">
            <div className="container mx-auto px-4">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold">R2 Storage Demo</h2>
                    <p className="text-muted-foreground mx-auto max-w-2xl">
                        Examples of Cloudflare R2 storage integration with
                        presigned URL uploads and server-side text storage.
                    </p>
                </div>

                <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
                    <FileUploadCard />
                    <TextStorageCard />
                </div>
            </div>
        </section>
    );
}
