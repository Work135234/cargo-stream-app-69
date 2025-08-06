import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const { toast } = useToast();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [reportType, setReportType] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [transportFilter, setTransportFilter] = useState("all");

  const reportData = {
    summary: {
      totalBookings: 1247,
      totalRevenue: 125480.50,
      averageOrderValue: 100.63,
      completionRate: 96.8
    },
    statusBreakdown: [
      { status: "Delivered", count: 1207, percentage: 96.8 },
      { status: "In Transit", count: 25, percentage: 2.0 },
      { status: "Pending", count: 15, percentage: 1.2 }
    ],
    transportBreakdown: [
      { mode: "Truck", count: 756, revenue: 75600, percentage: 60.6 },
      { mode: "Train", count: 491, revenue: 49880, percentage: 39.4 }
    ],
    monthlyTrends: [
      { month: "Jan", bookings: 98, revenue: 9800 },
      { month: "Feb", bookings: 142, revenue: 14200 },
      { month: "Mar", bookings: 186, revenue: 18600 },
      { month: "Apr", bookings: 203, revenue: 20300 },
      { month: "May", bookings: 195, revenue: 19500 },
      { month: "Jun", bookings: 167, revenue: 16700 }
    ]
  };

  const handleGenerateReport = () => {
    if (!reportType) {
      toast({
        title: "Select Report Type",
        description: "Please select a report type to generate",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `${reportType} report has been generated successfully`,
    });
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting report in ${format.toUpperCase()} format...`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground">
          Generate detailed reports and view business insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reportData.summary.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${reportData.summary.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+3%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.summary.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+1.2%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Custom Report</CardTitle>
          <CardDescription>Select filters and parameters for your report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="bookings">Bookings Report</SelectItem>
                  <SelectItem value="performance">Performance Report</SelectItem>
                  <SelectItem value="customer">Customer Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status Filter</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="transit">In Transit</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Transport Mode</label>
              <Select value={transportFilter} onValueChange={setTransportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All modes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "From"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleGenerateReport}>Generate Report</Button>
            <Button variant="outline" onClick={() => handleExportReport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExportReport("excel")}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Breakdown of delivery statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.statusBreakdown.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.count}</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transport Mode Revenue</CardTitle>
            <CardDescription>Revenue breakdown by transport type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.transportBreakdown.map((item) => (
                <div key={item.mode} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.mode}</span>
                    <span className="text-sm">${item.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.count} bookings</span>
                    <span>{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}