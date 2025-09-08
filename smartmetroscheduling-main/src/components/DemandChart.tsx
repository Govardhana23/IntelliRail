import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface DemandChartProps {
  demandData: Record<string, Record<string, number>>;
  hours: number[];
  currentHour?: number;
}

export const DemandChart = ({ demandData, hours, currentHour }: DemandChartProps) => {
  // Transform data for Recharts
  const chartData = hours.map(hour => {
    const dataPoint: any = { hour: `${hour}:00` };
    
    Object.entries(demandData).forEach(([lineId, lineDemand]) => {
      dataPoint[`Line ${lineId}`] = lineDemand[hour.toString()] || 0;
    });
    
    return dataPoint;
  });

  const lineColors = ['#0EA5E9', '#06B6D4', '#8B5CF6', '#EC4899', '#F59E0B'];
  const lines = Object.keys(demandData);

  return (
    <motion.div 
      className="metro-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold text-foreground mb-4">
        Predicted Passenger Demand
      </h3>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="hour" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => currentHour && value.includes(currentHour.toString()) ? `${value} ⭐` : value}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--card-foreground))'
              }}
            />
            <Legend />
            {lines.map((lineId, index) => (
              <Bar
                key={lineId}
                dataKey={`Line ${lineId}`}
                fill={lineColors[index % lineColors.length]}
                name={`Line ${lineId}`}
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};