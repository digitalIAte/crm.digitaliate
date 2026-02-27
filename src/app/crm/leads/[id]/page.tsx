import { fetchLeadById } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
    const data = await fetchLeadById(params.id);

    if (!data || !data.lead) {
        return <div className="p-8 text-center text-red-500">Lead not found or Error connecting to API</div>;
    }

    const { lead, conversations, activities } = data;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <Link href="/crm/leads" className="text-indigo-600 hover:underline mb-4 inline-block">&larr; Back to Leads</Link>
                <button className="bg-slate-900 text-white px-4 py-2 rounded text-sm hover:bg-slate-800">Edit Lead</button>
            </div>

            <div className="bg-white shadow rounded-lg p-6 flex justify-between items-start">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{lead.name || "Unknown"}</h2>
                    <p className="text-gray-500">{lead.email} | {lead.phone || "No phone"}</p>
                    <div className="mt-4 flex space-x-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{lead.status}</span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Score: {lead.score}</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Owner: {lead.owner_email || "None"}</span>
                    </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                    <p>Created: {new Date(lead.created_at).toLocaleDateString()}</p>
                    <p>Stage: {lead.stage}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Timeline Conversations */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Conversations</h3>
                    {conversations.length === 0 ? <p className="text-gray-500 text-sm">No conversations</p> :
                        conversations.map((c: any) => (
                            <div key={c.id} className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                <div className="text-xs text-amber-800 mb-2 font-semibold">Source: {c.source} | {new Date(c.created_at).toLocaleString()}</div>
                                <p className="text-sm whitespace-pre-wrap">{c.transcript}</p>
                            </div>
                        ))
                    }
                </div>

                {/* Activities and Tracking */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">Activities</h3>
                    {activities.length === 0 ? <p className="text-gray-500 text-sm">No activities yet.</p> :
                        activities.map((a: any) => (
                            <div key={a.id} className="bg-white rounded-lg p-4 shadow-sm border">
                                <div className="flex justify-between items-center mb-1">
                                    <strong className="text-sm text-gray-900 capitalize">{a.type}</strong>
                                    <span className="text-xs text-gray-500">{new Date(a.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-700">{a.note}</p>
                                <div className="text-xs text-gray-400 mt-2">By: {a.owner_email || "System"}</div>
                            </div>
                        ))
                    }

                    {/* Add Activity Mock */}
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="text-sm font-semibold mb-2">New Note</h4>
                        <textarea className="w-full border rounded p-2 text-sm focus:ring focus:ring-indigo-200" rows={3} placeholder="Add a note..."></textarea>
                        <button className="mt-2 bg-indigo-600 text-white text-sm px-4 py-1.5 rounded hover:bg-indigo-700">Save Note</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
