"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateLead, createActivity, Lead } from "@/lib/api";

export default function LeadActions({ lead }: { lead: Lead }) {
    const router = useRouter();
    const [isUpdating, setIsUpdating] = useState(false);
    const [note, setNote] = useState("");
    const [isAddingNote, setIsAddingNote] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await updateLead(lead.id, { status: newStatus });
            router.refresh(); // Tells Next.js to re-fetch Server Component data
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleStageChange = async (newStage: string) => {
        setIsUpdating(true);
        try {
            await updateLead(lead.id, { stage: newStage });
            router.refresh();
        } catch (error) {
            alert("Failed to update stage");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        setIsAddingNote(true);
        try {
            await createActivity({
                lead_id: lead.id,
                type: "note",
                note: note,
                source: "Dashboard User"
            });
            setNote("");
            router.refresh();
        } catch (error) {
            alert("Failed to add note");
        } finally {
            setIsAddingNote(false);
        }
    };

    return (
        <>
            {/* Status & Stage Controls */}
            <div className="flex space-x-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Status</label>
                    <select
                        disabled={isUpdating}
                        value={lead.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-sm"
                    >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="lost">Lost</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Stage</label>
                    <select
                        disabled={isUpdating}
                        value={lead.stage}
                        onChange={(e) => handleStageChange(e.target.value)}
                        className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50 text-sm"
                    >
                        <option value="inbound">Inbound</option>
                        <option value="discovery">Discovery</option>
                        <option value="proposal">Proposal</option>
                        <option value="won">Won</option>
                    </select>
                </div>
                {isUpdating && <div className="flex items-center text-sm text-digitaliate animate-pulse mt-4">Saving...</div>}
            </div>

            {/* Note Input */}
            <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">New Note</h4>
                <textarea
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-digitaliate outline-none"
                    rows={3}
                    placeholder="Add a note or log an external interaction..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isAddingNote}
                />
                <button
                    onClick={handleAddNote}
                    disabled={isAddingNote || !note.trim()}
                    className="mt-2 bg-digitaliate text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-digitaliate-dark disabled:opacity-50 transition-colors shadow-sm"
                >
                    {isAddingNote ? "Saving Note..." : "Save Note"}
                </button>
            </div>
        </>
    );
}
