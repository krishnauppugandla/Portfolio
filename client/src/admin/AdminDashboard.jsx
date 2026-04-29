import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Briefcase, MessageSquare, Eye, Plus } from 'lucide-react';
import { adminGetProjects } from '../api/admin.api';
import { adminGetExperience, adminGetMessages } from '../api/admin.api';
import { incrementVisitors } from '../api/public.api'; // removed getSettings, using context now

function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-bg text-blue',
    green: 'bg-green-bg text-green',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-500',
  };
  return (
    <div className="bg-white border border-border rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="font-mono text-xs text-muted">{label}</p>
        <p className="font-display font-bold text-2xl text-ink">
          {value === null ? <span className="w-10 h-6 skeleton inline-block rounded" /> : value}
        </p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: null, experience: null, messages: null, visitors: null });
  const [recentMessages, setRecentMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.allSettled([
      adminGetProjects(),
      adminGetExperience(),
      adminGetMessages(),
    ]).then(([proj, exp, msg]) => {
      const messages = msg.status === 'fulfilled' ? msg.value : [];
      setStats({
        projects: proj.status === 'fulfilled' ? proj.value.length : '?',
        experience: exp.status === 'fulfilled' ? exp.value.length : '?',
        messages: messages.filter((m) => !m.read).length,
        visitors: null,
      });
      setRecentMessages(messages.slice(0, 5));
    });

    incrementVisitors().then((d) => {
      setStats((s) => ({ ...s, visitors: d.count }));
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Rocket}       label="Total Projects"     value={stats.projects}   color="blue"   />
        <StatCard icon={Briefcase}    label="Experience Entries" value={stats.experience}  color="green"  />
        <StatCard icon={MessageSquare} label="Unread Messages"   value={stats.messages}   color="orange" />
        <StatCard icon={Eye}          label="Total Visitors"     value={stats.visitors}   color="purple" />
      </div>

      {/* Recent messages */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-ink text-base">Recent Messages</h2>
          <button
            onClick={() => navigate('/admin/messages')}
            className="text-blue font-body text-sm hover:underline"
          >
            View all →
          </button>
        </div>

        {recentMessages.length === 0 ? (
          <p className="text-muted font-body text-sm text-center py-6">No messages yet</p>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => navigate('/admin/messages')}
                className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer hover:bg-background-alt transition-colors ${!msg.read ? 'font-semibold' : ''}`}
              >
                <div className="w-8 h-8 bg-blue-bg rounded-full flex items-center justify-center flex-shrink-0 text-blue font-display font-bold text-sm">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-body text-sm text-ink font-medium">{msg.name}</span>
                    {!msg.read && <span className="w-2 h-2 bg-blue rounded-full flex-shrink-0" />}
                  </div>
                  <p className="font-body text-xs text-muted truncate">{msg.message}</p>
                </div>
                <span className="font-mono text-xs text-light whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-border rounded-2xl p-6">
        <h2 className="font-display font-bold text-ink text-base mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/admin/projects')} className="btn-primary">
            <Plus size={14} /> Add Project
          </button>
          <button onClick={() => navigate('/admin/experience')} className="btn-secondary">
            <Plus size={14} /> Add Experience
          </button>
        </div>
      </div>
    </div>
  );
}
