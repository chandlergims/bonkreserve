'use client';

import { X, Users, Target, Vault, Gift } from 'phosphor-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md p-5 rounded-xl bg-white shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <X size={20} weight="bold" />
        </button>

        <h2 className="text-lg font-bold text-gray-900 mb-4">How It Works</h2>
        
        <div className="space-y-4 text-xs text-gray-700">
          {/* Join Pools */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-2">
              <Users size={18} weight="regular" className="text-gray-900" />
              Join Acquisition Pools (Free)
            </h3>
            <p>
              Browse rare Pokemon cards and join acquisition pools at no cost. Free participation grants you proportional rewards when we successfully acquire and control card supply.
            </p>
          </div>

          {/* Pool Activation */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-2">
              <Target size={18} weight="regular" className="text-gray-900" />
              Strategic Acquisition
            </h3>
            <p>
              Once a pool reaches 50 participants, it becomes an Active Target. We systematically acquire cards using USD1 treasury funds, creating market positioning and value for all participants.
            </p>
          </div>

          {/* Treasury & Token Control */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-2">
              <Vault size={18} weight="regular" className="text-gray-900" />
              Token Supply Control
            </h3>
            <p>
              Platform launches USD1-based token with controlled supply. Revenue from strategic token sales and trading fees funds card acquisitions. 70% active deployment, 30% tax reserve.
            </p>
          </div>

          {/* Participant Rewards */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5 flex items-center gap-2">
              <Gift size={18} weight="regular" className="text-gray-900" />
              Earn Rewards
            </h3>
            <p>
              Pool participants receive proportional rewards through card distribution or USD1 profit sharing. Benefit directly from successful acquisitions and market appreciation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
