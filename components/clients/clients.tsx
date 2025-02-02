'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface Client {
  id: number;
  name: string;
  contact: string;
  address: string;
}

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${backendUrl}api/clients/getClients/`);
        if (response.status === 200) {
          setClients(response.data);
        }
      } catch (err) {
        setError('Failed to load clients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [backendUrl]);

  // Handle client deletion
  const handleDeleteClient = async (clientId: number) => {
    try {
      const response = await axios.delete(
        `${backendUrl}api/clients/deleteClient/${clientId}/`
      );

      if (response.status === 204) {
        setClients(clients.filter(client => client.id !== clientId));
        toast.success('Client deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete client');
      console.error('Delete error:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Handle client edit
  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClient) return;

    try {
      const response = await axios.put(
        `${backendUrl}api/clients/updateClient/${editClient.id}/`,
        editClient
      );

      if (response.status === 200) {
        setClients(clients.map(client =>
          client.id === editClient.id ? response.data : client
        ));
        toast.success('Client updated successfully');
        setEditClient(null);
      }
    } catch (error) {
      toast.error('Failed to update client');
      console.error('Update error:', error);
    }
  };

  if (loading) return <div className="pt-20 text-center">Loading clients...</div>;
  if (error) return <div className="pt-20 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-[80px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Directory</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Total {clients.length} registered client{clients.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            href="/clients/register/"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Client
          </Link>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {clients.map(client => (
            <div key={client.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100 relative overflow-hidden">

              {/* Client Card Content with proper width constraints */}
              <div className="flex items-start gap-3 sm:gap-4 pr-20"> 
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-sm sm:text-lg">
                    {client.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0"> {/* min-w-0 ensures proper text truncation */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                    {client.name}
                  </h3>
                  <div className="mt-2 sm:mt-3 space-y-1">
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <span className="mr-1.5 sm:mr-2">📞</span>
                      <span className="truncate">{client.contact || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center text-xs sm:text-sm text-gray-500">
                      <span className="mr-1.5 sm:mr-2">🏠</span>
                      <span className="truncate">{client.address || 'Address not available'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Absolutely positioned with proper containment */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-2">
                <button
                  onClick={() => setEditClient(client)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit client"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteConfirm(client.id)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete client"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Client Modal */}
        {editClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4 text-green-500">Edit Client</h3>
              <form onSubmit={handleEditClient}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editClient.name}
                      onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      value={editClient.contact}
                      onChange={(e) => setEditClient({ ...editClient, contact: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={editClient.address}
                      onChange={(e) => setEditClient({ ...editClient, address: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditClient(null)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Are you sure you want to delete this client? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteClient(deleteConfirm)}
                  className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};