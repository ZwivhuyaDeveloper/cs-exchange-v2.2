import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const chains = await prisma.chain.findMany();
  const tokens = await prisma.token.findMany({ take: 5 });
  console.log('Chains:', JSON.stringify(chains, null, 2));
  console.log('Sample Tokens:', JSON.stringify(tokens, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 