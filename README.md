# Code File Analyzer and Jira Issue Creator
This project provides a script that reads a specific file from a given repository, analyzes its content using OpenAI, and creates a Jira issue with the analysis results. This is particularly useful for developers who need to automate code reviews and issue tracking.

## Features

- **Read Specific File**: The script reads a specified file from a user-provided repository path.
- **Analyze Code with OpenAI**: The content of the file is analyzed using OpenAI's GPT-3.5-turbo-0125 model.
- **Create Jira Issue**: Based on the analysis, a Jira issue is created and a link to the created issue is provided.
- **User Input**: Users can input the repository path, file name, and analysis prompt at runtime.
- **Environment Variables**: Secrets such as API keys and tokens are securely managed using GitHub Secrets.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed.
- **NPM**: Node Package Manager (NPM) should be installed.
- **GitHub Secrets**: Set up secrets in your GitHub repository for sensitive information.

## Setup

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/your-username/repository-file-analyzer.git
    cd repository-file-analyzer
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Configure Environment Variables**:

    Create a `.env` file in the root directory and add the following:

    ```bash
    OPENAI_API_KEY=your_openai_api_key
    OPENAI_ORG=your_openai_org
    OPENAI_PROJECT_KEY=your_openai_project_key
    JIRA_EMAIL=your_jira_email
    JIRA_API_TOKEN=your_jira_api_token
    JIRA_HOST=your_jira_host
    ```

## Running the Script

To run the script locally, use the following command:

```bash
node your-script-file.js
````
## During execution, you will be prompted to:

- Enter the repository path.
- Enter the name of the file to be analyzed (e.g., OrdersController.cs).
- Enter the prompt for AI analysis.
- The script will then read the file, analyze its content with OpenAI, and create a Jira issue with the analysis results. A link to the created Jira issue will be provided.

## Contributing
Feel free to submit issues and enhancement requests.

## License
This project is licensed under the MIT License.

## Acknowledgments
OpenAI: For providing the AI models.
Atlassian: For Jira.
