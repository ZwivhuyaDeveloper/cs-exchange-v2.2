import { Badge } from "@/components/ui/badge";
import { formatUnits } from "ethers";

export function AffiliateFeeBadge({ price, buyToken, tokenMap }: any) {
  return (
    
    <Badge className="justify-end w-full items-end h-fit border-none bg-transparent gap-4 m-0 p-0">
      <div className=" flex w-full justify-end">
        <div className="text-gray-400 items-end text-sm font-medium ">
          {price && price.fees?.integratorFee?.amount
            ? "Fee: " +
              Number(
                formatUnits(
                  BigInt(price.fees.integratorFee.amount),
                  tokenMap?.[buyToken]?.decimals || 18
                )
              ).toFixed(3) +
              " " +
              (tokenMap?.[buyToken]?.symbol || buyToken)
            : null}
        </div>
      </div>
    </Badge>
  );
}