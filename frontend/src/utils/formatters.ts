export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', { 
    style: 'currency', 
    currency: 'ARS', 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('es-AR').format(value);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(1)}%`;
};

export const formatDate = (date?: Date) => {
  return new Date(date || Date.now()).toLocaleString('es-AR');
};

export const formatCompactNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};