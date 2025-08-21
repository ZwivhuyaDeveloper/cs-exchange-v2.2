import { PaymentButton } from "@/app/components/payment-middleware/PaymentButton";


export default function PaymentRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">Payment Required</h1>
        <p className="text-gray-600 mb-8 text-center">
          You need to purchase premium access to view this content
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Premium Benefits</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access to all premium products</li>
            <li>Exclusive research content</li>
            <li>Priority customer support</li>
            <li>Advanced analytics tools</li>
          </ul>
        </div>
        
        <PaymentButton />
        
        <p className="mt-6 text-sm text-gray-500 text-center">
          Secure payment processing via BoomFi
        </p>
      </div>
    </div>
  )
}