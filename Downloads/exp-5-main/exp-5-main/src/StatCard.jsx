import React from 'react';

export default function StatCard({ label, value, status = 'normal' }) {
  return (
    <div className={`stat-card ${status}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
