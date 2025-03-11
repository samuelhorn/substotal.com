"use client";

import { useState } from "react";
import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

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

interface SubscriptionTableProps {
    subscriptions: Subscription[];
    onUpdate: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
}

type SortColumn = "name" | "amount" | "frequency" | "category" | "startDate";
type SortDirection = "asc" | "desc";

export function SubscriptionTable({
    subscriptions,
    onUpdate,
    onDelete
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

    const getSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) return null;
        return sortDirection === "asc" ? "↑" : "↓";
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("name")}
                        >
                            Name {getSortIcon("name")}
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("amount")}
                        >
                            Amount {getSortIcon("amount")}
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("frequency")}
                        >
                            Frequency {getSortIcon("frequency")}
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("category")}
                        >
                            Category {getSortIcon("category")}
                        </TableHead>
                        <TableHead
                            className="cursor-pointer"
                            onClick={() => handleSort("startDate")}
                        >
                            Start Date {getSortIcon("startDate")}
                        </TableHead>
                        <TableHead>Monthly Cost</TableHead>
                        <TableHead>Yearly Cost</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedSubscriptions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-6">
                                No subscriptions added yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedSubscriptions.map((subscription) => (
                            <TableRow key={subscription.id}>
                                <TableCell className="font-medium">{subscription.name}</TableCell>
                                <TableCell>
                                    {formatCurrency(subscription.amount, subscription.currency)}
                                </TableCell>
                                <TableCell className="capitalize">{subscription.frequency}</TableCell>
                                <TableCell>{subscription.category}</TableCell>
                                <TableCell>{format(new Date(subscription.startDate), "MMM d, yyyy")}</TableCell>
                                <TableCell>
                                    {formatCurrency(
                                        calculateMonthlyCost(subscription),
                                        subscription.currency
                                    )}
                                </TableCell>
                                <TableCell>
                                    {formatCurrency(
                                        calculateYearlyCost(subscription),
                                        subscription.currency
                                    )}
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