import { motion } from 'framer-motion';
import { Calendar, Cloud, CalendarDays, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface WhatIfControlPanelProps {
  weekday: number;
  weather: number;
  event: number;
  onWeekdayChange: (value: number) => void;
  onWeatherChange: (value: number) => void;
  onEventChange: (value: number) => void;
}

const weekdayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const WhatIfControlPanel = ({
  weekday,
  weather,
  event,
  onWeekdayChange,
  onWeatherChange,
  onEventChange
}: WhatIfControlPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="metro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            What-If Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weekday Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Day of Week
            </Label>
            <Select value={weekday.toString()} onValueChange={(value) => onWeekdayChange(Number(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {weekdayNames.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weather Conditions */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Weather Impact
            </Label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {weather === 0 ? 'Clear Weather' : 'Severe Weather'}
              </span>
              <Switch
                checked={weather === 1}
                onCheckedChange={(checked) => onWeatherChange(checked ? 1 : 0)}
              />
            </div>
            {weather === 1 && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-warning-foreground bg-warning/10 p-2 rounded"
              >
                +40% demand increase expected
              </motion.p>
            )}
          </div>

          {/* Special Events */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Special Events
            </Label>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {event === 0 ? 'Normal Operations' : 'Major Event Active'}
              </span>
              <Switch
                checked={event === 1}
                onCheckedChange={(checked) => onEventChange(checked ? 1 : 0)}
              />
            </div>
            {event === 1 && (
              <motion.p 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-xs text-success-foreground bg-success/10 p-2 rounded"
              >
                +60% demand surge anticipated
              </motion.p>
            )}
          </div>

          {/* Impact Summary */}
          <motion.div 
            className="pt-4 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-sm text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>Base Demand Multiplier:</span>
                <span className="font-medium">
                  {((weekday === 0 || weekday === 6 ? 0.6 : 1) * 
                    (weather === 1 ? 1.4 : 1) * 
                    (event === 1 ? 1.6 : 1)).toFixed(1)}x
                </span>
              </div>
              <div className="flex justify-between">
                <span>Schedule Type:</span>
                <span className="font-medium">
                  {weekday === 0 || weekday === 6 ? 'Weekend' : 'Weekday'}
                </span>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};