"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exportAppState, importAppState } from "@/lib/storage";
import { toast } from "sonner";
import { useState } from "react";
import { DatabaseBackup } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ComponentProps } from "react";

interface ImportExportProps {
    onImportComplete?: () => void;
    buttonProps?: ComponentProps<typeof Button>;
    buttonLabel?: string;
}

// Main component that can be used in various contexts
export function ImportExport({ onImportComplete, buttonProps, buttonLabel }: ImportExportProps) {
    const [open, setOpen] = useState(false);
    const [importData, setImportData] = useState('');

    const handleExport = () => {
        const jsonData = exportAppState();
        // Create a Blob with the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create a temporary link and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subtrack-backup.json';
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Settings exported successfully');
        setOpen(false);
    };

    const handleImport = () => {
        if (!importData) {
            toast.error('Please paste your backup data');
            return;
        }

        try {
            if (importAppState(importData)) {
                toast.success('Settings imported successfully');
                setOpen(false);

                // Call the callback if provided
                if (onImportComplete) {
                    onImportComplete();
                }

                // Reload the page to reflect changes
                window.location.reload();
            } else {
                toast.error('Invalid backup data');
            }
        } catch (error) {
            console.error('Failed to import settings:', error);
            toast.error('Failed to import settings');
        }
    };

    return (
        <>
            <Button
                variant={buttonProps?.variant || "outline"}
                onClick={() => setOpen(true)}
                size={buttonProps?.size || "icon"}
                className={buttonProps?.className}
                disabled={buttonProps?.disabled}
            >
                {buttonLabel ? buttonLabel : <DatabaseBackup className="w-4 h-4" />}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import/Export Settings</DialogTitle>
                        <DialogDescription>
                            Export your settings to backup or transfer to another browser, or import previously exported settings.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4">
                        <div>
                            <Button onClick={handleExport} className="w-full">
                                Export Settings
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <Textarea
                                placeholder="Paste your backup data here to import..."
                                value={importData}
                                onChange={(e) => setImportData(e.target.value)}
                                className="w-full min-h-[100px] p-2 border rounded"
                            />
                            <Button onClick={handleImport} className="w-full">
                                Import Settings
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// For backward compatibility with existing usage
export function ImportExportDialog() {
    return <ImportExport />;
}