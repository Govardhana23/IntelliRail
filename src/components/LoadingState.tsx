import { motion } from 'framer-motion';
import { Loader2, Train } from 'lucide-react';

export const LoadingState = () => {
  return (
    <motion.div 
      className="metro-card p-12 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex items-center justify-center mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Loader2 className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-2">
          Planning Optimal Train Schedule
        </h3>
        <p className="text-muted-foreground mb-4">
          Analyzing passenger demand and depot capacity...
        </p>
      </motion.div>

      <motion.div 
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Train className="w-4 h-4" />
        <span>Processing metro data</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ...
        </motion.span>
      </motion.div>
    </motion.div>
  );
};