import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, CreditCard } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../lib/api';

interface WalletData {
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  transactions: Transaction[]; // Embedded in backend model
  bank_account_info?: {
    account_holder: string;
    account_number: string;
    bank_name: string;
    ifsc_code: string;
  };
  upi_id?: string;
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  reference_type?: string;
  created_at?: string; // date in backend
  date?: string; // date in sampleData
}

export const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWalletData();
    }
  }, [user]);

  const loadWalletData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/finance/wallet');
      setWallet(response.data);
      if (response.data && response.data.transactions) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Failed to load wallet', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!user || !wallet || !withdrawAmount) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > wallet.balance) {
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTransaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'debit',
      amount,
      description: 'Withdrawal to bank account',
      status: 'pending',
      reference_type: 'payout',
      created_at: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);

    setWallet({
      ...wallet,
      balance: wallet.balance - amount,
      total_withdrawn: wallet.total_withdrawn + amount,
    });

    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse text-[#6CCF93] text-lg">Loading wallet...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">Wallet</h1>
        <p className="text-gray-600">Manage your earnings and withdrawals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Available Balance</p>
              <p className="text-3xl font-bold text-[#2E7D32]">
                ₹{wallet?.balance.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-[#E7F8EF] p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#6CCF93]" />
            </div>
          </div>
          <Button onClick={() => setShowWithdrawModal(true)} className="w-full">
            Withdraw
          </Button>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Earned</p>
              <p className="text-3xl font-bold text-[#2E7D32]">
                ₹{wallet?.total_earned.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Lifetime earnings</p>
        </Card>

        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Withdrawn</p>
              <p className="text-3xl font-bold text-[#2E7D32]">
                ₹{wallet?.total_withdrawn.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600">Total payouts</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#2E7D32]">Transaction History</h2>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                      {transaction.type === 'credit' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2933]">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.created_at || transaction.date || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {transaction.reference_type && (
                          <Badge variant="default" className="text-xs">
                            {transaction.reference_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-lg ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </p>
                    <Badge variant={getStatusVariant(transaction.status)} className="mt-1">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[#2E7D32] mb-6">Payout Methods</h2>

          {wallet?.bank_account_info ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <p className="font-semibold text-[#1F2933]">Bank Account</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Account Holder</p>
                  <p className="font-medium">{wallet.bank_account_info.account_holder}</p>
                </div>
                <div>
                  <p className="text-gray-600">Account Number</p>
                  <p className="font-medium">
                    ****{wallet.bank_account_info.account_number.slice(-4)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Bank Name</p>
                  <p className="font-medium">{wallet.bank_account_info.bank_name}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                Edit Details
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 mb-4 text-center">
              <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No bank account added</p>
              <Button variant="outline" className="w-full">
                Add Bank Account
              </Button>
            </div>
          )}

          {wallet?.upi_id ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-[#1F2933] mb-2">UPI ID</p>
              <p className="text-sm font-medium text-gray-700">{wallet.upi_id}</p>
              <Button variant="outline" className="w-full mt-4">
                Edit UPI
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-gray-600 mb-4">No UPI ID added</p>
              <Button variant="outline" className="w-full">
                Add UPI ID
              </Button>
            </div>
          )}
        </Card>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">Withdraw Funds</h2>
            <p className="text-gray-600 mb-4">
              Available balance: ₹{wallet?.balance.toLocaleString()}
            </p>
            <Input
              label="Amount to Withdraw"
              type="number"
              placeholder="Enter amount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="mb-6"
            />
            <div className="flex gap-3">
              <Button onClick={handleWithdraw} className="flex-1">
                Withdraw
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
