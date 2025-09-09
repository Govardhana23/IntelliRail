import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface SimulationClockProps {
  hours: number[];
  currentHour: number;
  onHourChange: (hour: number) => void;
  isRunning: boolean;
  onToggleSimulation: () => void;
  onReset: () => void;
}

export const SimulationClock = ({
  hours,
  currentHour,
  onHourChange,
  isRunning,
  onToggleSimulation,
  onReset
}: SimulationClockProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            const currentIndex = hours.indexOf(currentHour);
            const nextIndex = (currentIndex + 1) % hours.length;
            onHourChange(hours[nextIndex]);
            return 0;
          }
          return prev + 2; // 5 seconds per hour (2% every 100ms)
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, currentHour, hours, onHourChange]);

  const currentIndex = hours.indexOf(currentHour);
  const progressPercentage = ((currentIndex + progress / 100) / hours.length) * 100;

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getTimeOfDay = (hour: number) => {
    if (hour >= 7 && hour <= 9) return { label: 'Morning Rush', color: 'bg-warning' };
    if (hour >= 17 && hour <= 19) return { label: 'Evening Rush', color: 'bg-destructive' };
    if (hour >= 12 && hour <= 14) return { label: 'Lunch Rush', color: 'bg-primary' };
    return { label: 'Normal Operations', color: 'bg-success' };
  };

  const timeInfo = getTimeOfDay(currentHour);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="metro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Live Simulation
            <Badge variant="secondary" className={`ml-auto ${timeInfo.color} text-white`}>
              {timeInfo.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Time Display */}
          <motion.div 
            className="text-center space-y-2"
            key={currentHour}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-6xl font-bold text-primary">
              {formatHour(currentHour)}
            </div>
            <div className="text-sm text-muted-foreground">
              Hour {currentIndex + 1} of {hours.length}
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatHour(hours[0])}</span>
              <span>{formatHour(hours[hours.length - 1])}</span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary/80"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.2 }}
              />
              {/* Hour markers */}
              {hours.map((hour, index) => (
                <div
                  key={hour}
                  className="absolute top-0 h-full w-0.5 bg-background"
                  style={{ left: `${(index / hours.length) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Hour Timeline */}
          <div className="flex justify-between items-center">
            {hours.map((hour, index) => (
              <motion.button
                key={hour}
                className={`
                  flex flex-col items-center p-2 rounded-lg transition-all duration-200
                  ${hour === currentHour 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : 'hover:bg-muted'
                  }
                `}
                onClick={() => onHourChange(hour)}
                whileHover={{ scale: hour === currentHour ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="text-xs font-medium">{formatHour(hour)}</span>
                <div className={`w-2 h-2 rounded-full mt-1 ${
                  hour === currentHour ? 'bg-primary-foreground' : 'bg-muted-foreground'
                }`} />
              </motion.button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <Button
              onClick={onToggleSimulation}
              className="flex items-center gap-2"
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start
                </>
              )}
            </Button>
          </div>

          {/* Real-time progress indicator */}
          {isRunning && (
            <motion.div 
              className="text-center text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="inline-block w-2 h-2 bg-success rounded-full mr-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Simulation running - {Math.round(progress)}% to next hour
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};