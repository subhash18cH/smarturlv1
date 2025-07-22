import { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import Sidebar from './sidebar';
import { api } from './api';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

export interface DeviceClicks {
  [device: string]: number;
}

export interface BackendResponse {
  deviceClicksArray: { deviceClicks: DeviceClicks }[];
  total_clicks: number;
  total_links: number;
}

interface DailyClick {
  date: string;
  clickCount: number;
}

export interface FinalData {
  total_clicks: number;
  total_links: number;
  deviceType: DeviceClicks;
}

const AnalyticsPage = () => {

  const [deviceStats, setDeviceStats] = useState<FinalData | null>(null);
  const [dailyClicks, setDailyClicks] = useState<DailyClick[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getDailyClicks = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/api/url/daily-clicks');
      if (response.status === 200) {
        setDailyClicks(response.data);
      }
    } catch (error) {
      console.error('Error fetching device data:', error);
    } finally {
      setLoading(false);
    }
  }

  const timeData = {
    labels: dailyClicks.map(item =>
      new Date(item.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short'
      })
    ),
    datasets: [
      {
        label: 'Clicks+scans',
        data: dailyClicks.map(item => item.clickCount),
        borderColor: 'rgb(116, 110, 168)',
        tension: 0.3,
        fill: false
      }
    ]
  };
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          title: (context: any) => `${context[0].label}`,
          label: (context: any) => `Clicks+scans: ${context.raw}`
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Clicks'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };



  const fetchDeviceData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/api/url/device-stats');
      const resData = response.data;

      const deviceType: Record<string, number> = {};

      (resData.deviceClicksArray as DeviceClicks[]).forEach(item => {
        for (const [device, count] of Object.entries(item.deviceClicks)) {
          deviceType[device] = (deviceType[device] || 0) + count;
        }
      });

      const final: FinalData = {
        total_clicks: resData.total_clicks,
        total_links: resData.total_links,
        deviceType
      };

      setDeviceStats(final);
      console.log("dddddd", deviceStats);

      console.log(final);
    } catch (error) {
      console.error('Error fetching device data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deviceData = {
    labels: Object.keys(deviceStats?.deviceType || {}),
    datasets: [
      {
        data: Object.values(deviceStats?.deviceType || {}),
        backgroundColor: [
          'rgba(75, 117, 163)',
          'rgba(81, 197, 164)',
          'rgba(16, 185, 129, 0.8)'
        ],
        borderColor: [
          'rgb(75, 117, 163)',
          'rgb(81, 197, 164)',
          'rgb(16, 185, 129)'
        ],
        borderWidth: 1,
        hoverOffset: 15
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };

  useEffect(() => {
    fetchDeviceData();
    getDailyClicks();
  }, []);



  const processMonthlyData = () => {
    const monthlyAggregates: { [month: string]: number } = {};
    dailyClicks.forEach(({ date, clickCount }) => {
      const monthKey = new Date(date).toLocaleString('default', { month: 'short' });
      monthlyAggregates[monthKey] = (monthlyAggregates[monthKey] || 0) + clickCount;
    });

    return {
      labels: Object.keys(monthlyAggregates),
      datasets: [
        {
          label: 'Monthly Clicks',
          data: Object.values(monthlyAggregates),
          backgroundColor: 'rgba(116, 110, 168, 0.5)',
          borderColor: 'rgb(116, 110, 168)',
          borderWidth: 1,
          barPercentage: 0.1,
          categoryPercentage: 0.7
        }
      ]
    };
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Clicks'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Sidebar />
      <div className="sm:ml-52 p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">

          {/* Device Pie Chart */}
          <Card className="lg:col-span-6 p-4 sm:p-6 md:p-7 mt-12">
            <h3 className="font-semibold text-lg sm:text-xl mb-4 sm:mb-5">
              Clicks + scans by device
            </h3>
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold text-gray-700">
                    {deviceStats?.total_links ?? 0}

                  </p>
                  <p className="text-sm text-gray-500">Clicks+scans</p>
                </div>
                <div className="h-[300px] sm:h-[350px] md:h-[380px]">
                  <Doughnut data={deviceData} options={doughnutOptions} />
                </div>
              </>
            )}
          </Card>

          {/* Line Chart */}
          <Card className="lg:col-span-6 p-4 sm:p-6 mt-12">
            <h3 className="font-semibold text-lg sm:text-xl mb-20">
              Clicks + scans Over Time
            </h3>
            <div className="h-[300px] sm:h-[350px] md:h-[380px] ">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : dailyClicks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No click data yet.
                </div>
              ) : (
                <Line data={timeData} options={lineOptions} />
              )}
            </div>
          </Card>

          {/* Monthly Bar Chart */}
          <Card className="lg:col-span-12 p-4 sm:p-6 mt-12">
            <h3 className="font-semibold text-lg sm:text-xl mb-4">
              Monthly Clicks + scans
            </h3>
            <div className="h-[300px] sm:h-[350px] md:h-[380px]">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <Bar data={processMonthlyData()} options={barOptions} />
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
