import React from 'react';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

const FWI_SCALE = [
  { class: 0, range: '<5.2', level: 'Very Low', color: '#126E00' },
  { class: 1, range: '5.2-11.2', level: 'Low', color: '#FFEB3B' },
  { class: 2, range: '11.2-21.3', level: 'Moderate', color: '#ED8E3E' },
  { class: 3, range: '21.3-38.0', level: 'High', color: '#FF0000' },
  { class: 4, range: '38.0-50.0', level: 'Very High', color: '#890000' },
  { class: 5, range: '≥50', level: 'Extreme', color: '#4A0404' }
];

const getLegendDescription = (level) => {
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
    <div className="absolute bottom-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-10 w-10 rounded-full shadow-lg bg-white hover:bg-gray-100"
          >
            <Info className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-4" 
          side="left"
          align="end"
        >
          <h4 className="text-lg font-semibold mb-4">Fire Weather Index (FWI) Legend</h4>
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
                  <div className="font-medium">Class {classNum}: {level}</div>
                  <div className="text-sm text-gray-600">
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
