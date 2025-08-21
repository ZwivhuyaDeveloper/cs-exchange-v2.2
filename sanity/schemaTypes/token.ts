// Enhanced Token schema for comprehensive trading dashboard
import { defineField, defineType, type Rule } from 'sanity';
import { urlFor } from '../lib/image';

export const token = defineType({
  name: 'token',
  title: 'Crypto Token',
  type: 'document',
  fields: [
    defineField({
      name: 'symbol',
      title: 'Symbol',
      type: 'string',
      validation: (rule) => rule.required().uppercase().regex(/^[A-Z0-9]{1,10}$/).error('Symbol must be 1-10 uppercase alphanumeric characters'),
      description: 'Unique token symbol (e.g. BTC, ETH)'
    }),
    defineField({
      name: 'name',
      title: 'Token Name',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Full name of the token (e.g. Bitcoin)'
    }),
    defineField({
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
      validation: (rule) => rule.required(),
      description: 'URL slug for this token, auto-generated from symbol'
    }),
    defineField({
      name: 'coingeckoId',
      title: 'CoinGecko ID',
      type: 'string',
      validation: (rule) => rule.required(),
      description: 'Unique identifier from CoinGecko API (e.g. bitcoin)'
    }),
    defineField({
      name: 'logo',
      title: 'Token Logo URL',
      type: 'string',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
      description: 'Direct URL to token logo (e.g. from CoinGecko)'
    }),
    defineField({
      name: 'contractAddress',
      title: 'Contract Address',
      type: 'string',
      description: 'Smart contract address (for ERC-20 tokens)'
    }),
    defineField({
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
    }),
    defineField({
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
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Additional tags for categorization'
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the token and its purpose'
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Official project website'
    }),
    defineField({
      name: 'whitepaper',
      title: 'Whitepaper',
      type: 'url',
      description: 'Link to project whitepaper'
      }),
    defineField({
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
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Whether this token is actively traded'
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      description: 'Last time token data was updated'
    }),
  ],
  preview: {
    select: {
      title: 'symbol',
      subtitle: 'name',
      media: 'logo'
    },
    prepare(selection: { title: string; subtitle: string; media: string | undefined }) {
      const { title, subtitle, media } = selection;
      return {
        title: title || 'Unknown Token',
        subtitle: subtitle || '',
        media: media ? { asset: { _ref: media } } : undefined
      };
    }
  }
})