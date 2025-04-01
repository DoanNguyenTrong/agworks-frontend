
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkerTask } from "@/lib/types";
import { format } from "date-fns";

interface WorkerPerformanceProps {
  tasks: WorkerTask[];
  payRate: number;
}

interface WorkerData {
  id: string;
  name: string;
  tasks: number;
  earnings: number;
}

export default function WorkerPerformance({ tasks, payRate }: WorkerPerformanceProps) {
  // Group tasks by worker
  const workerMap = new Map<string, WorkerData>();
  
  tasks.forEach(task => {
    if (!workerMap.has(task.workerId)) {
      workerMap.set(task.workerId, {
        id: task.workerId,
        name: task.workerName,
        tasks: 0,
        earnings: 0
      });
    }
    
    const workerData = workerMap.get(task.workerId)!;
    workerData.tasks += 1;
    workerData.earnings = workerData.tasks * payRate;
  });
  
  const workerData = Array.from(workerMap.values());
  
  // Group tasks by date
  const dateMap = new Map<string, { date: string, tasks: number }>();
  
  tasks.forEach(task => {
    const dateStr = format(new Date(task.completedAt), "MMM d");
    
    if (!dateMap.has(dateStr)) {
      dateMap.set(dateStr, {
        date: dateStr,
        tasks: 0
      });
    }
    
    const dayData = dateMap.get(dateStr)!;
    dayData.tasks += 1;
  });
  
  const dailyData = Array.from(dateMap.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerData.length}</div>
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
            <CardTitle className="text-sm font-medium">Average Per Worker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workerData.length > 0 
                ? Math.round(tasks.length / workerData.length) 
                : 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(tasks.length * payRate).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Worker Performance</CardTitle>
            <CardDescription>
              Tasks completed by each worker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workerData}
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
                      if (name === 'tasks') return [`${value} tasks`, 'Tasks'];
                      if (name === 'earnings') return [`$${value.toFixed(2)}`, 'Earnings'];
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
            <CardDescription>
              Tasks completed per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
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
                  <Tooltip
                    formatter={(value) => [`${value} tasks`, 'Tasks']}
                  />
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
