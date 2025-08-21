import { defineField, defineType } from 'sanity';

interface Selection {
  tokenSymbol?: string;
  tokenName?: string;
  direction: string;
  entry: number;
  status: string;
  signalType?: string;
  analystName?: string;
}

export const signal = defineType({
  name: 'signal',
  title: 'Crypto Signal',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Signal Name',
      type: 'string',
      validation: (rule) => rule.required().error('Signal name is required'),
      description: 'Name/title for this signal'
    }),
    defineField({
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
      validation: (rule) => rule.required().error('Slug is required'),
      description: 'URL slug for this signal, auto-generated from name'
    }),
    defineField({
      name: 'token',
      title: 'Token',
      type: 'reference',
      to: [{ type: 'token' }],
      validation: (rule) => rule.required().error('Token selection is required'),
      description: 'Reference to the cryptocurrency token for this signal'
    }),
    defineField({
      name: 'analyst',
      title: 'Analyst',
      type: 'reference',
      to: [{ type: 'analystProfile' }],
      validation: (rule) => rule.required().error('Analyst selection is required'),
      description: 'Reference to the analyst who created this signal'
    }),
    defineField({
      name: 'category',
      title: 'Signal Category',
      type: 'reference',
      to: [{ type: 'signalCategory' }],
      description: 'Category for organizing and filtering signals'
    }),
    defineField({
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
      validation: (rule) => rule.required().error('Direction is required'),
      initialValue: 'buy'
    }),
    defineField({
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
    }),
    defineField({
      name: 'entryPrice',
      title: 'Entry Price (USD)',
      type: 'number',
      validation: (rule) => rule.required().positive(),
      description: 'Price at which to enter the position'
    }),
    defineField({
      name: 'targetPrices',
      title: 'Target Prices',
      type: 'array',
      of: [{ type: 'number' }],
      validation: (rule) => rule.min(1).required(),
      description: 'Profit target prices in USD'
    }),
    defineField({
      name: 'stopLoss',
      title: 'Stop Loss (USD)',
      type: 'number',
      description: 'Price at which to exit the position to limit losses'
    }),
    defineField({
      name: 'riskRewardRatio',
      title: 'Risk/Reward Ratio',
      type: 'number',
      description: 'Risk to reward ratio for this trade'
    }),
    defineField({
      name: 'positionSize',
      title: 'Recommended Position Size (%)',
      type: 'number',
      validation: (rule) => rule.min(0).max(100),
      description: 'Recommended position size as percentage of portfolio'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      validation: (rule) => rule.required(),
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15
      }
    }),
    defineField({
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
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'exitPrice',
      title: 'Exit Price (USD)',
      type: 'number',
      description: 'Price at which the position was closed',
      hidden: ({ document }: { document: any }) => !['completed', 'target_hit', 'stop_loss'].includes(document?.status)
    }),
    defineField({
      name: 'exitDate',
      title: 'Exit Date',
      type: 'datetime',
      description: 'Date when position was closed',
      hidden: ({ document }: { document: any }) => !['completed', 'target_hit', 'stop_loss'].includes(document?.status)
    }),
    defineField({
      name: 'notes',
      title: 'Analysis & Notes',
      type: 'text',
      rows: 4,
      description: 'Technical/fundamental analysis for this signal'
    }),
    defineField({
      name: 'technicalAnalysis',
      title: 'Technical Analysis',
      type: 'object',
      fields: [
        defineField({
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
        }),
        defineField({
          name: 'supportLevels',
          title: 'Support Levels',
          type: 'array',
          of: [{ type: 'number' }],
          description: 'Key support price levels'
        }),
        defineField({
          name: 'resistanceLevels',
          title: 'Resistance Levels',
          type: 'array',
          of: [{ type: 'number' }],
          description: 'Key resistance price levels'
        }),
        defineField({
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
        }),
      ]
    }),
    defineField({
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
    }),
    defineField({
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
    }),
    defineField({
      name: 'confidence',
      title: 'Confidence Level',
      type: 'number',
      validation: (rule) => rule.min(1).max(10),
      description: 'Signal confidence level (1-10)'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tags for categorization and filtering'
    }),
    defineField({
      name: 'associatedContent',
      title: 'Associated Content',
      type: 'reference',
      to: [
        { type: 'news' },
        { type: 'research' }
      ],
      description: 'Link to related news or research content'
    }),
    defineField({
      name: 'marketConditions',
      title: 'Market Conditions',
      type: 'object',
      fields: [
        defineField({
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
        }),
        defineField({
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
        }),
        defineField({
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
        })
      ]
    }),
    defineField({
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
    }),
    defineField({
      name: 'isPremium',
      title: 'Premium Signal (Legacy)',
      type: 'boolean',
      initialValue: false,
      hidden: true,
      description: 'Legacy field - use accessLevel instead'
    }),
    defineField({
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
    }),
    defineField({
      name: 'featured',
      title: 'Featured Signal',
      type: 'boolean',
      initialValue: false,
      description: 'Whether to feature this signal prominently'
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      description: 'Last time signal was updated'
    }),
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
})