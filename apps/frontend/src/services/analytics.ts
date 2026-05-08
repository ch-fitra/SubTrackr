import api from './api';

export interface AnalyticsSummary {
  monthlySpend: number;
  yearlySpend: number;
  activeCount: number;
}

export interface UpcomingRenewal {
  id: string;
  name: string;
  amount: number;
  nextBillingDate: string;
  icon?: string;
}

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
}

export interface TimelineData {
  month: string;
  amount: number;
}

const fallbackSummary: AnalyticsSummary = {
  monthlySpend: 248.90,
  yearlySpend: 2986.80,
  activeCount: 18
};

const fallbackUpcoming: UpcomingRenewal[] = [
  { id: '1', name: 'Netflix', amount: 15.99, nextBillingDate: 'Tomorrow', icon: 'Film' },
  { id: '2', name: 'Spotify', amount: 9.99, nextBillingDate: 'May 12', icon: 'Music' }
];

const fallbackCategory: CategoryData[] = [
  { category: 'Entertainment', amount: 45.98, count: 3 },
  { category: 'Utilities', amount: 120.00, count: 2 },
  { category: 'Software', amount: 82.92, count: 5 }
];

const fallbackTimeline: TimelineData[] = [
  { month: 'Jan', amount: 120 },
  { month: 'Feb', amount: 150 },
  { month: 'Mar', amount: 180 },
  { month: 'Apr', amount: 200 },
  { month: 'May', amount: 220 },
  { month: 'Jun', amount: 248.90 }
];

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  try {
    const response = await api.get('/api/analytics/summary');
    return response.data;
  } catch (error) {
    console.warn('Backend offline, using fallback for summary');
    return fallbackSummary;
  }
};

export const getUpcomingRenewals = async (): Promise<UpcomingRenewal[]> => {
  try {
    const response = await api.get('/api/analytics/upcoming');
    return response.data;
  } catch (error) {
    console.warn('Backend offline, using fallback for upcoming renewals');
    return fallbackUpcoming;
  }
};

export const getCategoryData = async (): Promise<CategoryData[]> => {
  try {
    const response = await api.get('/api/analytics/category');
    return response.data;
  } catch (error) {
    console.warn('Backend offline, using fallback for category data');
    return fallbackCategory;
  }
};

export const getTimelineData = async (): Promise<TimelineData[]> => {
  try {
    const response = await api.get('/api/analytics/timeline');
    return response.data;
  } catch (error) {
    console.warn('Backend offline, using fallback for timeline data');
    return fallbackTimeline;
  }
};
