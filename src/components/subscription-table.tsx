"use client";

import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";

import { Subscription, calculateMonthlyCost, calculateYearlyCost } from "@/lib/subscriptions";
import { convertAmount } from "@/lib/currency";

interface SubscriptionTableProps {
    subscriptions: Subscription[];
    onUpdate: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
    onToggleHidden: (subscription: Subscription) => void;
    primaryCurrency: string;
    exchangeRates: Record<string, number>;
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
    exchangeRates
}: SubscriptionTableProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>("name");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
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

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatAmount = (amount: number, fromCurrency: string) => {
        const originalAmount = formatCurrency(amount, fromCurrency);

        if (fromCurrency === primaryCurrency) {
            return originalAmount;
        }

        const convertedAmount = convertAmount(amount, fromCurrency, primaryCurrency, exchangeRates);
        return `${originalAmount} (${formatCurrency(convertedAmount, primaryCurrency)})`;
    };

    const getSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) return null;
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
                        <TableHead></TableHead>
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
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedSubscriptions.length === 0 ? (
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
                                <TableCell className="w-[24px]">
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
                                </TableCell>
                                <TableCell>
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
                                </TableCell>
                                <TableCell>{formatAmount(subscription.amount, subscription.currency)}</TableCell>
                                <TableCell className="capitalize">{subscription.frequency}</TableCell>
                                <TableCell>{subscription.category}</TableCell>
                                <TableCell>{format(new Date(subscription.startDate), "MMM d, yyyy")}</TableCell>
                                <TableCell>
                                    {formatAmount(
                                        calculateMonthlyCost(subscription),
                                        subscription.currency
                                    )}
                                </TableCell>
                                <TableCell>
                                    {formatAmount(
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
                                                    className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDeleteClick(subscription)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
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