export interface MarketMetricBenchmark {
  metricName: string;
  yourSalonValue: string;
  metroAverageValue: string;
  top10PercentChainValue: string;
  status: 'Outperforming' | 'Competitive' | 'Opportunity Area';
  aiInsight: string;
}

export const MARKET_BENCHMARKS: MarketMetricBenchmark[] = [
  {
    metricName: 'Average Ticket Spend ($)',
    yourSalonValue: '$145',
    metroAverageValue: '$118',
    top10PercentChainValue: '$165',
    status: 'Outperforming',
    aiInsight: 'Your average ticket is 23% higher than local metro independent salons due to premium color treatments.'
  },
  {
    metricName: 'No-Show Rate (%)',
    yourSalonValue: '4.2%',
    metroAverageValue: '12.5%',
    top10PercentChainValue: '3.8%',
    status: 'Outperforming',
    aiInsight: 'Front Desk Copilot predictor & automated deposit reminders reduced your no-show rate to near top-chain levels.'
  },
  {
    metricName: 'Client Rebooking / Retention Rate (%)',
    yourSalonValue: '68%',
    metroAverageValue: '54%',
    top10PercentChainValue: '76%',
    status: 'Competitive',
    aiInsight: 'Your retention is strong. Launching 60-day automated win-back triggers will push you into the top 10% bracket.'
  },
  {
    metricName: 'Off-Peak Capacity Utilization (%)',
    yourSalonValue: '48%',
    metroAverageValue: '35%',
    top10PercentChainValue: '62%',
    status: 'Opportunity Area',
    aiInsight: 'Tuesday & Wednesday morning slots are underutilized. AI Off-Peak Filler campaigns can unlock +14% capacity.'
  },
  {
    metricName: 'Average Client 12-Month LTV ($)',
    yourSalonValue: '$2,016',
    metroAverageValue: '$1,420',
    top10PercentChainValue: '$2,450',
    status: 'Outperforming',
    aiInsight: 'Your high-spend VIP Champions drive strong annual value per client compared to regional averages.'
  }
];
