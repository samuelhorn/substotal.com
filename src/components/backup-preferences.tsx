import { Button } from '@/components/ui/button'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { exportAppState, importAppState } from '@/lib/storage'
import { useState } from 'react'
import { Card, CardFooter } from '@/components/ui/card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'


export function BackupPreferences() {
    const [importData, setImportData] = useState('')

    const handleExport = () => {
        const jsonData = exportAppState();
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subtrack-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Settings exported successfully');
    }

    const handleImport = () => {
        if (!importData) {
            return;
        }

        try {
            if (importAppState(importData)) {
                toast.success('Settings imported successfully');
                window.location.reload();
            } else {
                toast.error('Invalid backup data');
            }
        } catch (error) {
            console.error('Failed to import settings:', error);
            toast.error('Failed to import settings');
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-medium">Export Subscription Data</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Export your subscription data to a JSON file for backup or restore purposes.
                    </p>
                </CardContent>
                <CardFooter className='flex justify-end'>
                    <Button onClick={handleExport} size="sm">
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-medium">Import Subscription Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Import your subscription data by pasting JSON below and click import.
                        </p>
                        <Textarea
                            placeholder="Paste your backup data here to import..."
                            value={importData}
                            onChange={(e) => setImportData(e.target.value)}
                            className="w-full min-h-[70px] p-2 rounded-md border"
                        />
                    </div>
                </CardContent>
                <CardFooter className='flex justify-end'>
                    <Button onClick={handleImport} size="sm">
                        <Upload className="w-4 h-4" />
                        Import
                    </Button>
                </CardFooter>
            </Card>
        </>
    )
}