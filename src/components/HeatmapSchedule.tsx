import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train } from 'lucide-react';

interface HeatmapScheduleProps {
  schedule: Record<string, Record<string, number>>;
  hours: number[];
  currentHour?: number;
}

export const HeatmapSchedule = ({ schedule, hours, currentHour }: HeatmapScheduleProps) => {
  const depots = Object.keys(schedule);
  
  // Calculate the maximum trains for color scaling
  const allValues = Object.values(schedule).flatMap(depot => Object.values(depot));
  const maxTrains = Math.max(...allValues, 1);
  
  const getIntensityColor = (trains: number) => {
    const intensity = trains / maxTrains;
    if (intensity === 0) return 'bg-muted/20';
    if (intensity <= 0.3) return 'bg-success/30';
    if (intensity <= 0.6) return 'bg-warning/40';
    if (intensity <= 0.8) return 'bg-primary/50';
    return 'bg-destructive/60';
  };

  const getTextColor = (trains: number) => {
    const intensity = trains / maxTrains;
    return intensity > 0.5 ? 'text-white' : 'text-foreground';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="metro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Train className="w-5 h-5 text-primary" />
            Train Induction Heatmap
            <Badge variant="secondary" className="ml-auto">
              {depots.length} Depots
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <span className="text-sm font-medium">Intensity:</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-success/30 rounded"></div>
                  <span className="text-xs">Low</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-warning/40 rounded"></div>
                  <span className="text-xs">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-primary/50 rounded"></div>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-destructive/60 rounded"></div>
                  <span className="text-xs">Peak</span>
                </div>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Hour Headers */}
                <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(80px,1fr))] gap-2 mb-2">
                  <div className="font-medium text-sm text-muted-foreground p-2">
                    Depot
                  </div>
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className={`text-center p-2 text-sm font-medium rounded ${
                        currentHour === hour
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {hour}:00
                    </div>
                  ))}
                </div>

                {/* Depot Rows */}
                {depots.map((depot, depotIndex) => (
                  <motion.div
                    key={depot}
                    className="grid grid-cols-[120px_repeat(auto-fit,minmax(80px,1fr))] gap-2 mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: depotIndex * 0.1 }}
                  >
                    {/* Depot Label */}
                    <div className="flex items-center p-2 font-medium">
                      <div className="text-sm">Depot {depot}</div>
                    </div>

                    {/* Hour Cells */}
                    {hours.map((hour, hourIndex) => {
                      const trains = schedule[depot]?.[hour.toString()] || 0;
                      return (
                        <motion.div
                          key={`${depot}-${hour}`}
                          className={`
                            relative p-3 rounded-lg text-center font-semibold text-sm
                            ${getIntensityColor(trains)} ${getTextColor(trains)}
                            ${currentHour === hour ? 'ring-2 ring-primary ring-offset-2' : ''}
                            transition-all duration-200 hover:scale-105
                          `}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: (depotIndex * hours.length + hourIndex) * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span>{trains}</span>
                            {trains > 0 && (
                              <Train className="w-3 h-3 opacity-70" />
                            )}
                          </div>
                          
                          {/* Tooltip effect */}
                          <div className="absolute inset-0 rounded-lg bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {trains} trains @ {hour}:00
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between pt-4 border-t border-border text-sm text-muted-foreground">
              <span>
                Total Operations: {Object.values(schedule).reduce((total, depot) => 
                  total + Object.values(depot).reduce((sum, trains) => sum + trains, 0), 0
                )} trains
              </span>
              <span>
                Peak Deployment: {maxTrains} trains/hour
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};