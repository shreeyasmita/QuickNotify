require("dotenv").config();

const express = require("express");
const path = require("path");
const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const app = express();
const PORT = process.env.PORT || 3000;
const REGION = process.env.AWS_REGION || "ap-south-1";
const TOPIC_ARN = process.env.SNS_TOPIC_ARN;

const sns = new SNSClient({ region: REGION });

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "QuickNotify" });
});

app.post("/api/notifications", async (req, res) => {
  const { title, category, message } = req.body || {};

  if (!TOPIC_ARN || TOPIC_ARN.includes("PASTE_YOUR")) {
    return res.status(500).json({
      error: "SNS topic is not configured. Add your SNS Topic ARN to the .env file."
    });
  }

  if (
    typeof title !== "string" ||
    typeof category !== "string" ||
    typeof message !== "string" ||
    !title.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      error: "Please provide a notification title and message."
    });
  }

  if (title.length > 100 || message.length > 3000) {
    return res.status(400).json({
      error: "Title must be 100 characters or fewer and message 3,000 characters or fewer."
    });
  }

  const safeCategory = category.trim().slice(0, 40) || "General";
  const subject = `[QuickNotify] ${title.trim()}`.slice(0, 100);
  const body = `Category: ${safeCategory}\n\n${message.trim()}`;

  try {
    const result = await sns.send(
      new PublishCommand({
        TopicArn: TOPIC_ARN,
        Subject: subject,
        Message: body
      })
    );

    return res.json({
      success: true,
      message: "Notification published to your SNS topic.",
      messageId: result.MessageId
    });
  } catch (error) {
    console.error("SNS publish failed:", error);
    return res.status(500).json({
      error: "Could not publish the notification. Check your AWS credentials, region, topic ARN, and IAM permissions."
    });
  }
});

app.listen(PORT, () => {
  console.log(`QuickNotify is running at http://localhost:${PORT}`);
});
