import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon } from 'lucide-react';

const StatsCard = ({ icon: Icon, value, label, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
    >
      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-orange-600" />
      </div>
      <div className="text-3xl font-bold text-gray-800 mb-2">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-gray-600 text-sm font-medium">{label}</div>
    </motion.div>
  );
};

export default StatsCard;