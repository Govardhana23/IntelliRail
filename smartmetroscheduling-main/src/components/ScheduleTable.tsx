import { motion } from 'framer-motion';

interface ScheduleTableProps {
  schedule: Record<string, Record<string, number>>;
  hours: number[];
}

export const ScheduleTable = ({ schedule, hours }: ScheduleTableProps) => {
  const depots = Object.keys(schedule);

  return (
    <motion.div 
      className="metro-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-foreground mb-4">
        Train Induction Schedule
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="metro-table-header">
              <th className="text-left p-3 rounded-tl-lg">Depot</th>
              {hours.map(hour => (
                <th key={hour} className="text-center p-3">
                  {hour}:00
                </th>
              ))}
              <th className="text-center p-3 rounded-tr-lg">Total</th>
            </tr>
          </thead>
          <tbody>
            {depots.map((depotId, depotIndex) => {
              const totalTrains = hours.reduce((sum, hour) => 
                sum + (schedule[depotId][hour.toString()] || 0), 0
              );
              
              return (
                <motion.tr
                  key={depotId}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.4 + depotIndex * 0.1 
                  }}
                >
                  <td className="font-semibold text-foreground p-3">
                    Depot {depotId}
                  </td>
                  {hours.map(hour => {
                    const trains = schedule[depotId][hour.toString()] || 0;
                    return (
                      <td key={hour} className="text-center p-3">
                        <motion.span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            trains > 0 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted text-muted-foreground'
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ 
                            duration: 0.2, 
                            delay: 0.6 + depotIndex * 0.1 + hours.indexOf(hour) * 0.05 
                          }}
                        >
                          {trains}
                        </motion.span>
                      </td>
                    );
                  })}
                  <td className="text-center p-3 font-bold text-primary">
                    {totalTrains}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};