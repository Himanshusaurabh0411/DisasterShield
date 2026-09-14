import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
        <ShieldAlert className="h-10 w-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
          404: SECTOR NOT LOCATED
        </span>
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
          PAGE NOT FOUND
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          The requested crisis frequency or tactical URL does not exist or has been relocated to an
          alternate sector.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="gap-2 border-white/10 text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back
        </Button>
        <Button
          variant="emergency"
          onClick={() => navigate('/')}
          className="gap-2"
        >
          Return to HQ
        </Button>
      </div>
    </div>
  );
}
