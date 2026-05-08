import api from './api';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY' | 'WEEKLY';
  nextBillingDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  category?: string;
  icon?: string;
}

const fallbackSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', amount: 15.99, currency: 'USD', billingCycle: 'MONTHLY', nextBillingDate: '2026-05-09', status: 'ACTIVE', category: 'Entertainment', icon: 'Film' },
  { id: '2', name: 'Spotify', amount: 9.99, currency: 'USD', billingCycle: 'MONTHLY', nextBillingDate: '2026-05-12', status: 'ACTIVE', category: 'Music', icon: 'Music' },
  { id: '3', name: 'AWS', amount: 45.50, currency: 'USD', billingCycle: 'MONTHLY', nextBillingDate: '2026-05-15', status: 'ACTIVE', category: 'Software', icon: 'Server' }
];

export const getSubscriptions = async (): Promise<Subscription[]> => {
  try {
    const response = await api.get('/api/subscriptions');
    return response.data;
  } catch (error) {
    console.warn('Backend offline, using fallback for subscriptions');
    return fallbackSubscriptions;
  }
};

export const createSubscription = async (data: Omit<Subscription, 'id'>): Promise<Subscription> => {
  const response = await api.post('/api/subscriptions', data);
  return response.data;
};
