"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, Globe, EyeOff, Eye } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Subscription, calculateMonthlyCost, calculateYearlyCost } from "@/lib/subscriptions";
import { convertAmount } from "@/lib/currency";
import { formatCurrency } from "@/lib/utils";
import { loadTableSortSettings, saveTableSortSettings } from '@/lib/settings';
import { Skeleton } from "./ui/skeleton";

interface SubscriptionTableProps {
    subscriptions: Subscription[];
    onUpdate: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
    onToggleHidden: (subscription: Subscription) => void;
    primaryCurrency: string;
    exchangeRates: Record<string, number>;
    isLoading: boolean;
}

type SortColumn = "name" | "amount" | "frequency" | "category" | "startDate";
type SortDirection = "asc" | "desc";

function getFaviconUrl(url: string | undefined) {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
        return null;
    }
}

export function SubscriptionTable({
    subscriptions,
    onUpdate,
    onDelete,
    onToggleHidden,
    primaryCurrency,
    exchangeRates,
    isLoading
}: SubscriptionTableProps) {
    // Initialize sort state from localStorage
    const [sortColumn, setSortColumn] = useState<SortColumn>(() => {
        const savedSettings = loadTableSortSettings();
        return (savedSettings?.column as SortColumn) || "name";
    });
    const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
        const savedSettings = loadTableSortSettings();
        return (savedSettings?.direction as SortDirection) || "asc";
    });

    const [isClient, setIsClient] = useState(false);

    // Set isClient to true when component mounts
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Save sort settings whenever they change
    useEffect(() => {
        saveTableSortSettings({ column: sortColumn, direction: sortDirection });
    }, [sortColumn, sortDirection]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [subscriptionToDelete, setSubscriptionToDelete] = useState<Subscription | null>(null);

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const sortedSubscriptions = [...subscriptions].sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        switch (sortColumn) {
            case "name":
                return a.name.localeCompare(b.name) * direction;
            case "amount":
                return (a.amount - b.amount) * direction;
            case "frequency":
                return a.frequency.localeCompare(b.frequency) * direction;
            case "category":
                return a.category.localeCompare(b.category) * direction;
            case "startDate":
                return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * direction;
            default:
                return 0;
        }
    });

    const handleEditClick = (subscription: Subscription) => {
        onUpdate(subscription);
    };

    const handleDeleteClick = (subscription: Subscription) => {
        setSubscriptionToDelete(subscription);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (subscriptionToDelete) {
            onDelete(subscriptionToDelete.id);
            setDeleteDialogOpen(false);
            setSubscriptionToDelete(null);
        }
    };

    // Use our new improved formatCurrency utility
    const formatAmountDisplay = (amount: number, fromCurrency: string) => {
        // Format original amount with symbol position based on currency
        const originalAmount = formatCurrency(amount, fromCurrency, {
            showDecimals: true,
            currencyDisplay: "narrowSymbol"
        });

        if (fromCurrency === primaryCurrency) {
            return originalAmount;
        }

        // Convert amount to primary currency and format consistently
        const convertedAmount = convertAmount(amount, fromCurrency, primaryCurrency, exchangeRates);
        return `${originalAmount} (${formatCurrency(convertedAmount, primaryCurrency, {
            showDecimals: true,
            currencyDisplay: "narrowSymbol"
        })})`;
    };

    const getSortIcon = (column: SortColumn) => {
        if (sortColumn !== column || !isClient) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    const handleToggleHidden = (subscription: Subscription) => {
        onToggleHidden(subscription);
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div onClick={() => handleSort("name")} className="cursor-pointer">
                                Name {getSortIcon("name")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div onClick={() => handleSort("amount")} className="cursor-pointer">
                                Amount {getSortIcon("amount")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div onClick={() => handleSort("frequency")} className="cursor-pointer">
                                Frequency {getSortIcon("frequency")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div onClick={() => handleSort("category")} className="cursor-pointer">
                                Category {getSortIcon("category")}
                            </div>
                        </TableHead>
                        <TableHead>
                            <div onClick={() => handleSort("startDate")} className="cursor-pointer">
                                Start Date {getSortIcon("startDate")}
                            </div>
                        </TableHead>
                        <TableHead>Monthly Cost</TableHead>
                        <TableHead>Yearly Cost</TableHead>
                        <TableHead className="text-center">Visibility</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <SkeletonRow rows={5} />
                    ) : (
                        sortedSubscriptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-muted-foreground py-4">
                                    No subscriptions added yet
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedSubscriptions.map((subscription) => (
                                <TableRow
                                    key={subscription.id}
                                    className={subscription.hidden ? "opacity-50" : ""}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            {subscription.url ? (
                                                <div className="relative w-5 h-5">
                                                    <Image
                                                        src={getFaviconUrl(subscription.url) || '/globe.svg'}
                                                        alt={`${subscription.name} favicon`}
                                                        className="rounded-sm"
                                                        width={20}
                                                        height={20}
                                                        onError={(e) => {
                                                            const img = e.target as HTMLImageElement;
                                                            img.src = '/globe.svg';
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <Globe className="w-4 h-4 text-muted-foreground" />
                                            )}
                                            {subscription.url ? (
                                                <a
                                                    href={subscription.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline"
                                                >
                                                    {subscription.name}
                                                </a>
                                            ) : (
                                                subscription.name
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatAmountDisplay(subscription.amount, subscription.currency)}</TableCell>
                                    <TableCell className="capitalize">{subscription.frequency}</TableCell>
                                    <TableCell>{subscription.category}</TableCell>
                                    <TableCell>{format(new Date(subscription.startDate), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        {formatAmountDisplay(
                                            calculateMonthlyCost(subscription),
                                            subscription.currency
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {formatAmountDisplay(
                                            calculateYearlyCost(subscription),
                                            subscription.currency
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="ghost"
                                                className="p-1"
                                                onClick={() => handleToggleHidden(subscription)}
                                            >
                                                {subscription.hidden ? (
                                                    <EyeOff className="h-4 w-4 text-foreground" />
                                                ) : (
                                                    <Eye className="h-4 w-4 text-foreground" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-40" align="end">
                                                    <div className="flex flex-col space-y-1">
                                                        <Button
                                                            variant="ghost"
                                                            className="justify-start"
                                                            onClick={() => handleEditClick(subscription)}
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="justify-start text-destructive-foreground"
                                                            onClick={() => handleDeleteClick(subscription)}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    )}
                </TableBody>
            </Table>

            {/* Delete Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Subscription</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the subscription for{" "}
                            <strong>{subscriptionToDelete?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const SkeletonRow = ({ rows }: { rows: number }) => (
    <>
        {[...Array(rows)].map((_, index) => (
            <TableRow className="h-[53px]" key={index}>
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                    <div className="flex justify-center">
                        <Skeleton className="h-3 w-5 rounded-full" />
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex justify-end">
                        <Skeleton className="h-2 w-4 mr-2" />
                    </div>
                </TableCell>
            </TableRow>
        ))}
    </>
);