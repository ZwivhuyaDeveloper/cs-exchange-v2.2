// Token schema: minimal, robust, URL-safe
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
          { title: 'Solana', value: 'solana' },
          { title: 'Other', value: 'other' }
        ]
      },
      description: 'Blockchain network'
    },
  ],

}