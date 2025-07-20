import { Badge } from "@/components/ui/badge";
import { formatUnits } from "ethers";
import { MAINNET_TOKENS_BY_SYMBOL } from "@/src/constants";

export function AffiliateFeeBadge({
  price,
  buyToken,
}: {
  price: any;
  buyToken: string;
}) {
  return (
    
    <Badge className="justify-end w-full items-end h-fit border-none bg-transparent gap-4 m-0 p-0">
      <div className=" flex w-full justify-end">
        <div className="text-gray-400 items-end text-sm font-medium ">
          {price && price.fees?.integratorFee?.amount
            ? "Fee: " +
              Number(
                formatUnits(
                  BigInt(price.fees.integratorFee.amount),
                  MAINNET_TOKENS_BY_SYMBOL[buyToken].decimals
                )
              ).toFixed(3) + // Changed here
              " " +
              MAINNET_TOKENS_BY_SYMBOL[buyToken].symbol
            : null}
        </div>
      </div>
    </Badge>
  );
}