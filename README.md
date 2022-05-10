# ms-credit-card-managment

This project was built for testing purposes. This is the backend of the application, build on express.js framework.

## The problem to resolve: monthly payments

I got a particular situation, where i need to manage an accountancy of the purchases that i make during the active mouth with the credit cards. So, the first problem that we have here, is that the are many cards, and because of that we have different card-resumes to look at every month. That's the very first issue to resolve.
On the other hand, the purchases are commonly made on quotes, so we need to make sure the right quote it's being processed during the time of liquidation.

### What's the system doing

1. REQ1: Manage an accountancy of what's purchases were made during the last month. The result is how much money do we need to pay after all (called __liquidation__).
2. REQ2: Give some text backup. The system can generate a resume of the purchases of the month, so that information can be backped into another solid drive system. THis proccess it's called __exportation__.
3. REQ3: Manage historical purchases. Not only month-payments has to be showned in the current __liquidation__, but also we need to have a record of what purchases had done in the past. This requirement it's named as __historical-payments__.
4. REQ4: Manage quoted-purchases, so that every month, after a liquidation is made, the quoted-purchases are automatically updated. The system can admit current or partial purchases. For example, you added a purchase of 6 months, on the 3rd period. After the current liquidation, that product has to be included into the historical transactions and has to be active in the next liquidation, and you should see that it's on the 4th period, in that case. When the product reach the 6th period, has to be dropped out of the current liquidation.
