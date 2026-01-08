import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAgentCommissions, AgentCommission, CommissionType, CommissionStatus } from '@/hooks/useAgentCommissions';
import { IndianRupee, TrendingUp, Clock, CheckCircle, Users, Home, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const getCommissionTypeLabel = (type: CommissionType) => {
  switch (type) {
    case 'owner_onboarding': return 'Owner Onboarding';
    case 'tenant_placement': return 'Tenant Placement';
    case 'monthly_recurring': return 'Monthly Recurring';
  }
};

const getCommissionTypeIcon = (type: CommissionType) => {
  switch (type) {
    case 'owner_onboarding': return <Users className="h-4 w-4" />;
    case 'tenant_placement': return <Home className="h-4 w-4" />;
    case 'monthly_recurring': return <Calendar className="h-4 w-4" />;
  }
};

const getStatusBadge = (status: CommissionStatus) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    case 'approved':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Approved</Badge>;
    case 'paid':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Paid</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
  }
};

const CommissionCard = ({ commission }: { commission: AgentCommission }) => (
  <Card className="mb-3">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {getCommissionTypeIcon(commission.commission_type)}
          </div>
          <div>
            <p className="font-medium text-sm">{getCommissionTypeLabel(commission.commission_type)}</p>
            <p className="text-xs text-muted-foreground mt-1">{commission.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {format(new Date(commission.created_at), 'dd MMM yyyy')}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-lg flex items-center justify-end">
            <IndianRupee className="h-4 w-4" />
            {commission.commission_amount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{commission.percentage}% of ₹{commission.base_amount.toLocaleString()}</p>
          <div className="mt-1">{getStatusBadge(commission.status)}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const CommissionDashboard = () => {
  const { commissions, summary, isLoading } = useAgentCommissions();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold flex items-center mt-1">
                  <IndianRupee className="h-5 w-5" />
                  {summary.totalEarnings.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold flex items-center mt-1 text-yellow-600">
                  <IndianRupee className="h-5 w-5" />
                  {summary.pendingAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid Out</p>
                <p className="text-2xl font-bold flex items-center mt-1 text-green-600">
                  <IndianRupee className="h-5 w-5" />
                  {summary.paidAmount.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold flex items-center mt-1">
                  <IndianRupee className="h-5 w-5" />
                  {commissions
                    .filter(c => {
                      const date = new Date(c.created_at);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    })
                    .reduce((sum, c) => sum + c.commission_amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner Onboarding (10%)</p>
                <p className="text-xl font-semibold flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {summary.onboardingCommissions.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Home className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tenant Placement (15%)</p>
                <p className="text-xl font-semibold flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {summary.placementCommissions.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Recurring (5%)</p>
                <p className="text-xl font-semibold flex items-center">
                  <IndianRupee className="h-4 w-4" />
                  {summary.monthlyCommissions.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commission History */}
      <Card>
        <CardHeader>
          <CardTitle>Commission History</CardTitle>
          <CardDescription>Your earnings from all commission sources</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="owner_onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="tenant_placement">Placement</TabsTrigger>
              <TabsTrigger value="monthly_recurring">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {commissions.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No commissions yet. Start onboarding owners to earn!</p>
              ) : (
                commissions.map(c => <CommissionCard key={c.id} commission={c} />)
              )}
            </TabsContent>

            <TabsContent value="owner_onboarding">
              {commissions.filter(c => c.commission_type === 'owner_onboarding').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No owner onboarding commissions yet.</p>
              ) : (
                commissions.filter(c => c.commission_type === 'owner_onboarding').map(c => <CommissionCard key={c.id} commission={c} />)
              )}
            </TabsContent>

            <TabsContent value="tenant_placement">
              {commissions.filter(c => c.commission_type === 'tenant_placement').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No tenant placement commissions yet.</p>
              ) : (
                commissions.filter(c => c.commission_type === 'tenant_placement').map(c => <CommissionCard key={c.id} commission={c} />)
              )}
            </TabsContent>

            <TabsContent value="monthly_recurring">
              {commissions.filter(c => c.commission_type === 'monthly_recurring').length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No monthly recurring commissions yet.</p>
              ) : (
                commissions.filter(c => c.commission_type === 'monthly_recurring').map(c => <CommissionCard key={c.id} commission={c} />)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
