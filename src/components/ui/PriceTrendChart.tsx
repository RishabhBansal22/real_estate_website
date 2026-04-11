"use client";

import { PureComponent } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatIndianCurrency } from '@/lib/utils';

export default function PriceTrendChart({ propertyTitle }: { propertyTitle: string }) {
  // Generate pseudo-mock historical data for specific property
  const seed = propertyTitle.length;
  const basePrice = (seed % 10 + 1) * 100000;
  
  const data = [
    { year: '2020', price: basePrice * 0.8 },
    { year: '2021', price: basePrice * 0.95 },
    { year: '2022', price: basePrice * 1.1 },
    { year: '2023', price: basePrice * 1.3 },
    { year: '2024', price: basePrice * 1.5 },
    { year: '2025 (Forecast)', price: basePrice * 1.7 },
  ];

  return (
    <div className="h-[300px] w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Market Price Trend</h3>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="year" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}
            dy={10}
          />
          <YAxis 
            hide 
            domain={['dataMin - 10000', 'dataMax + 10000']} 
          />
          <Tooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
            formatter={(value: any) => [formatIndianCurrency(Number(value)), 'Value']}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
