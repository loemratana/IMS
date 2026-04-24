
import React from 'react';
import { StockMovement } from '@/pages/inventory/mockData';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Settings2, 
  Repeat,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  movements: StockMovement[];
}

const StockHistoryTimeline: React.FC<Props> = ({ movements }) => {
  const getIcon = (type: StockMovement['type']) => {
    switch (type) {
      case 'IN': return <ArrowUpCircle className="h-4 w-4 text-emerald-600" />;
      case 'OUT': return <ArrowDownCircle className="h-4 w-4 text-rose-600" />;
      case 'ADJUST': return <Settings2 className="h-4 w-4 text-amber-600" />;
      case 'TRANSFER': return <Repeat className="h-4 w-4 text-blue-600" />;
    }
  };

  const getBg = (type: StockMovement['type']) => {
    switch (type) {
      case 'IN': return 'bg-emerald-50';
      case 'OUT': return 'bg-rose-50';
      case 'ADJUST': return 'bg-amber-50';
      case 'TRANSFER': return 'bg-blue-50';
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
      {movements.map((move, index) => (
        <div key={move.id} className="relative pl-10">
          <div className={`absolute left-0 top-0 h-9 w-9 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-950 ${getBg(move.type)} shadow-sm z-10`}>
            {getIcon(move.type)}
          </div>
          
          <div className="bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-bold text-foreground">
                {move.type === 'IN' ? 'Restocked' : move.type === 'OUT' ? 'Stock Reduction' : 'Stock Adjustment'}
                <span className={`ml-2 ${move.quantity > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {move.quantity > 0 ? '+' : ''}{move.quantity} Items
                </span>
              </span>
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                {format(new Date(move.date), 'MMM dd, yyyy • hh:mm a')}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 italic">"{move.reason}"</p>
            <div className="flex items-center text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <Circle className="h-2 w-2 fill-slate-300 dark:fill-slate-700 mr-2" />
              Performed by <span className="font-semibold text-slate-500 dark:text-slate-400 ml-1">{move.user}</span>
            </div>
          </div>
        </div>
      ))}
      
      {movements.length === 0 && (
        <div className="text-center py-10">
          <p className="text-slate-400 text-sm">No transaction history found.</p>
        </div>
      )}
    </div>
  );
};

export default StockHistoryTimeline;
