const syntaxTypes: { [nodeName: string]: number } = {
  // Week 3
  Program: 3,
  ExpressionStatement: 3,
  IfStatement: 3,
  FunctionDeclaration: 3,
  VariableDeclaration: 3,
  ReturnStatement: 3,
  CallExpression: 3,
  UnaryExpression: 3,
  BinaryExpression: 3,
  LogicalExpression: 3,
  ConditionalExpression: 3,
  FunctionExpression: 3,
  Identifier: 3,
  Literal: 3,

  // Week 5
  EmptyStatement: 5,
  ArrayExpression: 5,

  // Week 8
  AssignmentExpression: 8,
  WhileStatement: 8,

  // Week 8
  ThisExpression: 12,
  ObjectExpression: 12,
  Property: 12,
  UpdateExpression: 12,
  MemberExpression: 12,
  NewExpression: 12,

  // Week 12
  BreakStatement: 12,
  ContinueStatement: 12,
  ForStatement: 12,

  // Disallowed Forever
  SwitchStatement: Infinity,
  DebuggerStatement: Infinity,
  WithStatement: Infinity,
  LabeledStatement: Infinity,
  SwitchCase: Infinity,
  ThrowStatement: Infinity,
  CatchClause: Infinity,
  DoWhileStatement: Infinity,
  ForInStatement: Infinity,
  SequenceExpression: Infinity
}

export default syntaxTypes
