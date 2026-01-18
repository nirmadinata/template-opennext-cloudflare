"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { R2_PATHS, buildR2Key } from "@/integrations/r2";

/**
 * Demo data key for text storage
 */
const DEMO_DATA_KEY = buildR2Key(R2_PATHS.DATA, "demo", "notes.json");

interface NoteData {
    title: string;
    content: string;
    updatedAt: string;
}

/**
 * TextStorageCard Props
 */
interface TextStorageCardProps {
    /**
     * Initial data loaded from server
     */
    initialData?: NoteData | null;
}

/**
 * TextStorageCard
 *
 * A molecule component that demonstrates server-side text storage in R2.
 * Uses direct R2 binding for efficient server-side operations.
 *
 * Note: This component receives initial data from the server and can
 * refresh/save via server actions or API calls.
 */
export function TextStorageCard({ initialData }: TextStorageCardProps) {
    const [title, setTitle] = useState(initialData?.title ?? "");
    const [content, setContent] = useState(initialData?.content ?? "");
    const [lastSaved, setLastSaved] = useState<string | null>(
        initialData?.updatedAt ?? null
    );
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // In a real app, you'd call a server action or RPC endpoint here
    // For this demo, we show the pattern but note that actual save
    // would need a server procedure

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            // Simulate save - in production, call an RPC endpoint
            // await serverRpc.storage.saveNote({ title, content });

            // For demo purposes, just update local state
            const now = new Date().toISOString();
            setLastSaved(now);

            // Show success message
            console.log("Note would be saved:", {
                title,
                content,
                key: DEMO_DATA_KEY,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleClear = () => {
        setTitle("");
        setContent("");
        setLastSaved(null);
        setError(null);
    };

    return (
        <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Text Storage Demo</h3>
            <p className="text-muted-foreground mb-4 text-sm">
                Store and retrieve JSON/text data from R2 storage.
                <br />
                <span className="text-xs">Key: {DEMO_DATA_KEY}</span>
            </p>

            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Title
                    </label>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a title..."
                        disabled={isSaving}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Content
                    </label>
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Enter your content..."
                        rows={4}
                        disabled={isSaving}
                    />
                </div>

                {error && (
                    <div className="text-destructive text-sm">{error}</div>
                )}

                {lastSaved && (
                    <div className="text-muted-foreground text-xs">
                        Last saved: {new Date(lastSaved).toLocaleString()}
                    </div>
                )}

                <div className="flex gap-2">
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || (!title && !content)}
                        className="flex-1"
                    >
                        {isSaving ? "Saving..." : "Save Note"}
                    </Button>
                    <Button
                        onClick={handleClear}
                        variant="outline"
                        disabled={isSaving}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
}
