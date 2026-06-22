export function formatRating(rating) {
  const count = Math.round(Number(rating) || 0);
  return '⭐'.repeat(Math.min(count, 5));
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export const messageStyle = {
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '4px',
  fontSize: '14px',
};

export const errorStyle = {
  ...messageStyle,
  backgroundColor: '#ffe6e6',
  color: '#cc0000',
};

export const successStyle = {
  ...messageStyle,
  backgroundColor: '#e6ffe6',
  color: '#006600',
};

export const loadingStyle = {
  textAlign: 'center',
  color: 'purple',
  padding: '10px',
};
