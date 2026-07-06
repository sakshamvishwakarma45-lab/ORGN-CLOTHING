'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Period = '7d' | '30d';

export function SalesChart({ data }: { data: { date: string; sales: number }[] }) {
  const [period, setPeriod] = useState<Period>('30d');

  const filteredData = period === '7d' ? data.slice(-7) : data;

  return (
    <div className="border-2 border-ink bg-offwhite p-5 shadow-orgn-sm transition-shadow hover:shadow-orgn">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Sales Overview</p>
        <div className="flex gap-1 rounded-lg bg-ink/5 p-1">
          {([
            { key: '7d' as Period, label: '7 Days' },
            { key: '30d' as Period, label: '30 Days' },
          ]).map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-all ${
                period === p.key ? 'bg-ink text-beige shadow-sm' : 'text-ink/50 hover:text-ink'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF4B1F" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#FF4B1F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#0A0A0A" strokeOpacity={0.06} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#0A0A0A80' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#0A0A0A80' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v === 0 ? '0' : `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#0A0A0A',
                border: 'none',
                borderRadius: '8px',
                fontSize: 12,
                color: '#FAF9F6',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              }}
              itemStyle={{ color: '#FF4B1F' }}
              formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Sales']}
              cursor={{ stroke: '#FF4B1F', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#FF4B1F"
              strokeWidth={2.5}
              fill="url(#salesFill)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
