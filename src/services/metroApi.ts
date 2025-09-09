// Mock API service that simulates the FastAPI backend
export interface DepotData {
  capacity: number;
  available_trains: number;
  max_induct_per_hour: number;
}

export interface PlanInput {
  lines: Record<string, number[]>;
  hours: number[];
  weekday: number;
  weather: number;
  event: number;
  depots: Record<string, DepotData>;
  train_capacity: number;
}

export interface PlanOutput {
  predicted_demand: Record<string, Record<string, number>>;
  schedule: Record<string, Record<string, number>>;
  stats: {
    total_trains_used: number;
    peak_hour: number;
  };
}

// Simulated machine learning prediction algorithm
function predictPassengerDemand(
  lines: Record<string, number[]>,
  hours: number[],
  weekday: number,
  weather: number,
  event: number
): Record<string, Record<string, number>> {
  const demand: Record<string, Record<string, number>> = {};
  
  Object.keys(lines).forEach(lineId => {
    demand[lineId] = {};
    const stations = lines[lineId];
    
    hours.forEach(hour => {
      // Base demand calculation considering rush hours
      let baseDemand = stations.length * 300; // 300 passengers per station base
      
      // Rush hour multipliers
      if (hour >= 7 && hour <= 9) baseDemand *= 2.5; // Morning rush
      else if (hour >= 17 && hour <= 19) baseDemand *= 2.2; // Evening rush
      else if (hour >= 12 && hour <= 14) baseDemand *= 1.3; // Lunch rush
      
      // Weekend reduction
      if (weekday === 0 || weekday === 6) baseDemand *= 0.6;
      
      // Weather impact
      if (weather === 1) baseDemand *= 1.4; // Bad weather increases metro usage
      
      // Event impact
      if (event === 1) baseDemand *= 1.6; // Special events increase demand
      
      // Add some randomness for realism
      const variation = 0.8 + Math.random() * 0.4; // ±20% variation
      demand[lineId][hour.toString()] = Math.round(baseDemand * variation);
    });
  });
  
  return demand;
}

// Train scheduling algorithm
function scheduleTrains(
  demand: Record<string, Record<string, number>>,
  depots: Record<string, DepotData>,
  trainCapacity: number,
  hours: number[]
): Record<string, Record<string, number>> {
  const schedule: Record<string, Record<string, number>> = {};
  const depotIds = Object.keys(depots);
  
  // Initialize schedule
  depotIds.forEach(depotId => {
    schedule[depotId] = {};
    hours.forEach(hour => {
      schedule[depotId][hour.toString()] = 0;
    });
  });
  
  // Calculate total trains needed per hour across all lines
  const totalTrainsNeeded: Record<string, number> = {};
  hours.forEach(hour => {
    let totalDemand = 0;
    Object.values(demand).forEach(lineDemand => {
      totalDemand += lineDemand[hour.toString()] || 0;
    });
    totalTrainsNeeded[hour.toString()] = Math.ceil(totalDemand / trainCapacity);
  });
  
  // Distribute trains to depots
  hours.forEach(hour => {
    const neededTrains = totalTrainsNeeded[hour.toString()];
    let remainingTrains = neededTrains;
    
    // Sort depots by capacity (largest first)
    const sortedDepots = depotIds.sort((a, b) => 
      depots[b].capacity - depots[a].capacity
    );
    
    sortedDepots.forEach(depotId => {
      if (remainingTrains > 0) {
        const depot = depots[depotId];
        const maxCanProvide = Math.min(
          depot.max_induct_per_hour,
          depot.available_trains,
          remainingTrains
        );
        
        schedule[depotId][hour.toString()] = maxCanProvide;
        remainingTrains -= maxCanProvide;
      }
    });
  });
  
  return schedule;
}

// Mock API delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runAutoPlan(input: PlanInput): Promise<PlanOutput> {
  // Simulate API call delay
  await delay(1500 + Math.random() * 1000); // 1.5-2.5 seconds
  
  const predictedDemand = predictPassengerDemand(
    input.lines,
    input.hours,
    input.weekday,
    input.weather,
    input.event
  );
  
  const schedule = scheduleTrains(
    predictedDemand,
    input.depots,
    input.train_capacity,
    input.hours
  );
  
  // Calculate stats
  let totalTrainsUsed = 0;
  let peakHour = input.hours[0];
  let peakDemand = 0;
  
  Object.values(schedule).forEach(depotSchedule => {
    Object.values(depotSchedule).forEach(trains => {
      totalTrainsUsed += trains;
    });
  });
  
  input.hours.forEach(hour => {
    let hourDemand = 0;
    Object.values(predictedDemand).forEach(lineDemand => {
      hourDemand += lineDemand[hour.toString()] || 0;
    });
    if (hourDemand > peakDemand) {
      peakDemand = hourDemand;
      peakHour = hour;
    }
  });
  
  return {
    predicted_demand: predictedDemand,
    schedule,
    stats: {
      total_trains_used: totalTrainsUsed,
      peak_hour: peakHour
    }
  };
}