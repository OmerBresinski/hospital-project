import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis, Cell, CartesianGrid } from 'recharts';
import { useIncidentStats } from '@/hooks/queries';
import { StatCard } from '@/components/dashboard';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { FileText, FileCheck, FileClock } from 'lucide-react';

// Chart colors from CSS variables
const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function DashboardPage() {
  const { t } = useTranslation();
  const { data: stats, isLoading, isError, error } = useIncidentStats();

  // Transform stats data for charts - memoized to prevent rerenders
  const chartData = useMemo(() => {
    if (!stats) return null;

    // By Type data
    const byTypeData = Object.entries(stats.byType).map(([type, count], index) => ({
      type,
      label: t(`form.incidentType.${type}`),
      count,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

    // By Status data
    const byStatusData = Object.entries(stats.byStatus).map(([status, count], index) => ({
      status,
      label: t(`form.status.${status === 'waiting_for_approval' ? 'waitingForApproval' : status}`),
      count,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

    // By Month data (sorted by date)
    const byMonthData = Object.entries(stats.byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // Last 12 months
      .map(([month, count]) => ({
        month,
        label: month,
        count,
      }));

    // By Reporter data (top 5)
    const byReporterData = Object.entries(stats.byReporter)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count], index) => ({
        name,
        count,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      }));

    // By Department data
    const byDepartmentData = Object.entries(stats.byDepartment).map(([dept, count], index) => ({
      department: dept,
      label: t(`form.departments.${dept}`),
      count,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));

    return {
      byTypeData,
      byStatusData,
      byMonthData,
      byReporterData,
      byDepartmentData,
    };
  }, [stats, t]);

  // Chart configs
  const typeChartConfig: ChartConfig = {
    count: {
      label: t('dashboard.incidentsByType'),
    },
  };

  const statusChartConfig: ChartConfig = {
    count: {
      label: t('dashboard.incidentsByStatus'),
    },
  };

  const monthChartConfig: ChartConfig = {
    count: {
      label: t('dashboard.incidentsByMonth'),
      color: CHART_COLORS[0],
    },
  };

  const reporterChartConfig: ChartConfig = {
    count: {
      label: t('dashboard.incidentsByReporter'),
    },
  };

  const departmentChartConfig: ChartConfig = {
    count: {
      label: t('dashboard.incidentsByDepartment'),
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-4">{t('common.error')}</p>
        <p className="text-muted-foreground text-sm">{error?.message}</p>
      </div>
    );
  }

  const openCount = stats?.byStatus?.open || 0;
  const closedCount = stats?.byStatus?.closed || 0;
  const waitingCount = stats?.byStatus?.waiting_for_approval || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title={t('dashboard.totalIncidents')}
          value={stats?.total || 0}
          icon={FileText}
        />
        <StatCard
          title={t('dashboard.openIncidents')}
          value={openCount + waitingCount}
          icon={FileClock}
        />
        <StatCard
          title={t('dashboard.closedIncidents')}
          value={closedCount}
          icon={FileCheck}
        />
      </div>

      {/* Charts Grid */}
      {chartData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Incidents by Type - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.incidentsByType')}</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.byTypeData.length > 0 ? (
                <ChartContainer config={typeChartConfig} className="h-[200px]">
                  <BarChart data={chartData.byTypeData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="label"
                      type="category"
                      width={80}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="count" radius={4}>
                      {chartData.byTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t('common.noResults')}</p>
              )}
            </CardContent>
          </Card>

          {/* Incidents by Status - Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.incidentsByStatus')}</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.byStatusData.length > 0 ? (
                <ChartContainer config={statusChartConfig} className="h-[200px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={chartData.byStatusData}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                    >
                      {chartData.byStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="label" />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t('common.noResults')}</p>
              )}
            </CardContent>
          </Card>

          {/* Incidents by Department - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.incidentsByDepartment')}</CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.byDepartmentData.length > 0 ? (
                <ChartContainer config={departmentChartConfig} className="h-[200px]">
                  <BarChart data={chartData.byDepartmentData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="label"
                      type="category"
                      width={80}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="count" radius={4}>
                      {chartData.byDepartmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t('common.noResults')}</p>
              )}
            </CardContent>
          </Card>

          {/* Incidents by Month - Line Chart */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.incidentsByMonth')}</CardTitle>
              <CardDescription>
                {chartData.byMonthData.length > 0
                  ? `${chartData.byMonthData[0]?.month} - ${chartData.byMonthData[chartData.byMonthData.length - 1]?.month}`
                  : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.byMonthData.length > 0 ? (
                <ChartContainer config={monthChartConfig} className="h-[200px]">
                  <LineChart data={chartData.byMonthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => value.split('-')[1]}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={CHART_COLORS[0]}
                      strokeWidth={2}
                      dot={{ fill: CHART_COLORS[0] }}
                    />
                  </LineChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t('common.noResults')}</p>
              )}
            </CardContent>
          </Card>

          {/* Incidents by Reporter - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('dashboard.incidentsByReporter')}</CardTitle>
              <CardDescription>Top 5</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.byReporterData.length > 0 ? (
                <ChartContainer config={reporterChartConfig} className="h-[200px]">
                  <BarChart data={chartData.byReporterData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={80}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        value.length > 10 ? `${value.substring(0, 10)}...` : value
                      }
                    />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="count" radius={4}>
                      {chartData.byReporterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              ) : (
                <p className="text-muted-foreground text-center py-8">{t('common.noResults')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {(!chartData ||
        (chartData.byTypeData.length === 0 &&
          chartData.byStatusData.length === 0 &&
          chartData.byDepartmentData.length === 0)) && (
        <div className="text-center py-8 text-muted-foreground">
          {t('common.noResults')}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
