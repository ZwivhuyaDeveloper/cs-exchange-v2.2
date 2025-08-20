import { Rule } from 'sanity';

interface Selection {
  tokenSymbol?: string;
  tokenName?: string;
  direction: string;
  entry: number;
  status: string;
  signalType?: string;
}

export default {
  name: 'signal',
  title: 'Crypto Signal',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Signal Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Signal name is required'),
      description: 'Name/title for this signal'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
      },
      validation: (Rule: Rule) => Rule.required().error('Slug is required'),
      description: 'URL slug for this signal, auto-generated from name'
    },
    {
      name: 'token',
      title: 'Token',
      type: 'reference',
      to: [{ type: 'token' }],
      validation: (Rule: Rule) => Rule.required().error('Token selection is required'),
      description: 'Reference to the cryptocurrency token for this signal'
    },
    {
      name: 'analyst',
      title: 'Analyst',
      type: 'reference',
      to: [{ type: 'analystProfile' }],
      validation: (Rule: Rule) => Rule.required().error('Analyst selection is required'),
      description: 'Reference to the analyst who created this signal'
    },
    {
      name: 'category',
      title: 'Signal Category',
      type: 'reference',
      to: [{ type: 'signalCategory' }],
      description: 'Category for organizing and filtering signals'
    },
    {
      name: 'direction',
      title: 'Direction',
      type: 'string',
      options: {
        list: [
          { title: 'Buy', value: 'buy' },
          { title: 'Sell', value: 'sell' },
          { title: 'Long', value: 'long' },
          { title: 'Short', value: 'short' }
        ],
        layout: 'radio'
      },
      validation: (Rule: Rule) => Rule.required().error('Direction is required'),
      initialValue: 'buy'
    },
    {
      name: 'signalType',
      title: 'Signal Type',
      type: 'string',
      options: {
        list: [
          { title: 'Breakout', value: 'breakout' },
          { title: 'Breakdown', value: 'breakdown' },
          { title: 'Support Bounce', value: 'support' },
          { title: 'Resistance Rejection', value: 'resistance' },
          { title: 'Trend Continuation', value: 'continuation' },
          { title: 'Trend Reversal', value: 'reversal' },
          { title: 'Divergence', value: 'divergence' },
          { title: 'News Catalyst', value: 'news' },
          { title: 'Fundamental', value: 'fundamental' },
          { title: 'Other', value: 'other' }
        ]
      },
      description: 'Type of trading signal'
    },
    {
      name: 'entryPrice',
      title: 'Entry Price (USD)',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().positive(),
      description: 'Price at which to enter the position'
    },
    {
      name: 'targetPrices',
      title: 'Target Prices',
      type: 'array',
      of: [{ type: 'number' }],
      validation: (Rule: Rule) => Rule.min(1).required(),
      description: 'Profit target prices in USD'
    },
    {
      name: 'stopLoss',
      title: 'Stop Loss (USD)',
      type: 'number',
      description: 'Price at which to exit the position to limit losses'
    },
    {
      name: 'riskRewardRatio',
      title: 'Risk/Reward Ratio',
      type: 'number',
      description: 'Risk to reward ratio for this trade'
    },
    {
      name: 'positionSize',
      title: 'Recommended Position Size (%)',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(0).max(100),
      description: 'Recommended position size as percentage of portfolio'
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      validation: (Rule: Rule) => Rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15
      }
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Filled', value: 'filled' },
          { title: 'Target Hit', value: 'target_hit' },
          { title: 'Stop Loss Hit', value: 'stop_loss' },
          { title: 'Completed', value: 'completed' },
          { title: 'Canceled', value: 'canceled' },
          { title: 'Expired', value: 'expired' }
        ]
      },
      initialValue: 'active',
      validation: (Rule: Rule) => Rule.required()
    },
    {
      name: 'exitPrice',
      title: 'Exit Price (USD)',
      type: 'number',
      description: 'Price at which the position was closed',
      hidden: ({ document }: { document: any }) => !['completed', 'target_hit', 'stop_loss'].includes(document?.status)
    },
    {
      name: 'exitDate',
      title: 'Exit Date',
      type: 'datetime',
      description: 'Date when position was closed',
      hidden: ({ document }: { document: any }) => !['completed', 'target_hit', 'stop_loss'].includes(document?.status)
    },
    {
      name: 'notes',
      title: 'Analysis & Notes',
      type: 'text',
      rows: 4,
      description: 'Technical/fundamental analysis for this signal'
    },
    {
      name: 'technicalAnalysis',
      title: 'Technical Analysis',
      type: 'object',
      fields: [
        {
          name: 'indicators',
          title: 'Technical Indicators',
          type: 'array',
          of: [{ type: 'string' }],
          options: {
            list: [
              'RSI', 'MACD', 'Bollinger Bands', 'Moving Averages', 'Volume', 'Stochastic',
              'Fibonacci', 'Ichimoku', 'Williams %R', 'CCI', 'ADX', 'ATR'
            ]
          }
        },
        {
          name: 'supportLevels',
          title: 'Support Levels',
          type: 'array',
          of: [{ type: 'number' }],
          description: 'Key support price levels'
        },
        {
          name: 'resistanceLevels',
          title: 'Resistance Levels',
          type: 'array',
          of: [{ type: 'number' }],
          description: 'Key resistance price levels'
        },
        {
          name: 'chartPattern',
          title: 'Chart Pattern',
          type: 'string',
          options: {
            list: [
              'Head and Shoulders', 'Double Top', 'Double Bottom', 'Triangle', 'Wedge',
              'Flag', 'Pennant', 'Cup and Handle', 'Rounding Bottom', 'Rounding Top',
              'Channel', 'Other'
            ]
          }
        }
      ]
    },
    {
      name: 'timeframe',
      title: 'Timeframe',
      type: 'string',
      options: {
        list: [
          { title: 'Scalping (minutes)', value: 'scalping' },
          { title: 'Short-term (hours)', value: 'short' },
          { title: 'Medium-term (days)', value: 'medium' },
          { title: 'Long-term (weeks)', value: 'long' },
          { title: 'Swing (weeks-months)', value: 'swing' }
        ]
      },
      initialValue: 'medium'
    },
    {
      name: 'riskLevel',
      title: 'Risk Level',
      type: 'string',
      options: {
        list: [
          { title: 'Very Low', value: 'very_low' },
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
          { title: 'Very High', value: 'very_high' }
        ]
      },
      initialValue: 'medium'
    },
    {
      name: 'confidence',
      title: 'Confidence Level',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(1).max(10),
      description: 'Signal confidence level (1-10)'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for categorization and filtering'
    },
    {
      name: 'associatedContent',
      title: 'Associated Content',
      type: 'reference',
      to: [
        { type: 'news' },
        { type: 'research' }
      ],
      description: 'Link to related news or research content'
    },
    {
      name: 'marketConditions',
      title: 'Market Conditions',
      type: 'object',
      fields: [
        {
          name: 'trend',
          title: 'Overall Market Trend',
          type: 'string',
          options: {
            list: [
              { title: 'Bullish', value: 'bullish' },
              { title: 'Bearish', value: 'bearish' },
              { title: 'Sideways', value: 'sideways' },
              { title: 'Mixed', value: 'mixed' }
            ]
          }
        },
        {
          name: 'volatility',
          title: 'Volatility Level',
          type: 'string',
          options: {
            list: [
              { title: 'Low', value: 'low' },
              { title: 'Medium', value: 'medium' },
              { title: 'High', value: 'high' },
              { title: 'Extreme', value: 'extreme' }
            ]
          }
        },
        {
          name: 'volume',
          title: 'Volume Level',
          type: 'string',
          options: {
            list: [
              { title: 'Low', value: 'low' },
              { title: 'Normal', value: 'normal' },
              { title: 'High', value: 'high' },
              { title: 'Extreme', value: 'extreme' }
            ]
          }
        }
      ]
    },
    {
      name: 'accessLevel',
      title: 'Access Level',
      type: 'string',
      options: {
        list: [
          { title: 'Public', value: 'public' },
          { title: 'Premium', value: 'premium' },
          { title: 'Pro', value: 'pro' },
          { title: 'Analyst Tier', value: 'analyst' },
          { title: 'Admin Only', value: 'admin' }
        ]
      },
      initialValue: 'public',
      description: 'Who can access this signal'
    },
    {
      name: 'isPremium',
      title: 'Premium Signal (Legacy)',
      type: 'boolean',
      initialValue: false,
      hidden: true,
      description: 'Legacy field - use accessLevel instead'
    },
    {
      name: 'priority',
      title: 'Signal Priority',
      type: 'string',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
          { title: 'Critical', value: 'critical' }
        ]
      },
      initialValue: 'medium',
      description: 'Priority level for signal notifications'
    },
    {
      name: 'featured',
      title: 'Featured Signal',
      type: 'boolean',
      initialValue: false,
      description: 'Whether to feature this signal prominently'
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      description: 'Last time signal was updated'
    }
  ],
  preview: {
    select: {
      tokenSymbol: 'token.symbol',
      tokenName: 'token.name',
      direction: 'direction',
      entry: 'entryPrice',
      status: 'status',
      signalType: 'signalType',
      analystName: 'analyst.displayName'
    },
    prepare(selection: Selection) {
      const { tokenSymbol, tokenName, direction, entry, status, signalType, analystName } = selection;
      
      // Safeguard all values
      const safeTokenSymbol = tokenSymbol || '';
      const safeDirection = direction || 'buy';
      const safeEntry = entry || 0;
      const safeStatus = status || 'draft';
      const safeSignalType = signalType || '';
      const safeAnalystName = analystName || 'Unknown Analyst';
      
      const titleText = safeTokenSymbol 
        ? `${safeTokenSymbol} ${safeDirection.toUpperCase()}`
        : `New ${safeDirection.toUpperCase()} Signal`;
      
      const subtitleText = tokenName 
        ? `${tokenName} | Entry: $${safeEntry.toFixed(2)} | Analyst: ${safeAnalystName}`
        : `Entry: $${safeEntry.toFixed(2)} | Analyst: ${safeAnalystName}`;
      
      const signalTypeText = safeSignalType ? ` | ${safeSignalType}` : '';
      
      return {
        title: titleText,
        subtitle: `${subtitleText}${signalTypeText} | Status: ${safeStatus}`
      }
    }
  }
}