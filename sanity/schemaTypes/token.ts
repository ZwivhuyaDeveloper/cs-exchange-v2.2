// Enhanced Token schema for comprehensive trading dashboard
import { Rule } from 'sanity';

export default {
  name: 'token',
  title: 'Crypto Token',
  type: 'document',
  fields: [
    {
      name: 'symbol',
      title: 'Symbol',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().uppercase().regex(/^[A-Z0-9]{1,10}$/).error('Symbol must be 1-10 uppercase alphanumeric characters'),
      description: 'Unique token symbol (e.g. BTC, ETH)'
    },
    {
      name: 'name',
      title: 'Token Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
      description: 'Full name of the token (e.g. Bitcoin)'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'symbol',
        maxLength: 32,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
      },
      validation: (Rule: Rule) => Rule.required(),
      description: 'URL slug for this token, auto-generated from symbol'
    },
    {
      name: 'coingeckoId',
      title: 'CoinGecko ID',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
      description: 'Unique identifier from CoinGecko API (e.g. bitcoin)'
    },
    {
      name: 'logo',
      title: 'Token Logo URL',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
      description: 'Direct URL to token logo (e.g. from CoinGecko)'
    },
    {
      name: 'contractAddress',
      title: 'Contract Address',
      type: 'string',
      description: 'Smart contract address (for ERC-20 tokens)'
    },
    {
      name: 'blockchain',
      title: 'Blockchain',
      type: 'string',
      options: {
        list: [
          { title: 'Bitcoin', value: 'bitcoin' },
          { title: 'Ethereum', value: 'ethereum' },
          { title: 'Polygon', value: 'polygon' },
          { title: 'Binance Smart Chain', value: 'bsc' },
          { title: 'Arbitrum', value: 'arbitrum' },
          { title: 'Optimism', value: 'optimism' },
          { title: 'Solana', value: 'solana' },
          { title: 'Avalanche', value: 'avalanche' },
          { title: 'Fantom', value: 'fantom' },
          { title: 'Base', value: 'base' },
          { title: 'Linea', value: 'linea' },
          { title: 'Scroll', value: 'scroll' },
          { title: 'Other', value: 'other' }
        ]
      },
      description: 'Blockchain network'
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'DeFi', value: 'defi' },
          { title: 'Gaming', value: 'gaming' },
          { title: 'Infrastructure', value: 'infrastructure' },
          { title: 'Layer 1', value: 'layer1' },
          { title: 'Layer 2', value: 'layer2' },
          { title: 'Meme', value: 'meme' },
          { title: 'NFT', value: 'nft' },
          { title: 'Privacy', value: 'privacy' },
          { title: 'Stablecoin', value: 'stablecoin' },
          { title: 'Yield Farming', value: 'yield' },
          { title: 'Other', value: 'other' }
        ]
      },
      description: 'Token category/use case'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Additional tags for categorization'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the token and its purpose'
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Official project website'
    },
    {
      name: 'whitepaper',
      title: 'Whitepaper',
      type: 'url',
      description: 'Link to project whitepaper'
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'twitter', title: 'Twitter', type: 'url' },
        { name: 'telegram', title: 'Telegram', type: 'url' },
        { name: 'discord', title: 'Discord', type: 'url' },
        { name: 'reddit', title: 'Reddit', type: 'url' },
        { name: 'github', title: 'GitHub', type: 'url' }
      ]
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this token is actively traded'
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      description: 'Last time token data was updated'
    }
  ],
  preview: {
    select: {
      title: 'symbol',
      subtitle: 'name',
      media: 'logo'
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection;
      return {
        title: title || 'Unknown Token',
        subtitle: subtitle || '',
        media: media ? { asset: { _ref: media } } : undefined
      };
    }
  }
}