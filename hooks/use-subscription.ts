// hooks/use-subscription.ts
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { UserSubscription, SubscriptionPlan } from '@/types/subscription';

// Types for better type safety
interface FeatureLimits {
    [key: string]: number | 'unlimited';
}

interface UsageData {
    [key: string]: number;
}

export function useSubscription() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    // Fetch user's current subscription
    const { data: subscription, isLoading: subscriptionLoading, error: subscriptionError } = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            try {
                const response = await axios.get<UserSubscription>('/api/subscription', {
                    timeout: 10000, // 10 second timeout
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch subscription:', error);
                throw error;
            }
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error: any) => {
            // Don't retry on 401/403 errors
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        },
    });

    // Fetch available plans
    const { data: plans, isLoading: plansLoading, error: plansError } = useQuery({
        queryKey: ['plans'],
        queryFn: async () => {
            try {
                const response = await axios.get<SubscriptionPlan[]>('/api/subscription/plans', {
                    timeout: 10000,
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch plans:', error);
                throw error;
            }
        },
        staleTime: 1000 * 60 * 10, // 10 minutes - plans don't change often
        retry: 3,
    });

    // Create subscription mutation
    const createSubscription = useMutation({
        mutationFn: async (planId: string) => {
            try {
                const response = await axios.post('/api/subscription/create', 
                    { planId },
                    { timeout: 30000 } // 30 seconds for payment processing
                );
                return response.data;
            } catch (error) {
                console.error('Failed to create subscription:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
        },
        onError: (error) => {
            console.error('Create subscription error:', error);
        },
    });

    // Cancel subscription mutation
    const cancelSubscription = useMutation({
        mutationFn: async () => {
            try {
                const response = await axios.post('/api/subscription/cancel', {}, {
                    timeout: 15000,
                });
                return response.data;
            } catch (error) {
                console.error('Failed to cancel subscription:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
        },
        onError: (error) => {
            console.error('Cancel subscription error:', error);
        },
    });

    // Upgrade subscription mutation
    const upgradeSubscription = useMutation({
        mutationFn: async (planId: string) => {
            try {
                const response = await axios.post('/api/subscription/upgrade', 
                    { planId },
                    { timeout: 30000 }
                );
                return response.data;
            } catch (error) {
                console.error('Failed to upgrade subscription:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
        },
        onError: (error) => {
            console.error('Upgrade subscription error:', error);
        },
    });

    // Check if user has access to a feature
    const hasFeatureAccess = (feature: string): boolean => {
        if (!subscription) return false;

        // Free plan limitations
        if (subscription.plan === 'free') {
            const freeLimits: Record<string, boolean> = {
                imageGeneration: true,
                videoGeneration: false,
                audioGeneration: false,
                codeGeneration: true,
                highResolution: false,
                apiAccess: false,
                prioritySupport: false,
                customModels: false,
                batchProcessing: false,
            };
            return freeLimits[feature] || false;
        }

        // Basic plan limitations
        if (subscription.plan === 'basic') {
            const basicLimits: Record<string, boolean> = {
                imageGeneration: true,
                videoGeneration: true,
                audioGeneration: true,
                codeGeneration: true,
                highResolution: true,
                apiAccess: false,
                prioritySupport: false,
                customModels: false,
                batchProcessing: true,
            };
            return basicLimits[feature] || false;
        }

        // Pro plan has all features
        if (subscription.plan === 'pro') {
            return true;
        }

        return false;
    };

    // Get current plan details
    const currentPlan = plans?.find(plan => plan.id === subscription?.plan);

    // Check if subscription is active
    const isSubscriptionActive = subscription?.status === 'active';

    // Check if subscription is expired
    const isSubscriptionExpired = subscription?.status === 'expired';

    // Check if subscription is past due
    const isSubscriptionPastDue = subscription?.status === 'past_due';

    // Get days remaining
    const daysRemaining = subscription?.endDate
        ? Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    // Check if subscription is expiring soon (within 7 days)
    const isExpiringSoon = daysRemaining !== null && daysRemaining <= 7 && daysRemaining > 0;

    return {
        subscription,
        plans: plans || [],
        currentPlan,
        isLoading: subscriptionLoading || plansLoading,
        error: subscriptionError || plansError,
        isSubscriptionActive,
        isSubscriptionExpired,
        isSubscriptionPastDue,
        isExpiringSoon,
        daysRemaining,
        hasFeatureAccess,
        createSubscription: createSubscription.mutate,
        cancelSubscription: cancelSubscription.mutate,
        upgradeSubscription: upgradeSubscription.mutate,
        isCreating: createSubscription.isPending,
        isCanceling: cancelSubscription.isPending,
        isUpgrading: upgradeSubscription.isPending,
        createError: createSubscription.error,
        cancelError: cancelSubscription.error,
        upgradeError: upgradeSubscription.error,
    };
}

// Hook for managing subscription usage
export function useSubscriptionUsage() {
    const { user } = useUser();
    const { subscription, currentPlan } = useSubscription();

    const { data: usage, isLoading, error } = useQuery({
        queryKey: ['subscription-usage', user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            try {
                const response = await axios.get<UsageData>('/api/subscription/usage', {
                    timeout: 10000,
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch usage data:', error);
                throw error;
            }
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 2,
    });

    // Check if user has reached limit for a feature
    const hasReachedLimit = (feature: string): boolean => {
        if (!usage || !currentPlan?.limits) return false;

        const limit = currentPlan.limits[feature];
        const current = usage[feature] || 0;

        return limit !== 'unlimited' && typeof limit === 'number' && current >= limit;
    };

    // Get remaining quota for a feature
    const getRemainingQuota = (feature: string): number | 'unlimited' => {
        if (!usage || !currentPlan?.limits) return 0;

        const limit = currentPlan.limits[feature];
        if (limit === 'unlimited') return 'unlimited';

        const current = usage[feature] || 0;
        return Math.max(0, (limit as number) - current);
    };

    // Get usage percentage for a feature
    const getUsagePercentage = (feature: string): number => {
        if (!usage || !currentPlan?.limits) return 0;

        const limit = currentPlan.limits[feature];
        if (limit === 'unlimited') return 0;

        const current = usage[feature] || 0;
        return Math.min(100, (current / (limit as number)) * 100);
    };

    // Check if usage is approaching limit (80% or more)
    const isApproachingLimit = (feature: string): boolean => {
        return getUsagePercentage(feature) >= 80;
    };

    return {
        usage: usage || {},
        isLoading,
        error,
        hasReachedLimit,
        getRemainingQuota,
        getUsagePercentage,
        isApproachingLimit,
    };
}

// Hook for PayPal integration
export function usePayPal() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    // Create PayPal order
    const createOrder = useMutation({
        mutationFn: async (planId: string) => {
            try {
                const response = await axios.post('/api/payment/create-order', {
                    planId,
                }, {
                    timeout: 30000, // 30 seconds for payment processing
                });
                return response.data;
            } catch (error) {
                console.error('Failed to create PayPal order:', error);
                throw error;
            }
        },
        onError: (error) => {
            console.error('Create PayPal order error:', error);
        },
    });

    // Capture PayPal order
    const captureOrder = useMutation({
        mutationFn: async (orderId: string) => {
            try {
                const response = await axios.post('/api/payment/capture-order', {
                    orderId,
                }, {
                    timeout: 30000,
                });
                return response.data;
            } catch (error) {
                console.error('Failed to capture PayPal order:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
            queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
        },
        onError: (error) => {
            console.error('Capture PayPal order error:', error);
        },
    });

    // Verify PayPal webhook
    const verifyWebhook = useMutation({
        mutationFn: async (webhookData: any) => {
            try {
                const response = await axios.post('/api/payment/verify-webhook', webhookData, {
                    timeout: 15000,
                });
                return response.data;
            } catch (error) {
                console.error('Failed to verify PayPal webhook:', error);
                throw error;
            }
        },
    });

    return {
        createOrder: createOrder.mutate,
        captureOrder: captureOrder.mutate,
        verifyWebhook: verifyWebhook.mutate,
        isCreatingOrder: createOrder.isPending,
        isCapturingOrder: captureOrder.isPending,
        isVerifyingWebhook: verifyWebhook.isPending,
        orderData: createOrder.data,
        createOrderError: createOrder.error,
        captureOrderError: captureOrder.error,
        verifyWebhookError: verifyWebhook.error,
    };
}
