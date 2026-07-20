export interface ProcessPaymentInput {
  amount: number;
  currency?: string;
  paymentMethod?: string;
  orderId?: string;
}

export const paymentService = {
  /**
   * Process a checkout payment transaction
   */
  async processPayment({ amount, currency = "USD", paymentMethod = "Card", orderId }: ProcessPaymentInput) {
    try {
      // Simulated secure gateway latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (amount <= 0) {
        throw new Error("Invalid payment amount.");
      }

      return {
        success: true,
        transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        amount,
        currency,
        paymentMethod,
        orderId,
        timestamp: new Date().toISOString(),
      };
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Payment processing failed.", { cause: err });
    }
  },
};
