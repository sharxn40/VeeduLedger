/**
 * Centralized financial utility functions for VeeduLedger
 */

/**
 * Calculates current rent based on compound increment logic.
 * Formula: baseRent * (1 + increment/100) ^ yearsPassed
 */
export const calculateAdjustedRent = (baseRent, startDateStr, incrementPercent) => {
  const startDate = new Date(startDateStr);
  const today = new Date();
  
  if (isNaN(startDate.getTime())) return parseFloat(baseRent) || 0;

  // Calculate full years passed
  let yearsPassed = today.getFullYear() - startDate.getFullYear();
  const hasMonthPassed = today.getMonth() > startDate.getMonth() || 
                        (today.getMonth() === startDate.getMonth() && today.getDate() >= startDate.getDate());
  
  if (!hasMonthPassed) {
    yearsPassed--;
  }
  
  const effectiveYears = Math.max(0, yearsPassed);
  const increment = parseFloat(incrementPercent || 0) / 100;
  
  // Compound formula
  const finalRent = Math.round(parseFloat(baseRent) * Math.pow(1 + increment, effectiveYears));
  return isNaN(finalRent) ? parseFloat(baseRent) : finalRent;
};

/**
 * Formats currency values with the specified symbol
 */
export const formatCurrency = (amount, symbol = '₹') => {
  return `${symbol}${parseFloat(amount).toLocaleString('en-IN')}`;
};

/**
 * Checks if a payment is overdue based on current date
 */
export const isOverdue = (dueDateStr) => {
  const dueDate = new Date(dueDateStr);
  const today = new Date();
  return today > dueDate;
};
