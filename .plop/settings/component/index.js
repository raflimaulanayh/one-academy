module.exports = {
  description: 'Creates a new component',
  prompts: [
    {
      type: 'list',
      name: 'componentType',
      message: 'What component do you want to create?',
      choices: ['atoms', 'molecules', 'organisms', 'templates']
    },
    {
      type: 'input',
      name: 'dirName',
      message: 'What is the sub-directory? (optional, e.g., "landing", "auth", or leave empty)'
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the component?'
    }
  ],
  actions: [
    {
      type: 'add',
      path: '../src/components/{{componentType}}/{{#if dirName}}{{dirName}}/{{/if}}{{kebabCase name}}/index.tsx',
      templateFile: 'templates/component/component.tsx.hbs'
    }
  ]
}
