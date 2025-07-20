import { Rule } from 'sanity';

interface Selection {
  tokenSymbol?: string;
  tokenName?: string;
  direction: string;
  entry: number;
  status: string;
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
      name: 'direction',
      title: 'Direction',
      type: 'string',
      options: {
        list: [
          { title: 'Buy', value: 'buy' },
          { title: 'Sell', value: 'sell' }
        ],
        layout: 'radio'
      },
      validation: (Rule: Rule) => Rule.required().error('Direction is required'),
      initialValue: 'buy'
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
          { title: 'Completed', value: 'completed' },
          { title: 'Canceled', value: 'canceled' }
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
      hidden: ({ document }: { document: any }) => document?.status !== 'completed'
    },
    {
      name: 'notes',
      title: 'Analysis & Notes',
      type: 'text',
      rows: 4,
      description: 'Technical/fundamental analysis for this signal'
    },
    {
      name: 'timeframe',
      title: 'Timeframe',
      type: 'string',
      options: {
        list: [
          { title: 'Short-term (0-1 week)', value: 'short' },
          { title: 'Medium-term (1-4 weeks)', value: 'medium' },
          { title: 'Long-term (1+ months)', value: 'long' }
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
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' }
        ]
      },
      initialValue: 'medium'
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
    }
  ],
  preview: {
    select: {
      tokenSymbol: 'token.symbol',
      tokenName: 'token.name',
      direction: 'direction',
      entry: 'entryPrice',
      status: 'status'
    },
    prepare(selection: Selection) {
      const { tokenSymbol, tokenName, direction, entry, status } = selection;
      
      // Safeguard all values
      const safeTokenSymbol = tokenSymbol || '';
      const safeDirection = direction || 'buy';
      const safeEntry = entry || 0;
      const safeStatus = status || 'draft';
      
      const titleText = safeTokenSymbol 
        ? `${safeTokenSymbol} ${safeDirection.toUpperCase()} Signal`
        : `New ${safeDirection.toUpperCase()} Signal`;
      
      const subtitleText = tokenName 
        ? `${tokenName} | Entry: $${safeEntry.toFixed(2)}`
        : `Entry: $${safeEntry.toFixed(2)}`;
      
      return {
        title: titleText,
        subtitle: `${subtitleText} | Status: ${safeStatus}`
      }
    }
  }
}