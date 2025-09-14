import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LoyaltyCard = ({ customerEmail }) => {
  const { t } = useLanguage();
  const [loyaltyData, setLoyaltyData] = useState({
    points: 0,
    tier: 'Bronze',
    nextTierPoints: 100,
    totalSpent: 0,
    visits: 0,
    rewards: []
  });

  useEffect(() => {
    // Mock loyalty data - in real app, fetch from API
    setLoyaltyData({
      points: 150,
      tier: 'Silver',
      nextTierPoints: 200,
      totalSpent: 350,
      visits: 8,
      rewards: [
        { id: 1, name: 'Free Haircut', points: 100, claimed: false },
        { id: 2, name: '20% Off Next Service', points: 50, claimed: true },
        { id: 3, name: 'Free Manicure', points: 80, claimed: false }
      ]
    });
  }, [customerEmail]);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'Bronze': return 'from-yellow-600 to-yellow-500';
      case 'Silver': return 'from-gray-400 to-gray-300';
      case 'Gold': return 'from-yellow-500 to-yellow-400';
      case 'Platinum': return 'from-purple-600 to-purple-500';
      default: return 'from-gray-400 to-gray-300';
    }
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'Bronze': return '🥉';
      case 'Silver': return '🥈';
      case 'Gold': return '🥇';
      case 'Platinum': return '💎';
      default: return '⭐';
    }
  };

  const progressPercentage = (loyaltyData.points / loyaltyData.nextTierPoints) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="text-center mb-6">
        <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${getTierColor(loyaltyData.tier)} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
          {getTierIcon(loyaltyData.tier)}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {loyaltyData.tier} Member
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {loyaltyData.points} points • {loyaltyData.visits} visits
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress to next tier</span>
          <span>{loyaltyData.points}/{loyaltyData.nextTierPoints}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 bg-gradient-to-r ${getTierColor(loyaltyData.tier)} rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {loyaltyData.nextTierPoints - loyaltyData.points} more points to reach next tier
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${loyaltyData.totalSpent}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
        </div>
        <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{loyaltyData.visits}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Visits</p>
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Available Rewards</h4>
        <div className="space-y-2">
          {loyaltyData.rewards.map((reward) => (
            <div
              key={reward.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                reward.claimed 
                  ? 'bg-gray-100 dark:bg-gray-700 opacity-60' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  reward.claimed 
                    ? 'bg-gray-300 dark:bg-gray-600' 
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                }`}>
                  {reward.claimed ? '✓' : '🎁'}
                </div>
                <div>
                  <p className={`font-medium ${reward.claimed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {reward.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reward.points} points
                  </p>
                </div>
              </div>
              <button
                disabled={reward.claimed || loyaltyData.points < reward.points}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  reward.claimed
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                    : loyaltyData.points >= reward.points
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                }`}
              >
                {reward.claimed ? 'Claimed' : loyaltyData.points >= reward.points ? 'Claim' : 'Not enough points'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">How to Earn Points</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• 1 point for every $1 spent</li>
          <li>• 10 bonus points for first booking</li>
          <li>• 5 points for writing a review</li>
          <li>• 20 points for referring a friend</li>
        </ul>
      </div>
    </div>
  );
};

export default LoyaltyCard;

