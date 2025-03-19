'use client';

import { useSubscriptions } from "@/components/app-provider";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DataMergeDialog() {
    const {
        showMergePrompt,
        handleMergeData,
        pendingLocalData,
        pendingCloudData
    } = useSubscriptions();

    if (!showMergePrompt) return null;

    return (
        <Dialog open={showMergePrompt} onOpenChange={() => handleMergeData('cloud')}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sync Subscription Data</DialogTitle>
                    <DialogDescription>
                        You have {pendingLocalData.length} local subscriptions and {pendingCloudData.length} cloud subscriptions.
                        Choose how you want to handle this.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Options:</h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• <span className="font-medium">Merge both</span>: Combine your cloud and local subscriptions</li>
                            <li>• <span className="font-medium">Keep cloud</span>: Use only your cloud data</li>
                            <li>• <span className="font-medium">Use local</span>: Replace cloud data with your local data</li>
                        </ul>
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex flex-col gap-2 w-full">
                        <Button
                            variant="default"
                            onClick={() => handleMergeData('both')}
                            className="w-full"
                        >
                            Merge both (recommended)
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleMergeData('cloud')}
                            className="w-full"
                        >
                            Keep cloud data
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => handleMergeData('local')}
                            className="w-full"
                        >
                            Use local data
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}