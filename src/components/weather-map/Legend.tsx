import React from 'react';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import styles from "./Legend.module.css"

const FWI_SCALE = [
  { class: 0, range: '<5.2', level: 'Very Low', color: '#126E00' },
  { class: 1, range: '5.2-11.2', level: 'Low', color: '#FFEB3B' },
  { class: 2, range: '11.2-21.3', level: 'Moderate', color: '#ED8E3E' },
  { class: 3, range: '21.3-38.0', level: 'High', color: '#FF0000' },
  { class: 4, range: '38.0-50.0', level: 'Very High', color: '#890000' },
  { class: 5, range: '≥50', level: 'Extreme', color: '#4A0404' }
];

const getLegendDescription = (level: string) => {
  switch(level) {
    case 'Very Low':
      return 'Minimal Risk; fires are unlikely to spread significantly.';
    case 'Low':
      return 'Low spread potential; fires generally manageable.';
    case 'Moderate':
      return 'Moderate spread potential; usually manageable under standard conditions.';
    case 'High':
      return 'Significant spread risk; would require more resources to control.';
    case 'Very High':
      return 'Rapid fire spread is likely, with challenging containment.';
    case 'Extreme':
      return 'Fires would spread aggressively and be extremely difficult to control.';
    default:
      return '';
  }
};

export const Legend = () => {
  return (
    <div className="absolute bottom-20 right-4 z-10">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-[#1a1a1a] border-gray-700 hover:bg-[#2a2a2a] hover:border-gray-600"
          >
            <Info className="h-5 w-5 text-gray-300" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-4 bg-[#1a1a1a] border-gray-700 text-gray-100" 
          side="left"
          align="end"
        >
          <h4 className="text-lg font-semibold mb-4 text-white">Fire Weather Index (FWI) Legend</h4>
          <div className="space-y-3">
            {FWI_SCALE.map(({ class: classNum, level, color }) => (
              <div key={classNum} className="flex items-start gap-3">
                <div 
                  className="w-5 h-5 rounded-full mt-1 flex-shrink-0"
                  style={{ 
                    backgroundColor: color,
                    border: color === '#FFEB3B' ? '1px solid #666' : 'none'
                  }}
                />
                <div>
                  <div className="font-medium text-gray-200">Class {classNum}: {level}</div>
                  <div className="text-sm text-gray-400">
                    {getLegendDescription(level)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};