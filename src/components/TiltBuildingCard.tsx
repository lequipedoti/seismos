import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TiltBuildingCardProps {
  buildingId: string;
  score: number;
  type: string;
  yearBuilt: number;
}

export default function TiltBuildingCard({ buildingId, score, type, yearBuilt }: TiltBuildingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // Mouse position relative to card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring values for smooth animation
  const rotateX = useSpring(0, { mass: 0.1, stiffness: 150, damping: 15 });
  const rotateY = useSpring(0, { mass: 0.1, stiffness: 150, damping: 15 });
  const scale = useSpring(1, { mass: 0.1, stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalize to -0.5 to 0.5
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;
    
    // Apply rotation (inverted for natural feel)
    rotateX.set(normalizedY * 15);
    rotateY.set(normalizedX * -15);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Score color calculation
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    if (score >= 40) return 'from-orange-400 to-red-500';
    return 'from-red-400 to-pink-500';
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 40) return 'Poor';
    return 'Critical';
  };

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* 3D Shadow */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/20 to-transparent rounded-2xl pointer-events-none" />
      
      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-2xl overflow-hidden">
        
        {/* Glare Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.2 : 1
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-slate-400 to-transparent rounded-2xl blur-xl" />
          <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-30 blur-xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-lg">{buildingId}</h3>
              <p className="text-slate-400 text-sm">{type}</p>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-xs">Built</div>
              <div className="text-white font-semibold">{yearBuilt}</div>
            </div>
          </div>

          {/* Damage Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm font-medium">Structural Integrity</span>
              <span className="text-white font-bold text-lg">{score}%</span>
            </div>
            
            {/* Score Bar */}
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${getScoreColor(score)}`}
                initial={{ width: '0%' }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            
            {/* Status Text */}
            <div className={`text-xs font-semibold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : score >= 40 ? 'text-orange-400' : 'text-red-400'}`}>
              {getScoreText(score)}
            </div>
          </div>

          {/* Hover Details */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-2 border-t border-slate-600/50"
            >
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Risk Level:</span>
                  <span className={score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                    {score >= 80 ? 'Low' : score >= 60 ? 'Medium' : 'High'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Inspection:</span>
                  <span className="text-blue-400">Required</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent via-blue-400/20 to-transparent rounded-bl-2xl" />
        
        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
      </div>

      {/* Floating Indicator */}
      <motion.div
        className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 1
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}