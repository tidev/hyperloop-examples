
/**
 * Base constructs
 */

exports.Statement =
exports.Expression = skip;

exports.Literal =
exports.Identifier =
exports.EmptyStatement =
exports.ThisExpression =
exports.BreakStatement =
exports.ContinueStatement =
exports.DebuggerStatement = ignore;

/**
 * Parser constructs
 */

exports.Program =
exports.BlockStatement = function(node, fn) {
  for (var i = 0; i < node.body.length; ++i) {
    node.body[i].parentNode = node;
    fn(node.body[i], 'Statement');
    delete node.body[i].parentNode;
  }
};

exports.ExpressionStatement = function(node, fn) {
  node.expression.parentNode = node;
  fn(node.expression, 'Expression');
  delete node.expression.parentNode;
};

exports.IfStatement = function(node, fn) {
  node.test.parentNode = node;
  fn(node.test, 'Expression');
  delete node.test.parentNode;

  node.consequent.parentNode = node;
  fn(node.consequent, 'Statement');
  delete node.consequent.parentNode;

  if (node.alternate) {
    node.alternate.parentNode = node;
    fn(node.alternate, 'Statement');
    delete node.alternate.parentNode;
  }
}

exports.LabeledStatement = function(node, fn) {
  node.body.parentNode = node;
  fn(node.body, 'Statement');
  delete node.body.parentNode;
};

exports.WithStatement = function(node, fn) {
  node.object.parentNode = node;
  fn(node.object, 'Expression');
  delete node.object.parentNode;

  node.body.parentNode = node;
  fn(node.body, 'Statement');
  delete node.body.parentNode;
};

exports.SwitchStatement = function(node, fn) {
  node.discriminant.parentNode = node;
  fn(node.discriminant, 'Expression');
  delete node.discriminant.parentNode;

  for (var i = 0; i < node.cases.length; ++i) {
    var cs = node.cases[i];
    if (cs.test) {
      cs.test.parentNode = node;
      fn(cs.test, 'Expression');
      delete cs.test.parentNode;
    }

    for (var j = 0; j < cs.consequent.length; ++j) {
      cs.consequent[j].parentNode = node;
      fn(cs.consequent[j], 'Statement');
      delete cs.consequent[j].parentNode;
    }
  }
};

exports.ReturnStatement = function(node, fn) {
  if (node.argument) {
    node.argument.parentNode = node;
    fn(node.argument, 'Expression');
    delete node.argument.parentNode;
  }
};

exports.ThrowStatement = function(node, fn) {
  node.argument.parentNode = node;
  fn(node.argument, 'Expression');
  delete node.argument.parentNode;
};

exports.TryStatement = function(node, fn) {
  node.block.parentNode = node;
  fn(node.block, 'Statement');
  delete node.block.parentNode;

  if (node.handler) {
    node.handler.body.parentNode = node;
    fn(node.handler.body, 'ScopeBody');
    delete node.handler.body.parentNode;
  }

  if (node.finalizer) {
    node.finalizer.parentNode = node;
    fn(node.finalizer, 'Statement');
    delete node.finalizer.parentNode;
  }
};

exports.WhileStatement =
exports.DoWhileStatement = function(node, fn) {
  node.test.parentNode = node;
  fn(node.test, 'Expression');
  delete node.test.parentNode;

  node.body.parentNode = node;
  fn(node.body, 'Statement');
  delete node.body.parentNode;
};

exports.ForStatement = function(node, fn) {
  if (node.init) {
    node.init.parentNode = node;
    fn(node.init, 'ForInit');
    delete node.init.parentNode;
  }

  if (node.test) {
    node.test.parentNode = node;
    fn(node.test, 'Expression');
    delete node.test.parentNode;
  }

  if (node.update) {
    node.update.parentNode = node;
    fn(node.update, 'Expression');
    delete node.update.parentNode;
  }

  node.body.parentNode = node;
  fn(node.body, 'Statement');
  delete node.body.parentNode;
};

exports.ForInStatement = function(node, fn) {
  node.left.parentNode = node;
  fn(node.left, 'ForInit');
  delete node.left.parentNode;

  node.right.parentNode = node;
  fn(node.right, 'Expression');
  delete node.right.parentNode;

  node.body.parentNode = node;
  fn(node.body, 'Statement');
  delete node.body.parentNode;
};

exports.ForInit = function(node, fn) {
  if (node.type == 'VariableDeclaration') fn(node);
  else fn(node, 'Expression');
};

exports.Function = function(node, fn) {
  node.body.parentNode = node;
  fn(node.body, 'ScopeBody');
  delete node.body.parentNode;
};

exports.FunctionExpression =
exports.FunctionDeclaration = function(node, fn) {
  fn(node, 'Function');
};

exports.VariableDeclaration = function(node, fn) {
  for (var i = 0; i < node.declarations.length; ++i) {
    var decl = node.declarations[i];
    if (decl.init) {
      decl.init.parentNode = node;
      fn(decl.init, 'Expression');
      delete decl.init.parentNode;
    }
  }
};

exports.ScopeBody = function(node, fn) {
  fn(node, 'Statement');
};

exports.ArrayExpression = function(node, fn) {
  for (var i = 0; i < node.elements.length; ++i) {
    var elt = node.elements[i];
    if (elt) {
      elt.parentNode = node;
      fn(elt, 'Expression');
      delete elt.parentNode;
    }
  }
};

exports.ObjectExpression = function(node, fn) {
  for (var i = 0; i < node.properties.length; ++i) {
    node.properties[i].value.parentNode = node;
    fn(node.properties[i].value, 'Expression');
    delete node.properties[i].value.parentNode;
  }
};

exports.SequenceExpression = function(node, fn) {
  for (var i = 0; i < node.expressions.length; ++i) {
    node.expressions[i].parentNode = node;
    fn(node.expressions[i], 'Expression');
    delete node.expressions[i].parentNode;
  }
};

exports.UnaryExpression =
exports.UpdateExpression = function(node, fn) {
  node.argument.parentNode = node;
  fn(node.argument, 'Expression');
  delete node.argument.parentNode;
};

exports.BinaryExpression =
exports.LogicalExpression =
exports.AssignmentExpression = function(node, fn) {
  node.left.parentNode = node;
  fn(node.left, 'Expression');
  delete node.left.parentNode;

  node.right.parentNode = node;
  fn(node.right, 'Expression');
  delete node.right.parentNode;
};

exports.ConditionalExpression = function(node, fn) {
  node.test.parentNode = node;
  fn(node.test, 'Expression');
  delete node.test.parentNode;

  node.consequent.parentNode = node;
  fn(node.consequent, 'Expression');
  delete node.consequent.parentNode;

  node.alternate.parentNode = node;
  fn(node.alternate, 'Expression');
  delete node.alternate.parentNode;
};

exports.NewExpression =
exports.CallExpression = function(node, fn) {
  node.callee.parentNode = node;
  fn(node.callee, 'Expression');
  delete node.callee.parentNode;

  if (!node.arguments) return;

  for (var i = 0; i < node.arguments.length; ++i) {
    node.arguments[i].parentNode = node;
    fn(node.arguments[i], 'Expression');
    delete node.arguments[i].parentNode;
  }
};

exports.MemberExpression = function(node, fn) {
  node.object.parentNode = node;
  fn(node.object, 'Expression');
  delete node.object.parentNode;

  if (node.computed) {
    node.property.parentNode = node;
    fn(node.property, 'Expression');
    delete node.property.parentNode;
  }
};

/**
 * Utilities
 */

function skip(node, fn) {
  fn(node, false);
}

function ignore(node, fn) {}
