import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./ChatGraph.css";

interface ChatGraphProps {
  data: {
    name: string;
    chatsAccepted: number;
  }[];
  height?: number;
}

const ChatGraph: React.FC<ChatGraphProps> = ({ data, height = 100 }) => {
  // Find the maximum value in the data
  const maxValue = Math.max(...data.map(item => item.chatsAccepted));
  
  // Set the domain max to be at least 5 or the max value + 1, whichever is greater
  const domainMax = Math.max(5, maxValue + 1);
  
  return (
    <div className="chat-graph">
      <div className="graph-title">Chats Received</div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 8 }} />
          <YAxis 
            tick={{ fontSize: 8 }} 
            domain={[0, domainMax]}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.8)', 
              border: 'none', 
              borderRadius: '4px',
              color: '#76ff9c',
              padding: '4px',
              fontSize: '10px'
            }}
            itemStyle={{ color: '#76ff9c', fontSize: '10px', padding: '1px' }}
            labelStyle={{ color: 'white', fontSize: '10px', padding: '1px' }}
            wrapperStyle={{ zIndex: 100 }}
            formatter={(value) => [`${value} chats`, 'Received']}
          />
          <Line 
            type="monotone" 
            dataKey="chatsAccepted" 
            stroke="#76ff9c" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#76ff9c', stroke: '#000', strokeWidth: 1 }} 
            activeDot={{ r: 5, fill: '#76ff9c', stroke: '#000', strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChatGraph;
