import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Chart = ({ data }) => {
    if (!data || data.length === 0) {
      return <p>No data available</p>;
    }

    const formattedData = data.map(item => ({
      name: item.priority,  // Use priority as the name on the X-axis
      total: item.count,    // Use count as the total value
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray="3 3" />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
