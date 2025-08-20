import { Rule } from 'sanity';

export default {
  name: 'analystProfile',
  title: 'Analyst Profile',
  type: 'document',
  fields: [
    {
      name: 'userId',
      title: 'User ID',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('User ID is required'),
      description: 'Clerk user ID for this analyst'
    },
    {
      name: 'displayName',
      title: 'Display Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().error('Display name is required'),
      description: 'Public display name for the analyst'
    },
    {
      name: 'name',
      title: 'Name (Legacy)',
      type: 'string',
      hidden: true,
      description: 'Legacy name field for backward compatibility'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'displayName',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
      },
      validation: (Rule: Rule) => Rule.required().error('Slug is required'),
      description: 'URL slug for analyst profile'
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for accessibility'
        }
      ],
      description: 'Profile picture for the analyst'
    },
    {
      name: 'bio',
      title: 'Biography',
      type: 'text',
      rows: 4,
      description: 'Brief biography and trading background'
    },
    {
      name: 'specializations',
      title: 'Specializations',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Technical Analysis', value: 'technical' },
          { title: 'Fundamental Analysis', value: 'fundamental' },
          { title: 'DeFi', value: 'defi' },
          { title: 'NFTs', value: 'nfts' },
          { title: 'Layer 1 Protocols', value: 'layer1' },
          { title: 'Layer 2 Solutions', value: 'layer2' },
          { title: 'Memecoins', value: 'memecoins' },
          { title: 'Altcoins', value: 'altcoins' },
          { title: 'Bitcoin', value: 'bitcoin' },
          { title: 'Ethereum', value: 'ethereum' },
          { title: 'Derivatives', value: 'derivatives' },
          { title: 'Swing Trading', value: 'swing' },
          { title: 'Day Trading', value: 'day' },
          { title: 'Long-term Investing', value: 'longterm' }
        ]
      },
      description: 'Areas of expertise and specialization'
    },
    {
      name: 'experience',
      title: 'Years of Experience',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(0).max(50),
      description: 'Years of trading/analysis experience'
    },
    {
      name: 'credentials',
      title: 'Credentials & Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Credential Title',
              type: 'string'
            },
            {
              name: 'issuer',
              title: 'Issuing Organization',
              type: 'string'
            },
            {
              name: 'year',
              title: 'Year Obtained',
              type: 'number'
            },
            {
              name: 'verificationUrl',
              title: 'Verification URL',
              type: 'url'
            }
          ]
        }
      ],
      description: 'Professional credentials and certifications'
    },
    {
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        {
          name: 'twitter',
          title: 'Twitter/X',
          type: 'url'
        },
        {
          name: 'telegram',
          title: 'Telegram',
          type: 'url'
        },
        {
          name: 'discord',
          title: 'Discord',
          type: 'string'
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url'
        },
        {
          name: 'website',
          title: 'Personal Website',
          type: 'url'
        }
      ]
    },
    {
      name: 'tradingStyle',
      title: 'Trading Style',
      type: 'string',
      options: {
        list: [
          { title: 'Conservative', value: 'conservative' },
          { title: 'Moderate', value: 'moderate' },
          { title: 'Aggressive', value: 'aggressive' },
          { title: 'Scalper', value: 'scalper' },
          { title: 'Swing Trader', value: 'swing' },
          { title: 'Position Trader', value: 'position' },
          { title: 'Contrarian', value: 'contrarian' },
          { title: 'Momentum', value: 'momentum' }
        ]
      },
      description: 'Primary trading style and approach'
    },
    {
      name: 'riskTolerance',
      title: 'Risk Tolerance',
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
      initialValue: 'medium',
      description: 'General risk tolerance level'
    },
    {
      name: 'isVerified',
      title: 'Verified Analyst',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this analyst has been verified by the platform'
    },
    {
      name: 'verificationDate',
      title: 'Verification Date',
      type: 'datetime',
      hidden: ({ document }: { document: any }) => !document?.isVerified,
      description: 'Date when analyst was verified'
    },
    {
      name: 'tier',
      title: 'Analyst Tier',
      type: 'string',
      options: {
        list: [
          { title: 'Bronze', value: 'bronze' },
          { title: 'Silver', value: 'silver' },
          { title: 'Gold', value: 'gold' },
          { title: 'Platinum', value: 'platinum' },
          { title: 'Diamond', value: 'diamond' }
        ]
      },
      initialValue: 'bronze',
      description: 'Analyst tier based on performance and experience'
    },
    {
      name: 'subscriptionPrice',
      title: 'Monthly Subscription Price (USD)',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(0),
      description: 'Monthly subscription price for following this analyst'
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this analyst profile is currently active'
    },
    {
      name: 'joinedAt',
      title: 'Joined Date',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      validation: (Rule: Rule) => Rule.required(),
      description: 'Date when analyst joined the platform'
    },
    {
      name: 'lastActive',
      title: 'Last Active',
      type: 'datetime',
      description: 'Last time analyst was active on the platform'
    }
  ],
  preview: {
    select: {
      title: 'displayName',
      subtitle: 'bio',
      media: 'avatar',
      isVerified: 'isVerified',
      tier: 'tier'
    },
    prepare(selection: any) {
      const { title, subtitle, media, isVerified, tier } = selection;
      const verifiedBadge = isVerified ? '✓' : '';
      const tierBadge = tier ? `[${tier.toUpperCase()}]` : '';
      
      return {
        title: `${title} ${verifiedBadge}`,
        subtitle: `${tierBadge} ${subtitle || 'No bio available'}`,
        media
      };
    }
  },
  orderings: [
    {
      title: 'Display Name',
      name: 'displayName',
      by: [{ field: 'displayName', direction: 'asc' }]
    },
    {
      title: 'Verification Status',
      name: 'verified',
      by: [
        { field: 'isVerified', direction: 'desc' },
        { field: 'displayName', direction: 'asc' }
      ]
    },
    {
      title: 'Tier',
      name: 'tier',
      by: [
        { field: 'tier', direction: 'desc' },
        { field: 'displayName', direction: 'asc' }
      ]
    },
    {
      title: 'Join Date',
      name: 'joinedAt',
      by: [{ field: 'joinedAt', direction: 'desc' }]
    }
  ]
};
