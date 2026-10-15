import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/admin/AdminLayout';
import { format } from 'date-fns';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, [filter]);

  const fetchInquiries = async () => {
    try {
      // DEMO MODE: Use sample data
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        const sampleData = [
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 555-0123',
            project_type: 'mural',
            message: 'I would like to commission a mural for our community center.',
            budget_range: '$5,000 - $10,000',
            timeline: '2-3 months',
            status: 'new',
            created_at: '2024-03-10T10:30:00Z'
          },
          {
            id: '2',
            name: 'Michael Chen',
            email: 'michael@company.com',
            phone: '+1 555-0456',
            project_type: 'branding',
            message: 'Need complete branding package for a new coffee shop.',
            budget_range: '$3,000 - $5,000',
            timeline: '1 month',
            status: 'new',
            created_at: '2024-03-12T14:20:00Z'
          },
          {
            id: '3',
            name: 'Emma Williams',
            email: 'emma@design.com',
            phone: '+251 91 234 5678',
            project_type: 'concept-design',
            message: 'Looking for concept designs for urban development project.',
            budget_range: '$10,000+',
            timeline: '3-6 months',
            status: 'in_progress',
            created_at: '2024-02-28T09:15:00Z'
          },
          {
            id: '4',
            name: 'David Martinez',
            email: 'david@events.com',
            phone: '+1 555-0789',
            project_type: 'mural',
            message: 'Event backdrop mural needed for music festival.',
            budget_range: '$2,000 - $3,000',
            timeline: '2 weeks',
            status: 'completed',
            created_at: '2024-02-15T11:45:00Z'
          },
          {
            id: '5',
            name: 'Aisha Mohammed',
            email: 'aisha@restaurant.et',
            phone: '+251 91 876 5432',
            project_type: 'branding',
            message: 'Restaurant branding with Ethiopian cultural elements.',
            budget_range: '$5,000 - $10,000',
            timeline: '1-2 months',
            status: 'completed',
            created_at: '2024-01-20T16:00:00Z'
          },
        ];

        const filtered = filter === 'all' 
          ? sampleData 
          : sampleData.filter(i => i.status === filter);
        
        setInquiries(filtered);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('commission_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;

      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // DEMO MODE: Just update local state
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        setInquiries(inquiries.map(i => 
          i.id === id ? { ...i, status: newStatus } : i
        ));
        return;
      }

      const { error } = await supabase
        .from('commission_inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setInquiries(inquiries.map(i => 
        i.id === id ? { ...i, status: newStatus } : i
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteInquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      // DEMO MODE: Just remove from local state
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const isDemo = !supabaseUrl || supabaseUrl.includes('your-project');
      
      if (isDemo) {
        alert('✅ DEMO MODE: In production, this would delete from database.');
        setInquiries(inquiries.filter(i => i.id !== id));
        return;
      }

      const { error } = await supabase
        .from('commission_inquiries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setInquiries(inquiries.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      new: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
    };
    
    const labels = {
      new: '📧 New',
      in_progress: '⏳ In Progress',
      completed: '✅ Completed',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getProjectTypeLabel = (type) => {
    const labels = {
      mural: '🎨 Mural',
      branding: '🏷️ Branding',
      'concept-design': '💡 Concept Design',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-warm-white">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-warm-white font-display text-3xl font-bold mb-2">
            Commission Inquiries
          </h1>
          <p className="text-muted-gray">
            {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'} total
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['all', 'new', 'in_progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded text-sm font-medium whitespace-nowrap ${
                filter === status
                  ? 'bg-warm-white text-near-black'
                  : 'bg-charcoal text-warm-white/70 hover:text-warm-white border border-white/10'
              }`}
            >
              {status === 'all' ? 'All' : status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        {inquiries.length === 0 ? (
          <div className="text-center py-16 bg-charcoal border border-white/10 rounded-lg">
            <p className="text-muted-gray text-lg mb-2">
              No inquiries {filter !== 'all' ? `in ${filter.replace('_', ' ')}` : 'yet'}
            </p>
            <p className="text-muted-gray text-sm">
              Commission requests from your website will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-charcoal border border-white/10 rounded-lg p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-warm-white text-lg font-semibold">{inquiry.name}</h3>
                      {getStatusBadge(inquiry.status)}
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-gray">
                        📧 <a href={`mailto:${inquiry.email}`} className="hover:text-warm-white">{inquiry.email}</a>
                      </p>
                      <p className="text-muted-gray">
                        📞 <a href={`tel:${inquiry.phone}`} className="hover:text-warm-white">{inquiry.phone}</a>
                      </p>
                      <p className="text-muted-gray">
                        {getProjectTypeLabel(inquiry.project_type)}
                      </p>
                      <p className="text-muted-gray">
                        🗓️ {format(new Date(inquiry.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <select
                      value={inquiry.status}
                      onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                      className="px-3 py-2 bg-near-black border border-white/20 text-warm-white text-sm rounded hover:border-warm-white"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => deleteInquiry(inquiry.id)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 text-sm rounded hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-near-black rounded p-4 mb-3">
                  <p className="text-warm-white text-sm whitespace-pre-wrap">{inquiry.message}</p>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-gray">Budget:</span>
                    <span className="text-warm-white ml-2">{inquiry.budget_range}</span>
                  </div>
                  <div>
                    <span className="text-muted-gray">Timeline:</span>
                    <span className="text-warm-white ml-2">{inquiry.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
