"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '../data/translations';

interface SkillsChartProps {
  title: string;
  skills: Skill[];
}

const SkillsChart: React.FC<SkillsChartProps> = ({ title, skills }) => {
  return (
    <div className="mt-12 p-6 border border-[#2d3748] rounded-lg bg-[#0a0b10]/50 backdrop-blur-sm">
      <h3 className="text-[#bc13fe] font-mono mb-6 flex items-center">
        {/* CORRECCIÓN: &gt; en lugar de > */}
        <span className="mr-2">&gt;</span> {title}
      </h3>
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={skill.name}>
            <div className="flex justify-between text-xs font-mono text-[#94a3b8] mb-1">
              <span>{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00f3ff] to-[#bc13fe]"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: true }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SkillsChart;