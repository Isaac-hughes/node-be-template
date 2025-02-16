const stripe = require("./setup");
const { Account } = require("../../models/Account");
const { ERRORS } = require("../../constants/errors");

class SubscriptionCleanup {
  static async handleFailedSubscription(account, error) {
    try {
      console.log("Starting subscription cleanup for account:", account.id);

      // If a subscription was created but payment failed
      if (account.stripeSubscriptionId) {
        await stripe.subscriptions.del(account.stripeSubscriptionId);
        account.stripeSubscriptionId = null;
      }

      // Reset subscription status
      account.subscription = {
        plan: "free",
        active: false,
        renewalDate: null,
        paymentFailed: true,
      };

      // Add notification about failed subscription
      account.notifications.push({
        type: "subscription",
        message:
          "Your subscription setup failed. Please try again or contact support.",
        read: false,
      });

      await account.save();

      // Log the cleanup
      console.log("Subscription cleanup completed for account:", account.id);
    } catch (cleanupError) {
      console.error("Subscription cleanup failed:", {
        accountId: account.id,
        originalError: error,
        cleanupError,
      });
      throw new Error(ERRORS.STRIPE_SUBSCRIPTION_CLEANUP);
    }
  }

  static async handleWebhookFailure(subscriptionId, customerId) {
    try {
      // Find associated account
      const account = await Account.findOne({ stripeCustomerId: customerId });

      if (account) {
        await this.handleFailedSubscription(
          account,
          new Error("Webhook processing failed")
        );
      }

      // Attempt to cancel subscription in Stripe if it exists
      try {
        await stripe.subscriptions.del(subscriptionId);
      } catch (stripeError) {
        console.error("Failed to cancel Stripe subscription:", stripeError);
      }
    } catch (error) {
      console.error("Webhook failure cleanup failed:", error);
    }
  }
}

module.exports = { SubscriptionCleanup };
