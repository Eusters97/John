import { supabase } from "./supabase";
import { logger } from "./logger";

export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  roi_percentage: number;
  duration_days: number;
  is_active: boolean;
  is_featured: boolean;
  features: string[];
  created_at: string;
  updated_at: string;
}

class InvestmentPlansService {
  private defaultPlans: InvestmentPlan[] = [
    {
      id: "starter",
      name: "Starter Plan",
      description: "Perfect for beginners looking to get started with forex trading",
      min_amount: 100,
      max_amount: 999,
      roi_percentage: 15,
      duration_days: 7,
      is_active: true,
      is_featured: false,
      features: [
        "Basic trading signals",
        "Email support",
        "Weekly market analysis",
        "Mobile app access"
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "professional",
      name: "Professional Plan",
      description: "For serious investors who want higher returns",
      min_amount: 1000,
      max_amount: 4999,
      roi_percentage: 25,
      duration_days: 14,
      is_active: true,
      is_featured: true,
      features: [
        "Premium trading signals",
        "24/7 support",
        "Daily market analysis",
        "Personal account manager",
        "Risk management tools"
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "premium",
      name: "Premium Plan",
      description: "Maximum returns for high-volume investors",
      min_amount: 5000,
      max_amount: 50000,
      roi_percentage: 35,
      duration_days: 30,
      is_active: true,
      is_featured: false,
      features: [
        "VIP trading signals",
        "Priority support",
        "Real-time market alerts",
        "Dedicated analyst",
        "Advanced portfolio tools",
        "Exclusive webinars"
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  /**
   * Get all active investment plans
   */
  async getActivePlans(): Promise<{ success: boolean; data: InvestmentPlan[]; error?: any }> {
    try {
      const { data, error } = await supabase
        .from("investment_plans")
        .select("*")
        .eq("is_active", true)
        .order("min_amount", { ascending: true });

      if (error && error.code !== 'CONFIGURATION_ERROR') {
        throw error;
      }

      // Use default plans if database is not configured or empty
      const plans = (data && data.length > 0) ? data : this.defaultPlans;
      
      return { success: true, data: plans };
    } catch (error) {
      logger.error("Failed to load investment plans", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Return default plans on error
      return { success: true, data: this.defaultPlans };
    }
  }

  /**
   * Get all plans (for admin)
   */
  async getAllPlans(): Promise<{ success: boolean; data: InvestmentPlan[]; error?: any }> {
    try {
      const { data, error } = await supabase
        .from("investment_plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error && error.code !== 'CONFIGURATION_ERROR') {
        throw error;
      }

      const plans = (data && data.length > 0) ? data : this.defaultPlans;
      
      return { success: true, data: plans };
    } catch (error) {
      logger.error("Failed to load all investment plans", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return { success: true, data: this.defaultPlans };
    }
  }

  /**
   * Create a new investment plan (admin only)
   */
  async createPlan(planData: Omit<InvestmentPlan, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: InvestmentPlan; error?: any }> {
    try {
      const { data, error } = await supabase
        .from("investment_plans")
        .insert({
          ...planData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      logger.info("Investment plan created", { planName: planData.name });
      return { success: true, data };
    } catch (error) {
      logger.error("Failed to create investment plan", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        planData
      });
      
      return { success: false, error };
    }
  }

  /**
   * Update an existing investment plan (admin only)
   */
  async updatePlan(planId: string, updates: Partial<InvestmentPlan>): Promise<{ success: boolean; data?: InvestmentPlan; error?: any }> {
    try {
      const { data, error } = await supabase
        .from("investment_plans")
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq("id", planId)
        .select()
        .single();

      if (error) throw error;

      logger.info("Investment plan updated", { planId, updates });
      return { success: true, data };
    } catch (error) {
      logger.error("Failed to update investment plan", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        planId,
        updates
      });
      
      return { success: false, error };
    }
  }

  /**
   * Delete an investment plan (admin only)
   */
  async deletePlan(planId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from("investment_plans")
        .delete()
        .eq("id", planId);

      if (error) throw error;

      logger.info("Investment plan deleted", { planId });
      return { success: true };
    } catch (error) {
      logger.error("Failed to delete investment plan", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        planId
      });
      
      return { success: false, error };
    }
  }

  /**
   * Get plan by ID
   */
  async getPlanById(planId: string): Promise<{ success: boolean; data?: InvestmentPlan; error?: any }> {
    try {
      const { data, error } = await supabase
        .from("investment_plans")
        .select("*")
        .eq("id", planId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // If not found in database, check default plans
      if (!data) {
        const defaultPlan = this.defaultPlans.find(plan => plan.id === planId);
        if (defaultPlan) {
          return { success: true, data: defaultPlan };
        }
        return { success: false, error: { message: 'Plan not found' } };
      }

      return { success: true, data };
    } catch (error) {
      logger.error("Failed to get investment plan", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        planId
      });
      
      return { success: false, error };
    }
  }

  /**
   * Calculate expected return for a plan and amount
   */
  calculateExpectedReturn(plan: InvestmentPlan, amount: number): {
    profit: number;
    totalReturn: number;
    dailyReturn: number;
  } {
    const profit = (amount * plan.roi_percentage) / 100;
    const totalReturn = amount + profit;
    const dailyReturn = profit / plan.duration_days;

    return {
      profit,
      totalReturn,
      dailyReturn
    };
  }

  /**
   * Validate investment amount for a plan
   */
  validateAmount(plan: InvestmentPlan, amount: number): {
    isValid: boolean;
    error?: string;
  } {
    if (amount < plan.min_amount) {
      return {
        isValid: false,
        error: `Minimum investment for ${plan.name} is $${plan.min_amount}`
      };
    }

    if (amount > plan.max_amount) {
      return {
        isValid: false,
        error: `Maximum investment for ${plan.name} is $${plan.max_amount}`
      };
    }

    return { isValid: true };
  }
}

export const investmentPlansService = new InvestmentPlansService();
export default investmentPlansService;
