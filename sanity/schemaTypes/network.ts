import { Rule } from 'sanity';

export default {
  name: 'network',
  title: 'Blockchain Network',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Network Name',
      type: 'string',
      validation: (Rule: Rule) => Rule.required(),
      description: 'Full name of the blockchain network'
    },
    {
      name: 'symbol',
      title: 'Network Symbol',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().uppercase(),
      description: 'Short symbol for the network (e.g., ETH, MATIC)'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 32,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-+|-+$/g, '')
      },
      validation: (Rule: Rule) => Rule.required(),
      description: 'URL slug for this network'
    },
    {
      name: 'chainId',
      title: 'Chain ID',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().positive(),
      description: 'Unique chain identifier'
    },
    {
      name: 'logo',
      title: 'Network Logo URL',
      type: 'string',
      validation: (Rule: Rule) => Rule.uri({ scheme: ['http', 'https'] }),
      description: 'URL to network logo'
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the network'
    },
    {
      name: 'type',
      title: 'Network Type',
      type: 'string',
      options: {
        list: [
          { title: 'Layer 1', value: 'layer1' },
          { title: 'Layer 2', value: 'layer2' },
          { title: 'Sidechain', value: 'sidechain' },
          { title: 'Rollup', value: 'rollup' },
          { title: 'Other', value: 'other' }
        ]
      },
      description: 'Type of blockchain network'
    },
    {
      name: 'consensus',
      title: 'Consensus Mechanism',
      type: 'string',
      options: {
        list: [
          { title: 'Proof of Work', value: 'pow' },
          { title: 'Proof of Stake', value: 'pos' },
          { title: 'Delegated Proof of Stake', value: 'dpos' },
          { title: 'Proof of Authority', value: 'poa' },
          { title: 'Other', value: 'other' }
        ]
      },
      description: 'Consensus mechanism used by the network'
    },
    {
      name: 'nativeToken',
      title: 'Native Token',
      type: 'reference',
      to: [{ type: 'token' }],
      description: 'Reference to the native token of this network'
    },
    {
      name: 'blockTime',
      title: 'Block Time (seconds)',
      type: 'number',
      description: 'Average time to produce a new block'
    },
    {
      name: 'tps',
      title: 'Transactions Per Second',
      type: 'number',
      description: 'Network transaction throughput'
    },
    {
      name: 'gasLimit',
      title: 'Gas Limit',
      type: 'number',
      description: 'Maximum gas limit per block'
    },
    {
      name: 'totalSupply',
      title: 'Total Supply',
      type: 'number',
      description: 'Total supply of native token'
    },
    {
      name: 'marketCap',
      title: 'Market Cap (USD)',
      type: 'number',
      description: 'Current market capitalization'
    },
    {
      name: 'price',
      title: 'Native Token Price (USD)',
      type: 'number',
      description: 'Current price of native token'
    },
    {
      name: 'priceChange24h',
      title: '24h Price Change (%)',
      type: 'number',
      description: '24-hour price change percentage'
    },
    {
      name: 'volume24h',
      title: '24h Volume (USD)',
      type: 'number',
      description: '24-hour trading volume'
    },
    {
      name: 'activeAddresses',
      title: 'Active Addresses (24h)',
      type: 'number',
      description: 'Number of active addresses in last 24 hours'
    },
    {
      name: 'totalTransactions',
      title: 'Total Transactions',
      type: 'number',
      description: 'Total number of transactions on the network'
    },
    {
      name: 'defiTvl',
      title: 'DeFi TVL (USD)',
      type: 'number',
      description: 'Total Value Locked in DeFi protocols'
    },
    {
      name: 'validators',
      title: 'Number of Validators',
      type: 'number',
      description: 'Number of active validators (for PoS networks)'
    },
    {
      name: 'stakingRate',
      title: 'Staking Rate (%)',
      type: 'number',
      validation: (Rule: Rule) => Rule.min(0).max(100),
      description: 'Percentage of tokens staked'
    },
    {
      name: 'apy',
      title: 'Staking APY (%)',
      type: 'number',
      description: 'Annual percentage yield for staking'
    },
    {
      name: 'website',
      title: 'Website',
      type: 'url',
      description: 'Official network website'
    },
    {
      name: 'explorer',
      title: 'Block Explorer',
      type: 'url',
      description: 'Block explorer URL'
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
      description: 'Whether this network is active'
    },
    {
      name: 'isTestnet',
      title: 'Testnet',
      type: 'boolean',
      initialValue: false,
      description: 'Whether this is a testnet'
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      description: 'Last time network data was updated'
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'symbol',
      media: 'logo'
    },
    prepare(selection: any) {
      const { title, subtitle, media } = selection;
      return {
        title: title || 'Unknown Network',
        subtitle: subtitle || '',
        media: media ? { asset: { _ref: media } } : undefined
      };
    }
  }
} 