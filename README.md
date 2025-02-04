# Spreadsheet News

A brief description of your project goes here.

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/LackFos/spreadsheet-news.git
   cd spreadsheet-news
   ```

2. **Install Dependencies**

   Run the following command to install the necessary packages:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   Open the `wrangler.toml` file in your project root and locate the `vars` section. Fill in the required environment variables with your specific values. For example:

   ```toml
   [vars]
   API_KEY = "your-api-key-here"
   OTHER_VARIABLE = "your-other-value"
   ```

## Deployment

Once you have completed the installation and configuration, you can deploy your app with the following command:

```bash
npm run deploy
```

This command will build and deploy your app to your specified environment (e.g., Cloudflare Workers).

## License

Include your project license information here (e.g., MIT License).
