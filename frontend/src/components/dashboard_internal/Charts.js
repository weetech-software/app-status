import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useUserDispatch, signOut } from "../../context/UserContext";
import { routes } from "../../core/config";

import {
   LineChart,
   Line,
   AreaChart,
   Area,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
   Scatter,
   ScatterChart,
   RadarChart,
   PolarGrid,
   PolarAngleAxis,
   PolarRadiusAxis,
   Radar,
} from "recharts";

const data = [
   {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
   },
   {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
   },
   {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
   },
   {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
   },
   {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
   },
   {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
   },
   {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
   },
];

function groupByKey(array, key) {
   return array.reduce((hash, obj) => {
      if (obj[key] === undefined) return hash;
      return Object.assign(hash, {
         [obj[key]]: (hash[obj[key]] || []).concat(obj),
      });
   }, []);
}

const ChartAreaStacked = ({
   serverHostname,
   selectedMonScript,
   selectedMonScriptDescription,
}) => {
   return (
      <AreaChart
         width={500}
         height={400}
         data={data}
         margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
         }}
      >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="name" />
         <YAxis />
         <Tooltip />
         <Area
            type="monotone"
            dataKey="uv"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
         />
         <Area
            type="monotone"
            dataKey="pv"
            stackId="1"
            stroke="#82ca9d"
            fill="#82ca9d"
         />
         <Area
            type="monotone"
            dataKey="amt"
            stackId="1"
            stroke="#ffc658"
            fill="#ffc658"
         />
      </AreaChart>
   );
};

const ChartArea = ({
   serverHostname,
   selectedMonScript,
   selectedMonScriptDescription,
   setOpenSnackbar,
}) => {
   const [, setIsDataLoading] = useState(false);
   const [graphData, setGraphData] = useState([]);

   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const getData = () => {
      setIsDataLoading(true);
      console.log("called getData " + selectedMonScript);
      fetch(
         `${process.env.REACT_APP_API_URL}/api/dashboard-internal/get-server-data?host=${serverHostname}&description=${selectedMonScriptDescription}&rra=hourly&file=${selectedMonScript}`,
         {
            headers: { "x-access-token": localStorage.getItem("bearerToken") },
         }
      )
         .then(function (response) {
            if (response.ok) {
               return response;
            } else {
               response.json().then((json) => {
                  if (json.message === "Token is expired") {
                     const navigateState = {
                        state: { message: "session expired" },
                     };
                     signOut(
                        userDispatch,
                        navigate,
                        routes.login.key,
                        navigateState
                     );
                  } else if (json.message === "not authorize to access") {
                     const navigateState = {
                        state: { message: "not authorize to access" },
                     };
                     signOut(
                        userDispatch,
                        navigate,
                        routes.login.key,
                        navigateState
                     );
                  } else {
                     const navigateState = {
                        state: { message: "unauth" },
                     };
                     signOut(
                        userDispatch,
                        navigate,
                        routes.login.key,
                        navigateState
                     );
                  }
               });
            }
         })
         .then((data) => data.json())
         .then((data) => setGraphData(data))
         .finally(() => setIsDataLoading(false));
   };

   useEffect(() => {
      if (selectedMonScript && selectedMonScriptDescription) {
         getData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedMonScript, selectedMonScriptDescription]);

   return (
      <AreaChart
         width={1000}
         height={400}
         data={graphData}
         margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
         }}
      >
         <text
            x={500 / 2}
            y={20}
            fill="black"
            textAnchor="middle"
            dominantBaseline="central"
         >
            <tspan fontSize="14">
               {selectedMonScript} - {selectedMonScriptDescription}
            </tspan>
         </text>
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="dataTime" />
         <YAxis />
         <Tooltip />
         <Legend />
         <Area
            type="monotone"
            dataKey="avgValue"
            stroke="#8884d8"
            fill="#8884d8"
         />
      </AreaChart>
   );
};

