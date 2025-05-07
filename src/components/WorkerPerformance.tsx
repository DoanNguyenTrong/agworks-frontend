import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkerApplication, WorkerTask } from "@/lib/types";
import { StatusType } from "@/lib/utils/constant";
import { get, groupBy, isEmpty } from "lodash";
import { useEffect, useState } from "react";
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

interface WorkerPerformanceProps {
  tasks?: WorkerTask[];
  image?: any[];
  worker?: WorkerApplication[];
  payRate?: number;
}

export default function WorkerPerformance({
  tasks,
  worker = [],
  image = [],
  payRate = 0,
}: WorkerPerformanceProps) {
  const [WorkerPerformance, setWorkerPerformance] = useState([]);
  const [DailyProgress, setDailyProgress] = useState([]);

  const totalEarnings = (listImage: any, listTask: any) => {
    // Calculate total earnings from all completed tasks
    let earnings = 0;
    listImage.forEach((image: any) => {
      const currentTask = listTask.filter((t) => t?._id === image?.taskId?._id);
      if (currentTask) {
        earnings += get(currentTask, "[0]orderId.payRate", 0);
      }
    });
    return earnings;
  };

  useEffect(() => {
    const workerMap = groupBy(image, (item: any) => item?.taskId?._id);

    const completedItems = tasks.filter(
      (item) => get(item, "status", null) === StatusType.COMPLETED
    );
    const groupedByDate = groupBy(completedItems, (item: WorkerTask) =>
      get(item, "createdAt", "").slice(0, 10)
    );

    //Worker Performance
    // console.log("workerMap :>> ", workerMap, image);
    if (!isEmpty(workerMap)) {
      const result = [];
      for (const [_, data] of Object.entries(workerMap)) {
        // console.log("data :>> ", data);
        const convertData = {
          id: get(data, "[0]._id", "-"),
          name: get(data, "[0].workerId.name"),
          tasks: data.length,
          earnings: totalEarnings(image, tasks).toFixed(2),
        };
        result.push(convertData);
        // console.log("convertData :>> ", convertData);
      }
      setWorkerPerformance(result);
    }

    // Daily Progress
    if (!isEmpty(groupedByDate)) {
      // console.log("groupedByDate :>> ", groupedByDate);
      const result = [];
      for (const [key, data] of Object.entries(groupedByDate)) {
        const convertData = {
          date: key,
          tasks: data.length,
        };
        result.push(convertData);
      }
      setDailyProgress(result);
    }
  }, [image, tasks]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{worker?.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Per Worker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {worker.length > 0 ? Math.round(tasks.length / worker.length) : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${payRate.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Worker Performance</CardTitle>
            <CardDescription>Tasks completed by each worker</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={WorkerPerformance}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "tasks") return [`${value} tasks`, "Tasks"];
                      if (name === "earnings")
                        return [
                          `$${
                            typeof value === "number" ? value.toFixed(2) : value
                          }`,
                          "Earnings",
                        ];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Bar dataKey="tasks" name="Tasks" fill="#8884d8" />
                  <Bar dataKey="earnings" name="Earnings ($)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Progress</CardTitle>
            <CardDescription>Tasks completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DailyProgress}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} tasks`, "Tasks"]} />
                  <Bar dataKey="tasks" name="Tasks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
