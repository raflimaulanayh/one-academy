module.exports = {
  description: 'Generate a new AI Agent Workflow',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the workflow file (e.g., create-api-service)?'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Provide a short description for the workflow (e.g., Generate a new API service with Axios)'
    }
  ],
  actions: [
    {
      type: 'add',
      path: '../.agents/workflows/{{kebabCase name}}.md',
      templateFile: 'templates/workflow/workflow.md.hbs'
    }
  ]
}
