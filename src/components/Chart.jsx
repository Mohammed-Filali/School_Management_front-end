import React from "react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
  Sector,
  Line,
  LineChart
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// For pie charts with active sector
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-medium">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export const BarChartComponent = ({ data, xKey = 'name', yKey = 'value', colors = COLORS, horizontal = false, title = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {title && <h4 className="text-center font-medium mb-2 text-gray-700 dark:text-gray-300">{title}</h4>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          {horizontal ? (
            <>
              <YAxis type="category" dataKey={xKey} />
              <XAxis type="number">
                <Label value={yKey} offset={-15} position="insideBottom" />
              </XAxis>
            </>
          ) : (
            <>
              <XAxis dataKey={xKey}>
                <Label value={xKey} offset={-10} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value={yKey} angle={-90} position="insideLeft" />
              </YAxis>
            </>
          )}
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
          />
          <Legend />
          {Array.isArray(yKey) ? (
            yKey.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                name={key}
              />
            ))
          ) : (
            <Bar
              dataKey={yKey}
              fill={colors[0]}
              name={yKey}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const PieChartComponent = ({ 
  data, 
  dataKey = 'value', 
  nameKey = 'name', 
  colors = COLORS, 
  title = '',
  showActiveShape = false,
  legendPosition = 'bottom'
}) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {title && <h4 className="text-center font-medium mb-2 text-gray-700 dark:text-gray-300">{title}</h4>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {showActiveShape ? (
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey={dataKey}
              nameKey={nameKey}
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          ) : (
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          )}
          <Tooltip 
            formatter={(value, name, props) => [
              value, 
              `${(props.payload.percent * 100).toFixed(2)}%`
            ]}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
          />
          <Legend 
            layout={legendPosition === 'side' ? 'vertical' : 'horizontal'}
            verticalAlign={legendPosition === 'side' ? 'middle' : 'bottom'}
            align="center"
            wrapperStyle={{
              paddingTop: legendPosition === 'bottom' ? '20px' : '0'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const LineChartComponent = ({ data, xKey = 'name', yKey = 'value', colors = COLORS, title = '' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      {title && <h4 className="text-center font-medium mb-2 text-gray-700 dark:text-gray-300">{title}</h4>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey={xKey}>
            <Label value={xKey} offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value={yKey} angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
          />
          <Legend />
          {Array.isArray(yKey) ? (
            yKey.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                name={key}
              />
            ))
          ) : (
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={colors[0]}
              activeDot={{ r: 8 }}
              name={yKey}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Default export for backward compatibility
export const Chart = ({ data }) => {
  return <BarChartComponent data={data} />;
};