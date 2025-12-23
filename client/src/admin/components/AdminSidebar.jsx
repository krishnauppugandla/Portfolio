import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Rocket, Briefcase, GraduationCap, Award, Zap, MessageSquare, Settings, LogOut } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

const NAV = [
  { to: '/admin/dashboard',       icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/projects',        icon: Rocket,          label: 'Projects' },
  { to: '/admin/experience',      icon: Briefcase,       label: 'Experience' },
  { to: '/admin/education',       icon: GraduationCap,   label: 'Education' },
  { to: '/admin/certifications',  icon: Award,           label: 'Certifications' },
  { to: '/admin/skills',          icon: Zap,             label: 'Skills' },
  { to: '/admin/messages',        icon: MessageSquare,   label: 'Messages' },
  { to: '/admin/settings',        icon: Settings,        label: 'Settings' },
];

export default function AdminSidebar({ unreadCount = 0 }) {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <aside className="w-60 bg-white border-r border-border flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <span className="font-display font-bold text-lg text-ink">
          RK<span className="text-blue">.</span>
          <span className="font-body font-normal text-muted text-sm ml-2">Admin</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm font-medium transition-all duration-150
               ${isActive
                 ? 'bg-blue-bg text-blue'
                 : 'text-muted hover:text-ink hover:bg-background-alt'}`
            }
          >
            <Icon size={16} />
            <span className="flex-1">{label}</span>
            {label === 'Messages' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-mono font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted hover:text-red-500 hover:bg-red-50 w-full font-body text-sm font-medium transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
