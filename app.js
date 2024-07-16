import { promises as fs } from 'fs';
import readline from 'readline';
import path from 'path';
import JiraClient from 'jira-connector';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-proj-B5Tgv7BuolgmjSJftQuAT3BlbkFJJvioGxDmgVKZnel9YZhl",
  organization: "org-7kWGNarTdujkJKY1S35gaVdW",
  projectKey: "proj_92sCysBTh2cYQeSxDyMZlyHn",
});

const jira = new JiraClient({
  host: 'neway.atlassian.net',
  basic_auth: {
    email: 'gabriel.vlourencao@hotmail.com',
    api_token: 'ATATT3xFfGF0cVxKn-LFgT_Po1eqihQwtNpAhXN64DCkH5Rk0SssT75GvI_G5Kb5lF-Su8Uq6b886akH3hsq5LNYY0wu7cU9ZMK2A4jS63MtUr_GfGC3KOGd1ETT4cUb9JB8p-s58oBxG7nsCdiIU0iLX3YrwZabl7hL9IA6CIdRtGVNRqHoF-M=A67C56FA'
  }
});

const projectKey = 'NWY';

async function readRepoFiles(localPath, wishedFile) {
  console.log('Lendo arquivos do repositório...');

  const files = await fs.readdir(localPath);
  let wishedFileContent = null;

  for (const file of files) {
    const filePath = path.join(localPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isFile() && file === wishedFile) {
      wishedFileContent = await fs.readFile(filePath, 'utf-8');
      console.log(`Lendo onteúdo do arquivo ${file}:`);
      console.log('-----------------------------------');
      // console.log(wishedFileContent);
      // console.log('-----------------------------------');
      break;
    } else {
      console.log(`Ignorando arquivo: ${file}`);
    }
  }

  console.log('Arquivos lidos.');
  console.log('-----------------------------------');

  return wishedFileContent;
}

async function analyzeCodeWithAI(fileContents, prompt) {
  console.log('Analisando código com IA...');

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `${prompt}: ${JSON.stringify(fileContents)}` }],
    model: "gpt-3.5-turbo-0125"
  });

  console.log(completion.choices[0].message.content);
  console.log('-----------------------------------');

  console.log('Análise da IA concluída.');
  console.log('-----------------------------------');

  return completion.choices[0].message.content;
}

async function createJiraIssue(projectKey, summary, description) {
  console.log('Criando issue no Jira...');
  const issue = await jira.issue.createIssue({
    fields: {
      project: {
        key: projectKey
      },
      summary: summary,
      description: description,
      issuetype: {
        name: 'Task'
      }
    }
  });
  console.log('Issue criada no Jira.');
  console.log('-----------------------------------');

  const issueKey = issue.key;
  const issueUrl = `https://neway.atlassian.net/browse/${issueKey}`;
  console.log(`Link para a issue criada: ${issueUrl}`);
  console.log('-----------------------------------');

  return issueUrl;
}

async function main() {
  console.log('Iniciando processo...');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    rl.question('Digite o caminho para o diretório do repositório: ', async (localPath) => {
      const wishedFile = await new Promise((resolve) => {
        rl.question('Digite o nome do arquivo desejado (ex: OrdersController.cs): ', (answer) => {
          resolve(answer);
        });
      });

      const prompt = await new Promise((resolve) => {
        rl.question('Digite o prompt que deseja perguntar a IA: ', async (text) => {
          resolve(text);
        })
      });

      const fileContents = await readRepoFiles(localPath, wishedFile);
      const aiAnalysis = await analyzeCodeWithAI(fileContents, prompt);

      console.log('Pressione qualquer tecla para continuar e criar a issue...');
      process.stdin.setRawMode(true);
      process.stdin.resume();
      await new Promise(resolve => process.stdin.once('data', resolve));

      await createJiraIssue(projectKey, `${wishedFile} - Ajustes sugeridos por IA`, aiAnalysis);

      rl.close();
    });
  } catch (error) {
    console.error('Erro:', error);
    rl.close();
  }

  rl.on('close', () => {
    console.log('Processo concluído!');
  });
}

main();