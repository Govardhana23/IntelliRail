import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, MapPin, Calendar, Cloud, Sidebar } from 'lucide-react';
import { runAutoPlan, type PlanInput, type PlanOutput } from '@/services/metroApi';
import { DemandChart } from './DemandChart';
import { ScheduleTable } from './ScheduleTable';
import { StatsCards } from './StatsCards';
import { LoadingState } from './LoadingState';
import { WhatIfControlPanel } from './WhatIfControlPanel';
import { HeatmapSchedule } from './HeatmapSchedule';
import { SimulationClock } from './SimulationClock';
import { AIInsightsPanel } from './AIInsightsPanel';

export const MetroDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState<PlanOutput | null>(null);
  const [currentHour, setCurrentHour] = useState(7);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [inputData, setInputData] = useState<PlanInput>({

    lines: {
      "1": [101, 102, 103, 104, 105], // Blue Line - 5 stations
      "2": [201, 202, 203, 204], // Red Line - 4 stations
      "3": [301, 302, 303, 304, 305, 306] // Green Line - 6 stations
    },
    hours: [7, 8, 9, 10, 11, 17, 18, 19, 20], // Rush hours
    weekday: 1, // Monday
    weather: 0, // Clear weather
    event: 0, // No special events
    depots: {
      "101": {
        capacity: 25,
        available_trains: 18,
        max_induct_per_hour: 5
      },
      "102": {
        capacity: 20,
        available_trains: 15,
        max_induct_per_hour: 4
      },
      "103": {
        capacity: 15,
        available_trains: 12,
        max_induct_per_hour: 3
      }
    },
    train_capacity: 1200
  });

  const handleRunAutoPlan = async () => {
    setIsLoading(true);
    try {
      const result = await runAutoPlan(inputData);
      setPlanData(result);
      setCurrentHour(inputData.hours[0]);
    } catch (error) {
      console.error('Failed to run auto plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeekdayChange = (weekday: number) => {
    setInputData(prev => ({ ...prev, weekday }));
  };

  const handleWeatherChange = (weather: number) => {
    setInputData(prev => ({ ...prev, weather }));
  };

  const handleEventChange = (event: number) => {
    setInputData(prev => ({ ...prev, event }));
  };

  const handleHourChange = (hour: number) => {
    setCurrentHour(hour);
  };

  const handleToggleSimulation = () => {
    setIsSimulationRunning(!isSimulationRunning);
  };

  const handleResetSimulation = () => {
    setIsSimulationRunning(false);
    setCurrentHour(inputData.hours[0]);
  };

  const weekdayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Smart Metro Induction Scheduler
          </h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            AI-powered optimization with real-time simulation and what-if analysis
          </p>
          
          {/* Enhanced Control Panel */}
          <div className="metro-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
                <span>3 Metro Lines • {inputData.hours.length} Hours</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span>{weekdayNames[inputData.weekday]} • {inputData.weekday === 0 || inputData.weekday === 6 ? 'Weekend' : 'Weekday'} Schedule</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Cloud className="w-5 h-5" />
                <span>
                  {inputData.weather === 1 ? 'Severe Weather' : 'Clear Weather'} • 
                  {inputData.event === 1 ? ' Special Event' : ' Normal Operations'}
                </span>
              </div>
            </div>
            
            <motion.button
              className="metro-button-primary inline-flex items-center gap-2"
              onClick={handleRunAutoPlan}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              {isLoading ? 'Planning...' : 'Run Auto Plan'}
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingState key="loading" />
          ) : planData ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Enhanced Layout with Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Panel - Controls */}
                <div className="lg:col-span-1 space-y-6">
                  <WhatIfControlPanel
                    weekday={inputData.weekday}
                    weather={inputData.weather}
                    event={inputData.event}
                    onWeekdayChange={handleWeekdayChange}
                    onWeatherChange={handleWeatherChange}
                    onEventChange={handleEventChange}
                  />
                  
                  <SimulationClock
                    hours={inputData.hours}
                    currentHour={currentHour}
                    onHourChange={handleHourChange}
                    isRunning={isSimulationRunning}
                    onToggleSimulation={handleToggleSimulation}
                    onReset={handleResetSimulation}
                  />
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Stats Cards */}
                  <StatsCards 
                    stats={planData.stats}
                    totalDepots={Object.keys(inputData.depots).length}
                    totalLines={Object.keys(inputData.lines).length}
                  />
                  
                  {/* Demand Chart */}
                  <DemandChart 
                    demandData={planData.predicted_demand}
                    hours={inputData.hours}
                    currentHour={currentHour}
                  />
                  
                  {/* Schedule Visualization Toggle */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Train Schedule</h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowHeatmap(false)}
                          className={`px-3 py-1 rounded text-sm ${!showHeatmap ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        >
                          Table
                        </button>
                        <button
                          onClick={() => setShowHeatmap(true)}
                          className={`px-3 py-1 rounded text-sm ${showHeatmap ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        >
                          Heatmap
                        </button>
                      </div>
                    </div>
                    
                    {showHeatmap ? (
                      <HeatmapSchedule 
                        schedule={planData.schedule}
                        hours={inputData.hours}
                        currentHour={currentHour}
                      />
                    ) : (
                      <ScheduleTable 
                        schedule={planData.schedule}
                        hours={inputData.hours}
                      />
                    )}
                  </div>
                </div>

                {/* Right Panel - AI Insights */}
                <div className="lg:col-span-1">
                  <AIInsightsPanel
                    planData={planData}
                    inputData={inputData}
                    currentHour={currentHour}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              className="metro-card p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Ready to Optimize Metro Operations
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Click "Run Auto Plan" to generate an optimized train induction schedule 
                based on predicted passenger demand, depot constraints, and operational parameters.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="metro-stats-card">
                  <div className="text-lg font-bold text-primary">3</div>
                  <div>Metro Lines</div>
                </div>
                <div className="metro-stats-card">
                  <div className="text-lg font-bold text-primary">{Object.keys(inputData.depots).length}</div>
                  <div>Active Depots</div>
                </div>
                <div className="metro-stats-card">
                  <div className="text-lg font-bold text-primary">{inputData.hours.length}</div>
                  <div>Time Slots</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};