const ChartLine = ({
   serverHostname,
   selectedMonScript,
   selectedMonScriptDescription,
   period,
   width = 800,
   height = 400,
}) => {
   const [, setIsDataLoading] = useState(false);
   const [graphData, setGraphData] = useState([]);
   const [servers, setServers] = useState([]);

   const navigate = useNavigate();
   var userDispatch = useUserDispatch();

   const getData = () => {
      if (selectedMonScript && selectedMonScriptDescription) {
         setIsDataLoading(true);
         console.log("called getData " + selectedMonScript);
         const promises = servers.map((server) =>
            fetch(
               `${process.env.REACT_APP_API_URL}/api/dashboard-internal/get-server-data?host=${server}&description=${selectedMonScriptDescription}&rra=${period}&file=${selectedMonScript}`,
               {
                  headers: {
                     "x-access-token": localStorage.getItem("bearerToken"),
                  },
               }
            )
               .then(function (response) {
                  if (response.ok) {
                     return response;
                  } else {
                     response.json().then((json) => {
                        if (json.message === "Token is expired") {
                           const navigateState = {
                              state: { message: "session expired" },
                           };
                           signOut(
                              userDispatch,
                              navigate,
                              routes.login.key,
                              navigateState
                           );
                        } else if (json.message === "not authorize to access") {
                           const navigateState = {
                              state: { message: "not authorize to access" },
                           };
                           signOut(
                              userDispatch,
                              navigate,
                              routes.login.key,
                              navigateState
                           );
                        } else {
                           const navigateState = {
                              state: { message: "unauth" },
                           };
                           signOut(
                              userDispatch,
                              navigate,
                              routes.login.key,
                              navigateState
                           );
                        }
                     });
                  }
               })
               .then((data) => data.json())
         );
         Promise.all(promises)
            .then((results) => {
               if (results.length === 1) {
                  setGraphData(results[0]);
               } else {
                  const consolidatedData = [];
                  for (let [index, result] of results.entries()) {
                     for (const res of result) {
                        const row = {
                           [`${servers[index]}|lastValue`]: res.lastValue,
                           dataTime: res.dataTime,
                        };
                        consolidatedData.push(row);
                     }
                  }
                  const groupData = groupByKey(consolidatedData, "dataTime");
                  const datas = [];
                  for (const key in groupData) {
                     datas.push(
                        groupData[key].reduce((accumulator, currentValue) =>
                           Object.assign({}, accumulator, currentValue)
                        )
                     );
                  }
                  setGraphData(datas);
               }
            })
            .finally(() => setIsDataLoading(false));
      }
   };

   useEffect(() => {
      if (serverHostname && serverHostname.trim().length > 0) {
         if (serverHostname.includes(",")) {
            setServers(serverHostname.split(","));
         } else {
            setServers([serverHostname]);
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [serverHostname]);

   useEffect(() => {
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [servers, selectedMonScript, selectedMonScriptDescription, period]);

   return (
      <>
         <ResponsiveContainer width={width} height={height}>
            <LineChart
               data={graphData}
               margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
               }}
            >
               <text
                  x={500 / 2}
                  y={20}
                  fill="black"
                  textAnchor="middle"
                  dominantBaseline="central"
               >
                  <tspan fontSize="14">
                     {selectedMonScript} - {selectedMonScriptDescription}
                  </tspan>
               </text>
               <CartesianGrid strokeDasharray="3 3" />
               <XAxis dataKey="dataTime" />
               <YAxis />
               <Tooltip />
               <Legend />
               {servers.length > 1 ? (
                  servers.map((server, idx) => {
                     const graphKey = `${server}|lastValue`;
                     const color = `#${Math.floor(
                        Math.random() * 16777215
                     ).toString(16)}`;
                     return (
                        <Line
                           key={idx}
                           type="monotone"
                           dataKey={graphKey}
                           stroke={color}
                        />
                     );
                  })
               ) : (
                  <>
                     <Line
                        type="monotone"
                        dataKey="avgValue"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                     />
                     <Line
                        type="monotone"
                        dataKey="lastValue"
                        stroke="#82ca9d"
                     />
                  </>
               )}
            </LineChart>
         </ResponsiveContainer>
      </>
   );
};

const ChartScatter = ({ chartData }) => {
   return (
      <ResponsiveContainer width="100%" height={400}>
         <ScatterChart
            margin={{
               top: 20,
               right: 20,
               bottom: 20,
               left: 20,
            }}
         >
            <CartesianGrid />
            <XAxis
               type={chartData.xaxis.type}
               dataKey={chartData.xaxis.dataKey}
               name={chartData.xaxis.name}
               unit={chartData.xaxis.unit}
               allowDuplicatedCategory={false}
            />
            <YAxis
               type={chartData.yaxis.type}
               dataKey={chartData.yaxis.dataKey}
               name={chartData.yaxis.name}
               unit={chartData.yaxis.unit}
            />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            {chartData.datas.map((row_data, idx) => {
               return (
                  <Scatter
                     key={idx}
                     name={row_data.name}
                     data={row_data.data}
                     fill={row_data.color}
                  />
               );
            })}
         </ScatterChart>
      </ResponsiveContainer>
   );
};

const ChartRadar = ({ chartData }) => {
   return (
      <ResponsiveContainer width="100%" height={400}>
         <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData.data}>
            <PolarGrid />
            <PolarAngleAxis dataKey={chartData.dataKey} />
            <PolarRadiusAxis angle={30} domain={["auto", "auto"]} />
            {chartData.metaData.map((row_data, idx) => {
               return (
                  <Radar
                     key={idx}
                     name={row_data.name}
                     dataKey={row_data.dataKey}
                     stroke={row_data.stroke}
                     fill={row_data.color}
                     fillOpacity={0.6}
                  />
               );
            })}
            <Legend />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
         </RadarChart>
      </ResponsiveContainer>
   );
};

export { ChartLine, ChartArea, ChartAreaStacked, ChartScatter, ChartRadar };
