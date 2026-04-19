import { useState } from 'react';
import { FaCrown, FaCheck, FaTimes, FaSpinner, FaRocket, FaBuilding, FaStore } from 'react-icons/fa';

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState('Professional');
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const plans = [
    {
      name: 'Starter',
      icon: FaStore,
      price: '$0',
      period: 'forever',
      description: 'Ideal for small or new shoe stores getting started.',
      features: [
        { name: '1 Store Location', included: true },
        { name: 'Up to 500 Inventory Items', included: true },
        { name: 'Basic Reporting', included: true },
        { name: 'Multi-user Access', included: false },
        { name: 'Premium Support', included: false }
      ]
    },
    {
      name: 'Professional',
      icon: FaRocket,
      price: '$49',
      period: 'per month',
      description: 'Everything you need to grow your retail business.',
      popular: true,
      features: [
        { name: '3 Store Locations', included: true },
        { name: 'Up to 5,000 Inventory Items', included: true },
        { name: 'Advanced Reporting & Analytics', included: true },
        { name: 'Unlimited Staff Accounts', included: true },
        { name: 'Premium Support', included: false }
      ]
    },
    {
      name: 'Enterprise',
      icon: FaBuilding,
      price: '$199',
      period: 'per month',
      description: 'Advanced features for enterprise and large chains.',
      features: [
        { name: 'Unlimited Store Locations', included: true },
        { name: 'Unlimited Inventory Items', included: true },
        { name: 'Full Custom Customization', included: true },
        { name: 'Unlimited Staff Accounts', included: true },
        { name: '24/7 Priority Phone Support', included: true }
      ]
    }
  ];

  const handleUpgrade = (planName) => {
    if (planName === currentPlan) return;
    
    setUpgradeLoading(planName);
    setSuccessMessage('');
    
    // Simulate API network request
    setTimeout(() => {
      setCurrentPlan(planName);
      setUpgradeLoading(false);
      setSuccessMessage(`Successfully upgraded to the ${planName} plan!`);
      
      // Auto-hide success message
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1500);
  };

  return (
    <div className="space-y-8 fade-in pb-10 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          <FaCrown className="text-yellow-500" /> Billing & SaaS Plan
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your storefront's subscription and billing details.</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-sm transition-all animate-bounce-short">
          <FaCheck className="text-green-500 text-xl" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {/* Usage Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-bold text-gray-700 text-lg">Current Plan</h3>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm uppercase tracking-wider">
                {currentPlan}
              </span>
            </div>
            <p className="text-gray-500 text-sm">Next billing date: <strong>{new Date(Date.now() + 15 * 86400000).toLocaleDateString()}</strong></p>
          </div>
          
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">Monthly Revenue Limit</span>
                <span className="font-bold text-gray-800">45% used</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 text-lg mb-4">SaaS Usage Limits</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">Inventory Items</span>
                <span className="font-bold text-gray-800">1,248 / 5,000</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-600">Staff Accounts</span>
                <span className="font-bold text-gray-800">4 / Unlimited</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8 mt-10">Available Plans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => {
            const isCurrent = currentPlan === plan.name;
            const isTarget = upgradeLoading === plan.name;

            return (
              <div key={idx} className={`relative bg-white rounded-2xl shadow-sm border transition-all duration-300 flex flex-col ${plan.popular ? 'border-blue-500 shadow-md ring-2 ring-blue-500 ring-opacity-20 transform -translate-y-2' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8 border-b border-gray-100 flex-1">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-2xl text-blue-600 border border-gray-100 shadow-sm">
                    {(() => {
                      const Icon = plan.icon;
                      return <Icon />;
                    })()}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm h-10">{plan.description}</p>
                  
                  <div className="my-6">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 font-medium ml-2">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={`flex items-start gap-3 text-sm ${feature.included ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                        {feature.included ? (
                          <FaCheck className="text-green-500 mt-0.5 flex-shrink-0 text-base" />
                        ) : (
                          <FaTimes className="text-gray-300 mt-0.5 flex-shrink-0 text-base" />
                        )}
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-8 pt-6 bg-gray-50 rounded-b-2xl">
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={isCurrent || upgradeLoading}
                    className={`w-full py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2
                      ${isCurrent 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                          : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {isTarget ? (
                       <><FaSpinner className="animate-spin" /> Processing...</>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      'Upgrade Plan'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
