"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { CalendarIcon } from "lucide-react";
import * as z from "zod"; // Add import for zod

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Subscription, subscriptionSchema } from "@/lib/subscriptions";
import { useCurrency } from "./app-provider";
import { CURRENCIES } from '@/lib/currencies'

const CATEGORIES = [
    "Entertainment",
    "Software",
    "Utilities",
    "Food",
    "Health",
    "Education",
    "Gaming",
    "Other",
];

// Create a modified schema for the form that handles empty URL values properly
const formSubscriptionSchema = subscriptionSchema.extend({
    url: z.union([z.string().url().nullish(), z.literal("")]),
});

// Type for the form values
type SubscriptionFormValues = z.infer<typeof formSubscriptionSchema>;

interface SubscriptionFormDialogProps {
    subscription?: Subscription;
    onSubmit: (subscription: Subscription) => void;
    buttonVariant?: "default" | "secondary" | "outline";
    buttonSize?: "sm" | "default" | "lg";
    buttonLabel?: string;
    showTriggerButton?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
}

export function SubscriptionFormDialog({
    subscription,
    onSubmit,
    buttonVariant = "default",
    buttonSize = "default",
    buttonLabel = "Add Subscription",
    showTriggerButton = true,
    open: externalOpen,
    onOpenChange: externalOnOpenChange,
    className,
}: SubscriptionFormDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const { primaryCurrency } = useCurrency();

    // If in controlled mode, use external state
    const isControlled = externalOpen !== undefined && externalOnOpenChange !== undefined;
    const isOpen = isControlled ? externalOpen : internalOpen;
    const setIsOpen = isControlled ? externalOnOpenChange : setInternalOpen;

    const isEditing = !!subscription;
    const dialogTitle = isEditing ? "Edit Subscription" : "Add Subscription";
    const dialogDescription = isEditing
        ? "Edit your subscription details."
        : "Add a new subscription to track.";


    useEffect(() => {
        form.setValue("currency", primaryCurrency);
    }, [primaryCurrency]);


    const form = useForm<SubscriptionFormValues>({
        resolver: zodResolver(formSubscriptionSchema),
        defaultValues: {
            id: subscription?.id || uuidv4(),
            name: subscription?.name || "",
            amount: subscription?.amount || 0,
            frequency: subscription?.frequency || "monthly",
            start_date: subscription?.start_date || format(new Date(), "yyyy-MM-dd"),
            commitment_end_date: subscription?.commitment_end_date,
            category: subscription?.category || "Other",
            currency: subscription?.currency || primaryCurrency || "USD",
            url: subscription?.url || "",
        },
    });

    // Reset form when subscription changes
    useEffect(() => {
        if (subscription) {
            form.reset(subscription);
        }
    }, [subscription, form]);

    function handleSubmit(values: SubscriptionFormValues) {
        const newSubscription: Subscription = {
            id: subscription?.id || `sub_${Date.now()}`,
            name: values.name,
            amount: Number(values.amount),
            frequency: values.frequency,
            start_date: values.start_date,
            commitment_end_date: values.commitment_end_date,
            category: values.category,
            currency: values.currency,
            url: values.url === "" ? null : values.url,
            hidden: false
        };

        onSubmit(newSubscription);
        if (!isEditing) {
            form.reset({
                id: uuidv4(),
                name: "",
                amount: 0,
                frequency: "monthly",
                start_date: format(new Date(), "yyyy-MM-dd"),
                commitment_end_date: undefined,
                category: "Other",
                currency: "USD",
                url: "",
            });
        }
        setIsOpen(false);

        if (window.gtag) {
            window.gtag('event', 'subscription_added', {
                event_category: 'engagement',
                event_label: values.name,
            });
        }
    }

    const formContent = (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Netflix" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service URL (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    type="url"
                                    placeholder="https://netflix.com"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => {
                                        // Handle empty string correctly
                                        const value = e.target.value;
                                        field.onChange(value === "" ? "" : value);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="9.99"
                                        value={isNaN(field.value) ? "0" : field.value.toString()}
                                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Currency</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {CURRENCIES.map((currency) => (
                                            <SelectItem key={currency} value={currency}>
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billing Frequency</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select frequency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="yearly">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>



                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <FormControl className="w-full">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-stretch">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className="w-full pl-3 text-left font-normal"
                                        >
                                            {field.value ? (
                                                format(new Date(field.value), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="commitment_end_date"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Commitment End Date (Optional)</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className="w-full pl-3 text-left font-normal"
                                        >
                                            {field.value ? (
                                                format(new Date(field.value), "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="submit">
                        {isEditing ? "Save Changes" : "Add Subscription"}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );

    // For both controlled and uncontrolled modes, we'll use the Dialog wrapper
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {showTriggerButton && (
                <DialogTrigger asChild>
                    <Button variant={buttonVariant} size={buttonSize} className={className}>{buttonLabel}</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                {formContent}
            </DialogContent>
        </Dialog>
    );
}