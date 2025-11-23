import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import { apiClient } from '@/lib/api';

const MyInvestments = () => {
    const [investments, setInvestments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalInvested: 0,
        activeInvestments: 0,
        totalReturns: 0
    });

    useEffect(() => {
        loadInvestments();
    }, []);

    const loadInvestments = async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.getMyInvestments();
            setInvestments(Array.isArray(data) ? data : []);

            // Calculate stats
            const total = data.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);
            const active = data.filter((inv: any) => inv.status === 'ACTIVE').length;
            const returns = data.reduce((sum: number, inv: any) => sum + (inv.actual_return || 0), 0);

            setStats({
                totalInvested: total,
                activeInvestments: active,
                totalReturns: returns
            });
        } catch (err) {
            console.error('Failed to load investments:', err);
            setInvestments([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4">
                <h1 className="text-5xl font-light mb-8 glow-text">My Investments</h1>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign className="text-primary" size={24} />
                            <p className="text-muted-foreground">Total Invested</p>
                        </div>
                        <p className="text-4xl font-light">₹{stats.totalInvested.toLocaleString()}</p>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="text-secondary" size={24} />
                            <p className="text-muted-foreground">Active Investments</p>
                        </div>
                        <p className="text-4xl font-light">{stats.activeInvestments}</p>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="text-green-400" size={24} />
                            <p className="text-muted-foreground">Total Returns</p>
                        </div>
                        <p className="text-4xl font-light text-green-400">₹{stats.totalReturns.toLocaleString()}</p>
                    </div>
                </div>

                {/* Investments List */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Loading investments...</p>
                    </div>
                ) : investments.length === 0 ? (
                    <div className="glass rounded-xl p-12 text-center">
                        <p className="text-muted-foreground text-lg mb-4">No investments yet</p>
                        <p className="text-sm text-muted-foreground">
                            Browse projects and start investing to see your portfolio here
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {investments.map((investment) => (
                            <div key={investment._id} className="glass rounded-xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-light mb-1">
                                            {investment.project_title || 'Project'}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Invested on {new Date(investment.investment_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs ${investment.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' :
                                        investment.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {investment.status}
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-1">Amount Invested</p>
                                        <p className="text-lg font-medium">₹{investment.amount.toLocaleString()}</p>
                                    </div>

                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-1">Expected Return</p>
                                        <p className="text-lg font-medium text-green-400">
                                            ₹{investment.expected_return?.toLocaleString() || 'TBD'}
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-1">Actual Return</p>
                                        <p className="text-lg font-medium">
                                            {investment.actual_return ? `₹${investment.actual_return.toLocaleString()}` : 'Pending'}
                                        </p>
                                    </div>

                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-xs text-muted-foreground mb-1">ROI</p>
                                        <p className="text-lg font-medium">
                                            {investment.actual_return
                                                ? `${((investment.actual_return / investment.amount - 1) * 100).toFixed(1)}%`
                                                : 'Pending'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyInvestments;
