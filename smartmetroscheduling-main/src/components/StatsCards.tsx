import { motion } from 'framer-motion';
import { Train, Clock, TrendingUp, Building } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total_trains_used: number;
    peak_hour: number;
  };
  totalDepots: number;
  totalLines: number;
}

export const StatsCards = ({ stats, totalDepots, totalLines }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total Trains Scheduled',
      value: stats.total_trains_used,
      icon: Train,
      color: 'text-primary'
    },
    {
      title: 'Peak Hour',
      value: `${stats.peak_hour}:00`,
      icon: Clock,
      color: 'text-warning'
    },
    {
      title: 'Active Depots',
      value: totalDepots,
      icon: Building,
      color: 'text-success'
    },
    {
      title: 'Metro Lines',
      value: totalLines,
      icon: TrendingUp,
      color: 'text-accent-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.title}
            className="metro-stats-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-center mb-2">
              <IconComponent className={`w-8 h-8 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">
              {card.value}
            </div>
            <div className="text-sm text-muted-foreground">
              {card.title}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};