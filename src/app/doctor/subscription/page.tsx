'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { subscriptionApi } from '@/lib/api/endpoints';
import { SubscriptionPlan, Subscription } from '@/types/subscription';

declare global {
  interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; }
}

export default function DoctorSubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const [plansResult, mineResult] = await Promise.all([subscriptionApi.getPlans(), subscriptionApi.getMine()]);
    setPlans(plansResult.data || []);
    setSubscription(mineResult.data || null);
  };
  useEffect(() => { load().catch(() => setMessage('Unable to load subscription details.')); }, []);

  const pay = async (planType: string) => {
    try {
      const { data: order } = await subscriptionApi.createDoctorOrder(planType);
      if (!window.Razorpay) throw new Error('Razorpay checkout has not loaded');
      const checkout = new window.Razorpay({
        key: order.key,
        amount: order.amountPaise,
        currency: order.currency || 'INR',
        name: 'Aivion Care',
        description: order.description || 'Doctor subscription',
        order_id: order.razorpayOrderId,
        handler: async (payment: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await subscriptionApi.verifyDoctorPayment({
            razorpayOrderId: payment.razorpay_order_id,
            razorpayPaymentId: payment.razorpay_payment_id,
            razorpaySignature: payment.razorpay_signature,
          });
          setMessage('Payment verified. Your subscription is active.');
          await load();
        },
      });
      checkout.open();
    } catch (error: any) {
      setMessage(error?.response?.data?.message || error.message || 'Unable to start payment.');
    }
  };

  return <AppLayout role="DOCTOR" title="Subscription" subtitle="Manage appointment access with Razorpay test payments">
    <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    <div className="space-y-6">
      <div className="rounded-card border border-tonal-20/50 bg-surface-20/80 p-5">
        <p className="font-semibold text-primary-light">{subscription?.status || 'NO ACTIVE SUBSCRIPTION'}</p>
        {subscription?.planName && <p className="mt-1 text-primary-light/70">{subscription.planName} · ends {subscription.endDate || '—'}</p>}
        {message && <p className="mt-3 text-sm text-accent">{message}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-3">{plans.map((plan) => <div key={plan.planType} className="rounded-card border border-tonal-20/50 bg-surface-20/80 p-5">
        <h2 className="font-bold text-primary-light">{plan.planName}</h2><p className="my-2 text-primary-light/70">₹{plan.amount} · {plan.validityDays} days</p>
        <button onClick={() => pay(plan.planType)} className="rounded-lg bg-accent px-4 py-2 font-semibold text-surface-10">Pay with Razorpay</button>
      </div>)}</div>
    </div>
  </AppLayout>;
}
