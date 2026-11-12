import { useState } from 'react';
import { Lock, LogOut, Crown, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from './AuthModal';

export default function AuthButton() {
  const { user, isAdmin, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 left-4 z-40">
        {user ? (
          <div className="flex items-center gap-1.5 p-1.5 pl-3 pr-2 rounded-full bg-white/90 border border-rose-100 shadow-md backdrop-blur-sm text-xs font-sans text-midnight">
            {isAdmin ? (
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <Crown size={14} className="text-amber-500" />
                Owner (Admin)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-midnight/80 font-medium">
                <User size={14} className="text-rose-400" />
                {user.name || 'Divya'}
              </span>
            )}
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-full hover:bg-rose-50 text-midnight/40 hover:text-rose-500 transition-colors cursor-pointer"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-rose-100 shadow-sm backdrop-blur-sm text-xs font-sans text-midnight/70 hover:text-midnight transition-all cursor-pointer"
          >
            <Lock size={12} className="text-rose-400" />
            <span>Private Access</span>
          </button>
        )}
      </div>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
