import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Building2, Wallet, Check } from 'lucide-react';
import tappLogo from '@/assets/tapp-logo.png';

const Payment = () => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [savedCard, setSavedCard] = useState('');

  const savedCards = [
    { id: '1', number: '**** **** **** 4242', type: 'Visa' },
    { id: '2', number: '**** **** **** 5555', type: 'Mastercard' },
  ];

  const handlePayment = () => {
    setStep(3);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary/20' : 'border-muted'}`}>
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary/20' : 'border-muted'}`}>
                {step > 2 ? <Check size={16} /> : '2'}
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>
            <div className="w-12 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary/20' : 'border-muted'}`}>
                {step > 3 ? <Check size={16} /> : '3'}
              </div>
              <span className="hidden sm:inline">Confirmation</span>
            </div>
          </div>
        </div>

        {step !== 3 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-light mb-6">Payment Method</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`glass rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'card' ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <CreditCard size={24} />
                    <span className="text-sm">Credit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`glass rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'paypal' ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Wallet size={24} />
                    <span className="text-sm">PayPal</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`glass rounded-lg p-4 flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'bank' ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Building2 size={24} />
                    <span className="text-sm">Bank Transfer</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-light mb-4">Saved Cards</h3>
                      <RadioGroup value={savedCard} onValueChange={setSavedCard}>
                        {savedCards.map(card => (
                          <div key={card.id} className="flex items-center space-x-2 glass rounded-lg p-4 mb-2">
                            <RadioGroupItem value={card.id} id={card.id} />
                            <Label htmlFor={card.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <span>{card.number}</span>
                                <span className="text-sm text-muted-foreground">{card.type}</span>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-light">Or Enter New Card</h3>
                      <Input 
                        placeholder="Card Number" 
                        className="neo-button"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="MM/YY" 
                          className="neo-button"
                        />
                        <Input 
                          placeholder="CVC" 
                          className="neo-button"
                        />
                      </div>
                      <Input 
                        placeholder="Cardholder Name" 
                        className="neo-button"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="glass rounded-xl p-6 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <img src={tappLogo} alt="TAPP" className="h-6" />
              </div>
              
              <h2 className="text-xl font-light mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project Membership</span>
                  <span>$249.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span>$9.00</span>
                </div>
              </div>
              
              <div className="flex justify-between text-2xl font-light mb-6">
                <span>Total</span>
                <span className="text-primary">$258.00</span>
              </div>
              
              <Button 
                className="w-full neo-button h-12 text-lg"
                onClick={handlePayment}
              >
                Pay Now
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass rounded-xl p-12">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check size={40} className="text-green-400" />
              </div>
              <h1 className="text-4xl font-light mb-4 glow-text">Payment Successful!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Your membership has been activated. Welcome to TAPP Premium!
              </p>
              <Button 
                className="neo-button px-8"
                onClick={() => window.location.href = '/'}
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
