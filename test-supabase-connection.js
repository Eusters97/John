// Test Supabase Connection Script
// Run this to verify your Supabase connection is working

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bcstxngbmqrvuhtpzwid.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjc3R4bmdibXFydnVodHB6d2lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTc2ODIsImV4cCI6MjA2OTY5MzY4Mn0.RYsQJAAFedODc0gcFJd6gQp1URjw5rYEoU6EvOZJUvw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...');
  console.log('📍 Project:', supabaseUrl);
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('investment_plans').select('count');
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      console.log('💡 Make sure you run the production-database-setup.sql script first!');
      return false;
    }
    
    console.log('✅ Connection successful!');
    
    // Test investment plans
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('*');
      
    if (plansError) {
      console.log('⚠️  Investment plans table not found:', plansError.message);
      return false;
    }
    
    console.log('✅ Investment plans loaded:', plans?.length || 0, 'plans');
    plans?.forEach(plan => {
      console.log(`   📊 ${plan.name}: $${plan.min_amount}-$${plan.max_amount}, ${plan.roi_percentage/100}X ROI`);
    });
    
    return true;
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    return false;
  }
}

testConnection();
