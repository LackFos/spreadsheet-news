# Spreadsheet News

A brief description of your project goes here.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js and npm:** Make sure Node.js (which includes npm) is installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Wrangler CLI:** If you’re deploying to Cloudflare Workers, install the Wrangler CLI by following the [official guide](https://developers.cloudflare.com/workers/wrangler/get-started).

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

3. **Create Your Own Spreadsheet**

   - Go to the following spreadsheet link: [Spreadsheet Template](https://docs.google.com/spreadsheets/d/1nrcn7VkPDLJnvpQv1gg--I0qMtXve9e8ncWUwvOdf9o/edit?gid=0#gid=0)
   - Click on **File** > **Buat Salinan** to make your own copy of the spreadsheet.
   - After creating your copy, note the **Sheet ID** from the URL. The URL will look like:
     ```
     https://docs.google.com/spreadsheets/d/{SHEETID}/edit?usp=sharing
     ```
   - **Fill Up Config:** Open the sheet named `config` in your spreadsheet copy and fill in the required configuration for the website.
   - Copy the **Sheet ID**. You will need to use this value when configuring your environment variables in the next step.

4. **Configure Environment Variables**

   Open the `wrangler.toml` file in your project root and locate the `vars` section. Fill in the required environment variables with your specific values, including the **SHEET ID** you obtained. For example:

   ```toml
   [vars]
   SHEET_ID = "your-sheet-id-here"
   ```

## Deployment

Once you have completed the installation and configuration, you can deploy your app with the following command:

```bash
npm run deploy
```

This command will build and deploy your app to your specified environment (e.g., Cloudflare Workers).

## Troubleshooting

- **Dependency Issues:** If you encounter errors during `npm install`, ensure your Node.js version is compatible.
- **Environment Variables:** Double-check that all required environment variables in `wrangler.toml` are correctly set.
- **Deployment Errors:** Consult the deployment logs for details. If using Cloudflare Workers, ensure your Wrangler configuration is correctly set up.

## Additional Information

- **Project Documentation:** Include any additional documentation or links to further resources here.
- **Contributing:** If you wish to contribute, please follow the guidelines in the `CONTRIBUTING.md` file.

## License

Include your project license information here (e.g., MIT License).
