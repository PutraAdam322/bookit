import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { getAccessToken } from "@/utils/utils";

const url = import.meta.env.VITE_API_URL

export interface FacilityFormValues {
  name: string;
  price: number | "";
  capacity: number | "";
  available: boolean;
  description?: string;
  location?: string;
}

export interface FacilityFormProps {
  initialValues?: Partial<FacilityFormValues>; // for edit
  mode?: "create" | "edit";
  submitLabel?: string;
  onSubmit: (values: FacilityFormValues) => Promise<void> | void;
  onCancel?: () => void;
  disabled?: boolean;
}

const FacilityForm = () => {

    const mutation = useMutation({
        mutationFn: async ({ bookingslotId, totalPrice }: { bookingslotId: number; totalPrice: number }) => {
            const res = await fetch(`${url}/api/v1/facilities/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getAccessToken(),
            },
            body: JSON.stringify({ 'booking_slot_id':bookingslotId, 'total_price':totalPrice }),
            });

            const text = await res.text();
            try {
            return JSON.parse(text);
            } catch {
            throw new Error(`Invalid JSON response: ${text}`);
            }
        },
        onSuccess: () => {
            alert('Booking successful!');
        },
        onError: (err) => {
            console.error('Booking failed:', err);
            alert('Booking failed: ' + err.message);
        },
    })

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    price: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Venue added successfully!');
    navigate({to:'/admin/facilities'});
    };
    return(
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4">Basic Information</h3>
                <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name">Facility Name *</label>
                    <input
                    id="name"
                    placeholder="e.g., Grand Conference Hall"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <label htmlFor="capacity">Capacity (people) *</label>
                    <input
                        id="capacity"
                        type="number"
                        placeholder="e.g., 50"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    </div>

                    <div className="space-y-2">
                    <label htmlFor="price">Price per Hour ($) *</label>
                    <input
                        id="price"
                        type="number"
                        placeholder="e.g., 100"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    </div>
                </div>
                </div>
            </div>
            <div className="flex gap-4 justify-end">
                <i>
                <button type="button" className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                    Cancel
                </button>
                </i>
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
                Add Venue
                </button>
            </div>
            </form>
        </>
    );   
}

export default FacilityForm