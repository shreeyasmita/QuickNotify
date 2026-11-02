# QuickNotify

A small notification dashboard that publishes announcements to an Amazon SNS topic. SNS sends the message to the topic's confirmed email subscribers.

## Requirements

- Node.js 18 or later
- An AWS account
- An SNS Standard topic in the AWS region you configure
- At least one confirmed email subscription on that topic
- AWS credentials with permission to call `sns:Publish` on that topic

## Setup on Windows

1. Extract the ZIP and open the `QuickNotify` folder in VS Code.
2. Open the VS Code terminal.
3. Install dependencies:

   ```powershell
   npm install
   ```

4. Open `.env` and replace `PASTE_YOUR_SNS_TOPIC_ARN_HERE` with the Topic ARN from the AWS SNS console. Keep `AWS_REGION` set to the region where the topic exists (the starter value is `ap-south-1` for Mumbai).
5. Configure AWS credentials securely. One option is to install the AWS CLI and run:

   ```powershell
   aws configure
   ```

   Enter credentials for an IAM identity that has only the required `sns:Publish` permission on your topic. Do not paste access keys into frontend files or commit them to source control.

6. Start the application:

   ```powershell
   npm start
   ```

7. Open `http://localhost:3000` in your browser.

## IAM permission

The AWS identity used by the application needs `sns:Publish` on your topic ARN. Example least-privilege policy (replace the ARN):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sns:Publish",
      "Resource": "arn:aws:sns:ap-south-1:YOUR_ACCOUNT_ID:QuickNotifyTopic"
    }
  ]
}
```

## Important notes

- The SNS topic must be a Standard topic for email subscriptions.
- Each email subscriber must confirm the subscription using the link SNS sends.
- This app publishes to the topic; it does not add subscribers or send to arbitrary email addresses.
- Keep `.env` and AWS credentials private. The `.gitignore` file excludes `.env`.
- For a public deployment, add authentication, rate limiting, CSRF protections as appropriate, and HTTPS before allowing anyone to publish messages.
