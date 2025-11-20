'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownToLine, ArrowUpFromLine, Plus, Undo2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  getOfficeTransactions,
  getDistributionHistory,
  getReturnHistory,
  type OfficeTransaction,
} from "@/services/office_distribution_service";

export default function OfficeDistributionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [allTransactions, setAllTransactions] = useState<OfficeTransaction[]>([]);
  const [distributions, setDistributions] = useState<OfficeTransaction[]>([]);
  const [returns, setReturns] = useState<OfficeTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "distributions" | "returns">("all");

  useEffect(() => {
    if (user?.officeId) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    if (!user?.officeId) return;
    
    setLoading(true);
    try {
      const officeId = parseInt(user.officeId);
      const [all, dists, rets] = await Promise.all([
        getOfficeTransactions(officeId),
        getDistributionHistory(officeId),
        getReturnHistory(officeId),
      ]);
      setAllTransactions(all);
      setDistributions(dists);
      setReturns(rets);
    } catch (error) {
      console.error("Error loading transactions:", error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = (transactions: OfficeTransaction[]) => {
    if (!searchTerm) return transactions;
    
    const term = searchTerm.toLowerCase();
    return transactions.filter(t => 
      t.itemName.toLowerCase().includes(term) ||
      t.itemCode.toLowerCase().includes(term) ||
      t.referenceNumber.toLowerCase().includes(term) ||
      t.fromOfficeName.toLowerCase().includes(term) ||
      t.toOfficeName.toLowerCase().includes(term)
    );
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      COMPLETED: { variant: "default", label: "Completed" },
      PENDING: { variant: "secondary", label: "Pending" },
      APPROVED: { variant: "default", label: "Approved" },
      REJECTED: { variant: "destructive", label: "Rejected" },
      CANCELLED: { variant: "outline", label: "Cancelled" },
    };
    
    const { variant, label } = statusMap[status] || { variant: "outline", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getTransactionTypeBadge = (type: string) => {
    if (type === "DISTRIBUTION") {
      return <Badge className="bg-blue-500"><ArrowDownToLine className="mr-1 h-3 w-3" />Distribution</Badge>;
    } else if (type === "RETURN") {
      return <Badge className="bg-orange-500"><ArrowUpFromLine className="mr-1 h-3 w-3" />Return</Badge>;
    }
    return <Badge variant="outline">{type}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTransactionTable = (transactions: OfficeTransaction[]) => {
    const filtered = filterTransactions(transactions);
    
    if (loading) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          Loading transactions...
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reference</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Initiated By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-mono text-xs">
                {transaction.referenceNumber}
              </TableCell>
              <TableCell>{getTransactionTypeBadge(transaction.transactionType)}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{transaction.itemName}</div>
                  <div className="text-xs text-muted-foreground">{transaction.itemCode}</div>
                </div>
              </TableCell>
              <TableCell>{transaction.quantity}</TableCell>
              <TableCell>
                <div className="text-sm">{transaction.fromOfficeName}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{transaction.toOfficeName}</div>
              </TableCell>
              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
              <TableCell className="text-sm">
                {formatDate(transaction.transactionDate)}
              </TableCell>
              <TableCell className="text-sm">
                {transaction.initiatedByUserName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Office Item Distributions</h1>
        <p className="text-muted-foreground mt-2">
          Manage item distributions between parent and child offices
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-4">
        <Button onClick={() => router.push("/office-distributions/distribute")}>
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Distribute to Child Office
        </Button>
        <Button onClick={() => router.push("/office-distributions/return")} variant="outline">
          <Undo2 className="mr-2 h-4 w-4" />
          Return to Parent Office
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by item, reference, or office..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions ({allTransactions.length})</SelectItem>
            <SelectItem value="distributions">Distributions ({distributions.length})</SelectItem>
            <SelectItem value="returns">Returns ({returns.length})</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === "all" && "All Transactions"}
            {activeTab === "distributions" && "Distribution History"}
            {activeTab === "returns" && "Return History"}
          </CardTitle>
          <CardDescription>
            {activeTab === "all" && "Complete history of distributions and returns for your office"}
            {activeTab === "distributions" && "Items distributed from this office to child offices"}
            {activeTab === "returns" && "Items returned to this office from child offices"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeTab === "all" && renderTransactionTable(allTransactions)}
          {activeTab === "distributions" && renderTransactionTable(distributions)}
          {activeTab === "returns" && renderTransactionTable(returns)}
        </CardContent>
      </Card>
    </div>
  );
}
