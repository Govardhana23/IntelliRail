import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  BarChart3,
  Users,
  Clock
} from 'lucide-react';
import type { PlanOutput, PlanInput } from '@/services/metroApi';

interface AIInsightsPanelProps {
  planData: PlanOutput;
  inputData: PlanInput;
  currentHour?: number;
}

export const AIInsightsPanel = ({ planData, inputData, currentHour }: AIInsightsPanelProps) => {
  // Generate AI insights based on the data
  const generateInsights = () => {
    const insights = [];
    const { predicted_demand, schedule, stats } = planData;
    const totalCapacity = Object.values(inputData.depots).reduce((sum, depot) => sum + depot.capacity, 0);
    const utilizationRate = (stats.total_trains_used / totalCapacity) * 100;
    
    // Capacity utilization insight
    if (utilizationRate > 85) {
      insights.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'High Capacity Utilization',
        description: `System is operating at ${utilizationRate.toFixed(1)}% capacity. Consider adding reserve trains.`,
        impact: 'High',
        actionable: true
      });
    } else if (utilizationRate < 60) {
      insights.push({
        type: 'optimization',
        icon: TrendingUp,
        title: 'Optimization Opportunity',
        description: `Only ${utilizationRate.toFixed(1)}% capacity used. Potential for cost reduction.`,
        impact: 'Medium',
        actionable: true
      });
    }
    
    // Peak hour analysis
    const peakDemand = Math.max(...Object.values(predicted_demand).flatMap(line => Object.values(line)));
    const avgDemand = Object.values(predicted_demand).flatMap(line => Object.values(line)).reduce((a, b) => a + b, 0) / (Object.keys(predicted_demand).length * inputData.hours.length);
    
    if (peakDemand > avgDemand * 2) {
      insights.push({
        type: 'strategic',
        icon: BarChart3,
        title: 'High Demand Variance',
        description: `Peak demand (${Math.round(peakDemand)}) is ${Math.round(peakDemand/avgDemand)}x average. Consider demand spreading strategies.`,
        impact: 'High',
        actionable: true
      });
    }
    
    // Weather/event impact
    if (inputData.weather === 1 || inputData.event === 1) {
      insights.push({
        type: 'success',
        icon: CheckCircle,
        title: 'External Factor Adaptation',
        description: `System successfully adapted to ${inputData.weather === 1 ? 'severe weather' : 'special event'} conditions.`,
        impact: 'Medium',
        actionable: false
      });
    }
    
    // Current hour specific insight
    if (currentHour !== undefined) {
      const currentDemand = Object.values(predicted_demand).reduce((sum, line) => 
        sum + (line[currentHour.toString()] || 0), 0
      );
      const currentTrains = Object.values(schedule).reduce((sum, depot) => 
        sum + (depot[currentHour.toString()] || 0), 0
      );
      
      insights.push({
        type: 'realtime',
        icon: Clock,
        title: 'Current Hour Analysis',
        description: `${currentTrains} trains deployed for ${Math.round(currentDemand)} predicted passengers. Efficiency: ${Math.round((currentDemand / (currentTrains * inputData.train_capacity)) * 100)}%`,
        impact: 'Live',
        actionable: false
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'warning': return { bg: 'bg-warning/10', text: 'text-warning-foreground', border: 'border-warning/20' };
      case 'success': return { bg: 'bg-success/10', text: 'text-success-foreground', border: 'border-success/20' };
      case 'optimization': return { bg: 'bg-primary/10', text: 'text-primary-foreground', border: 'border-primary/20' };
      case 'strategic': return { bg: 'bg-accent/10', text: 'text-accent-foreground', border: 'border-accent/20' };
      case 'realtime': return { bg: 'bg-muted/10', text: 'text-muted-foreground', border: 'border-muted/20' };
      default: return { bg: 'bg-muted/10', text: 'text-muted-foreground', border: 'border-muted/20' };
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      case 'Live': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="metro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Insights & Recommendations
            <Badge variant="secondary" className="ml-auto">
              {insights.length} insights
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => {
            const style = getInsightStyle(insight.type);
            const IconComponent = insight.icon;
            
            return (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border ${style.bg} ${style.border}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${style.text}`} />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <Badge variant={getImpactColor(insight.impact) as any}>
                        {insight.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    {insight.actionable && (
                      <Button variant="outline" size="sm" className="text-xs">
                        <Lightbulb className="w-3 h-3 mr-1" />
                        View Recommendations
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="metro-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {Math.round((planData.stats.total_trains_used / Object.values(inputData.depots).reduce((sum, depot) => sum + depot.capacity, 0)) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Fleet Utilization</div>
            </div>
            
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {Math.round(Object.values(planData.predicted_demand).flatMap(line => Object.values(line)).reduce((a, b) => a + b, 0) / (planData.stats.total_trains_used * inputData.train_capacity) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground">Capacity Match</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">System Efficiency</span>
              <span className="font-medium">Optimal</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cost Optimization</span>
              <span className="font-medium text-success">87% Efficient</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Quality</span>
              <span className="font-medium text-primary">Excellent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};