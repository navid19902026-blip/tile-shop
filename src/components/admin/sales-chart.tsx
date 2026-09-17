"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatToman } from "@/lib/utils";

export default function SalesChart({ data }: { data: { date: string; amount: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c1652a" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#c1652a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} stroke="#94a3b8" />
        <YAxis
          fontSize={11}
          tickLine={false}
          axisLine={false}
          stroke="#94a3b8"
          width={40}
          allowDecimals={false}
          tickFormatter={(v) => (v === 0 ? "0" : `${Math.round(v / 1000000)}M`)}
        />
        <Tooltip
          formatter={(value) => [formatToman(Number(value)), "فروش"]}
          contentStyle={{ borderRadius: 12, border: "1px solid #f1f5f9", fontSize: 12, direction: "rtl" }}
        />
        <Area type="monotone" dataKey="amount" stroke="#c1652a" strokeWidth={2} fill="url(#salesGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
