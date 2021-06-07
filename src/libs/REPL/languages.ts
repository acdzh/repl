/* eslint-disable no-nested-ternary */
const languageList = {
  qbasic: {
    systemName: 'qbasic',
    name: 'QBasic',
    extension: 'bas',
    matchings: [],
    scripts: ['extern/qb.js/Base.js', 'extern/qb.js/Tokenizer.js', 'extern/qb.js/Types.js', 'extern/qb.js/EarleyParser.js', 'extern/qb.js/RuleSet.js', 'extern/qb.js/RuleParser.js', 'extern/qb.js/TypeChecker.js', 'extern/qb.js/CodeGenerator.js', 'extern/qb.js/VirtualMachine.js', 'extern/qb.js/QBasic.js'],
    includes: [],
    engine: 'langs/qbasic/jsrepl_qbasic.js',
    minifier: 'closure',
    tagline: 'Structured programming for beginners.',
    shortcut: 'Q',
    aboutLink: 'http://en.wikipedia.org/wiki/QBasic',
    engineLink: 'https://github.com/replit/jsrepl/tree/master/extern/qb.js',

    header: 'QBasic (qb.js)\nCopyright (c) 2010 Steve Hanov',
  },
  scheme: {
    systemName: 'scheme',
    name: 'Scheme',
    extension: 'scm',
    matchings: [['(', ')'], ['[', ']']],
    scripts: ['extern/biwascheme/src/version.js', 'extern/biwascheme/src/deps/underscore.js', 'extern/biwascheme/src/deps/underscore.string.js', 'extern/biwascheme/src/header.js', 'extern/biwascheme/src/system/class.js', 'extern/biwascheme/src/system/_writer.js', 'extern/biwascheme/src/system/_types.js', 'extern/biwascheme/src/system/error.js', 'extern/biwascheme/src/system/set.js', 'extern/biwascheme/src/system/values.js', 'extern/biwascheme/src/system/pair.js', 'extern/biwascheme/src/system/symbol.js', 'extern/biwascheme/src/system/char.js', 'extern/biwascheme/src/system/number.js', 'extern/biwascheme/src/system/port.js', 'extern/biwascheme/src/system/record.js', 'extern/biwascheme/src/system/enumeration.js', 'extern/biwascheme/src/system/hashtable.js', 'extern/biwascheme/src/system/syntax.js', 'extern/biwascheme/src/system/parser.js', 'extern/biwascheme/src/system/compiler.js', 'extern/biwascheme/src/system/pause.js', 'extern/biwascheme/src/system/call.js', 'extern/biwascheme/src/system/interpreter.js', 'extern/biwascheme/src/library/infra.js', 'extern/biwascheme/src/library/r6rs_lib.js', 'extern/biwascheme/src/library/js_interface.js', 'extern/biwascheme/src/library/webscheme_lib.js', 'extern/biwascheme/src/library/extra_lib.js', 'extern/biwascheme/src/library/node_functions.js', 'extern/biwascheme/src/library/srfi.js', 'extern/biwascheme/src/platforms/browser/dumper.js', 'extern/biwascheme/src/platforms/browser/console.js'],
    includes: [],
    engine: 'langs/scheme/jsrepl_scheme.js',
    minifier: 'closure_es5',
    tagline: 'An elegant dynamic dialect of Lisp.',
    shortcut: 'S',
    aboutLink: 'http://en.wikipedia.org/wiki/Scheme_(programming_language)',
    engineLink: 'https://github.com/yhara/biwascheme',

    ace_mode: { script: '/lib/ace/mode-scheme.js', module: 'ace/mode/scheme' },
    header: 'BiwaScheme Interpreter version 0.5.7\nCopyright (C) 2007-2010 Yutaka HARA and the BiwaScheme team',
  },
  apl: {
    systemName: 'apl',
    name: 'APL',
    extension: 'apl',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'apl.js',
    minifier: 'yui',
    tagline: 'An array-oriented language using funny characters',
    shortcut: 'A',
    aboutLink: 'https://en.wikipedia.org/wiki/APL_(programming_language)',
    engineLink: 'https://github.com/ngn/apl',

    header: 'ngn/apl apl.js',
  },
  javascript: {
    systemName: 'javascript',
    name: 'JavaScript',
    extension: 'js',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'javascript.js',
    minifier: 'closure',
    tagline: 'The de facto language of the Web.',
    shortcut: 'J',
    aboutLink: 'http://en.wikipedia.org/wiki/Javascript',
    engineLink: 'http://en.wikipedia.org/wiki/JavaScript_engine#JavaScript_engines',
    header: `Native ${
      typeof navigator !== 'undefined' && navigator !== null
        ? navigator.userAgent.match(/WebKit/)
          ? navigator.userAgent.match(/Android/)
            ? 'Android'
            : navigator.userAgent.match(/Chrome/)
              ? 'Chrome'
              : 'WebKit'
          : navigator.userAgent.match(/Opera/)
            ? 'Opera'
            : navigator.userAgent.match(/Trident/) // ie
              ? 'Internet Explorer'
              : navigator.userAgent.match(/Mozilla/)
                ? 'Mozilla Firefox'
                : 'Browser'
        : 'Unknown'} JavaScript.\nCopyright (c) ${new Date().getFullYear()} ${
      (
        typeof navigator !== 'undefined' && navigator !== null
          ? navigator.vendor
            ? navigator.vendor.toString().replace(/\.$/, '') : '' : ''
      ) || (
        typeof navigator !== 'undefined' && navigator !== null
          ? navigator.userAgent.match(/WebKit/)
            ? 'Apple Inc'
            : navigator.userAgent.match(/Opera/)
              ? 'Opera Software ASA'
              : navigator.userAgent.match(/Trident/) // ie
                ? 'Microsoft'
                : navigator.userAgent.match(/Mozilla/)
                  ? 'Mozilla Foundation'
                  : 'Browser Vendor'
          : ''
      )
    }`,
  },
  coffeescript: {
    systemName: 'coffeescript',
    name: 'CoffeeScript',
    extension: 'coffee',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'coffee-script.js',
    minifier: 'uglify',
    tagline: 'Unfancy JavaScript.',
    shortcut: 'C',
    aboutLink: 'http://jashkenas.github.com/coffee-script/',
    engineLink: 'https://github.com/jashkenas/coffee-script/',

    ace_mode: { script: '/lib/ace/mode-coffee.js', module: 'ace/mode/coffee' },
    header: 'CoffeeScript v1.3.1\nCopyright (c) 2011, Jeremy Ashkenas',
  },
  brainfuck: {
    systemName: 'brainfuck',
    name: 'BrainF***',
    extension: 'bf',
    matchings: [['[', ']']],
    scripts: [],
    includes: [],
    engine: 'brainfuck.js',
    minifier: 'closure',
    tagline: 'A pure Turing machine controller.',
    shortcut: 'F',
    aboutLink: 'http://en.wikipedia.org/wiki/Brainfuck',
    engineLink: 'https://github.com/acdzh/repl',
    header: 'BrainF***, bfjs\nCopyright (c) 2021 acdzh',
  },
  unlambda: {
    systemName: 'unlambda',
    name: 'Unlambda',
    extension: 'unl',
    matchings: [],
    scripts: ['extern/unlambda-coffee/unlambda.js'],
    includes: [],
    engine: 'langs/unlambda/jsrepl_unlambda.js',
    minifier: 'closure',
    tagline: 'Functional purity given form.',
    shortcut: 'U',
    aboutLink: 'http://en.wikipedia.org/wiki/Unlambda',
    engineLink: 'https://github.com/replit/unlambda-coffee',
    header: 'Unlambda v2.0 (unlambda-coffee)\nCopyright (c) 2011 Max Shawabkeh',
  },
  lolcode: {
    systemName: 'lolcode',
    name: 'LOLCODE',
    extension: 'lol',
    matchings: [],
    scripts: [],
    includes: [],
    engine: 'lolcode.js',
    minifier: 'closure',
    tagline: 'The basic language of lolcats.',
    shortcut: 'O',
    aboutLink: 'http://www.lolcode.org/',
    engineLink: 'https://github.com/NullDev/I-HAS-JS',

    header: 'LOLCODE v1.2 (I-HAS-JS)\nCopyright (c) 2211 NullDev',
  },
  kaffeine: {
    systemName: 'kaffeine',
    name: 'Kaffeine',
    extension: 'k',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'kaffeine.js',
    minifier: 'closure',
    tagline: 'Extended JavaScript for pros.',
    shortcut: 'K',
    aboutLink: 'http://weepy.github.com/kaffeine/',
    engineLink: 'https://github.com/weepy/kaffeine',
    header: " _  __      __  __     _\n| |/ /__ _ / _|/ _|___(_)_ _  ___\n| ' </ _` |  _|  _/ -_) | ' \\/ -_)\n|_|\\_\\__,_|_| |_| \\___|_|_||_\\___|\nVersion 0.0.4, Copyright (c) 2010 Jonah Fox",
  },
  move: {
    systemName: 'move',
    name: 'Move',
    extension: 'mv',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'move.js',
    minifier: 'closure',
    tagline: 'The easy way to program the web.',
    shortcut: 'M',
    aboutLink: 'http://movelang.org/',
    engineLink: 'https://github.com/rsms/move',

    header: 'Move v0.4.9\nCopyright (c) 2021 Rasmus Andersson',
  },
  traceur: {
    systemName: 'traceur',
    name: 'Javascript.next',
    extension: 'js',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: ['util/console.js', 'extern/traceur/traceur.js', 'extern/traceur/util/ObjectMap.js', 'extern/traceur/util/SourceRange.js', 'extern/traceur/util/SourcePosition.js', 'extern/traceur/syntax/Token.js', 'extern/traceur/syntax/TokenType.js', 'extern/traceur/syntax/LiteralToken.js', 'extern/traceur/syntax/IdentifierToken.js', 'extern/traceur/syntax/Keywords.js', 'extern/traceur/syntax/LineNumberTable.js', 'extern/traceur/syntax/SourceFile.js', 'extern/traceur/syntax/Scanner.js', 'extern/traceur/syntax/PredefinedName.js', 'extern/traceur/syntax/trees/ParseTreeType.js', 'extern/traceur/syntax/trees/ParseTree.js', 'extern/traceur/syntax/trees/NullTree.js', 'extern/traceur/syntax/trees/ParseTrees.js', 'extern/traceur/util/ErrorReporter.js', 'extern/traceur/util/MutedErrorReporter.js', 'extern/traceur/syntax/Parser.js', 'extern/traceur/syntax/ParseTreeVisitor.js', 'extern/traceur/util/StringBuilder.js', 'extern/traceur/semantics/VariableBinder.js', 'extern/traceur/semantics/symbols/SymbolType.js', 'extern/traceur/semantics/symbols/Symbol.js', 'extern/traceur/semantics/symbols/MemberSymbol.js', 'extern/traceur/semantics/symbols/MethodSymbol.js', 'extern/traceur/semantics/symbols/ModuleSymbol.js', 'extern/traceur/semantics/symbols/ExportSymbol.js', 'extern/traceur/semantics/symbols/FieldSymbol.js', 'extern/traceur/semantics/symbols/PropertyAccessor.js', 'extern/traceur/semantics/symbols/GetAccessor.js', 'extern/traceur/semantics/symbols/SetAccessor.js', 'extern/traceur/semantics/symbols/PropertySymbol.js', 'extern/traceur/semantics/symbols/AggregateSymbol.js', 'extern/traceur/semantics/symbols/ClassSymbol.js', 'extern/traceur/semantics/symbols/Project.js', 'extern/traceur/semantics/symbols/TraitSymbol.js', 'extern/traceur/semantics/symbols/RequiresSymbol.js', 'extern/traceur/semantics/ClassAnalyzer.js', 'extern/traceur/codegeneration/ParseTreeWriter.js', 'extern/traceur/syntax/ParseTreeValidator.js', 'extern/traceur/codegeneration/ParseTreeFactory.js', 'extern/traceur/codegeneration/ParseTreeTransformer.js', 'extern/traceur/codegeneration/AlphaRenamer.js', 'extern/traceur/codegeneration/DestructuringTransformer.js', 'extern/traceur/codegeneration/DefaultParametersTransformer.js', 'extern/traceur/codegeneration/RestParameterTransformer.js', 'extern/traceur/codegeneration/SpreadTransformer.js', 'extern/traceur/codegeneration/UniqueIdentifierGenerator.js', 'extern/traceur/codegeneration/ForEachTransformer.js', 'extern/traceur/codegeneration/ModuleTransformer.js', 'extern/traceur/codegeneration/FunctionTransformer.js', 'extern/traceur/codegeneration/ClassTransformer.js', 'extern/traceur/codegeneration/BlockBindingTransformer.js', 'extern/traceur/codegeneration/generator/ForInTransformPass.js', 'extern/traceur/codegeneration/generator/State.js', 'extern/traceur/codegeneration/generator/FallThroughState.js', 'extern/traceur/codegeneration/generator/TryState.js', 'extern/traceur/codegeneration/generator/BreakState.js', 'extern/traceur/codegeneration/generator/CatchState.js', 'extern/traceur/codegeneration/generator/ConditionalState.js', 'extern/traceur/codegeneration/generator/ContinueState.js', 'extern/traceur/codegeneration/generator/EndState.js', 'extern/traceur/codegeneration/generator/FinallyFallThroughState.js', 'extern/traceur/codegeneration/generator/FinallyState.js', 'extern/traceur/codegeneration/generator/SwitchState.js', 'extern/traceur/codegeneration/generator/YieldState.js', 'extern/traceur/codegeneration/generator/StateAllocator.js', 'extern/traceur/syntax/trees/StateMachine.js', 'extern/traceur/codegeneration/generator/BreakContinueTransformer.js', 'extern/traceur/codegeneration/generator/CPSTransformer.js', 'extern/traceur/codegeneration/generator/GeneratorTransformer.js', 'extern/traceur/codegeneration/generator/AsyncTransformer.js', 'extern/traceur/codegeneration/GeneratorTransformPass.js', 'extern/traceur/semantics/FreeVariableChecker.js', 'extern/traceur/codegeneration/ProgramTransformer.js', 'extern/traceur/codegeneration/ProjectWriter.js', 'extern/traceur/codegeneration/module/ModuleVisitor.js', 'extern/traceur/codegeneration/module/ModuleDefinitionVisitor.js', 'extern/traceur/codegeneration/module/ExportVisitor.js', 'extern/traceur/codegeneration/module/ModuleDeclarationVisitor.js', 'extern/traceur/codegeneration/module/ValidationVisitor.js', 'extern/traceur/semantics/ModuleAnalyzer.js', 'extern/traceur/codegeneration/Compiler.js', 'extern/traceur/runtime.js', 'extern/traceur/util/traits.js'],
    includes: [],
    engine: 'langs/traceur/jsrepl_traceur.js',
    minifier: 'closure_es5',
    tagline: 'The JavaScript of tomorrow.',
    shortcut: 'n',
    aboutLink: 'http://wiki.ecmascript.org/doku.php?id=harmony:harmony',
    engineLink: 'http://code.google.com/p/traceur-compiler/',

    header: 'Traceur Compiler v0.10\nCopyright (c) 2011 Google Inc.',
  },
  emoticon: {
    systemName: 'emoticon',
    name: 'Emoticon',
    extension: 'emo',
    matchings: [['(', ')']],
    scripts: [],
    includes: [],
    engine: 'emoticon.js',
    minifier: 'closure',
    tagline: 'Programming with an extra dose of smile.',
    shortcut: 'E',
    aboutLink: 'http://www.teuton.org/~stranger/code/emoticon/manual.php',
    engineLink: 'https://github.com/acdzh/repl',

    header: 'Emoticon v0.1, Copyright (c) 2021 acdzh',
  },
  bloop: {
    systemName: 'bloop',
    name: 'Bloop',
    extension: 'bloop',
    matchings: [],
    scripts: [],
    includes: [],
    engine: 'bloop.js',
    minifier: 'closure',
    tagline: 'Nothing but bounded loops.',
    shortcut: 'B',
    aboutLink: 'http://en.wikipedia.org/wiki/BlooP_and_FlooP',
    engineLink: 'https://github.com/replit/jsrepl/blob/master/extern/bloop/bloop.js',
    header: 'BlooPjs\nCopyright (c) 2005 Tim Cameron Ryan\nBased on Perl code by John Cowan, 1994',
  },
  forth: {
    systemName: 'forth',
    name: 'Forth',
    extension: '4th',
    matchings: [['(', ')'], [':', ';']],
    scripts: [],
    includes: [],
    engine: 'forth.js',
    minifier: 'closure',
    tagline: 'An interactive stack-oriented language.',
    shortcut: 'h',
    aboutLink: 'http://en.wikipedia.org/wiki/Forth_(programming_language)',
    engineLink: 'https://github.com/acdzh/repl/blob/master/src/sandbox/forth/jsforth.js',
    header: 'JS-Forth 0.5200804171342\nhttp://www.forthfreak.net/jsforth.html\nThis program is published under the GPL.',
  },
  lua: {
    systemName: 'lua',
    name: 'Lua',
    extension: 'lua',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'lua.js',
    minifier: 'none',
    emscripted: true,
    tagline: 'A lightweight multi-paradigm scripting language.',
    shortcut: 'L',
    aboutLink: 'http://en.wikipedia.org/wiki/Lua_(programming_language)',
    engineLink: 'http://daurnimator.github.io/lua.vm.js/lua.vm.js.html',

    ace_mode: { script: '/lib/ace/mode-lua.js', module: 'ace/mode/lua' },
    header: 'Lua 5.1  Copyright (C) 1994-2006 Lua.org, PUC-Rio\n[GCC 4.2.1 (LLVM, Emscripten 1.5)] on linux2',
  },
  python2: {
    systemName: 'python2',
    highlightName: 'python',
    name: 'Python 2',
    extension: 'py',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'python2.js',
    minifier: 'none',
    emscripted: true,
    tagline: 'A dynamic language emphasizing readability.',
    shortcut: 'P',
    aboutLink: 'http://en.wikipedia.org/wiki/Python_(programming_language)',
    engineLink: 'https://github.com/replit/empythoned',
    header: 'Python 2.7.2 (default, May 20 2021, 02:32:18)\n[GCC 4.2.1 (LLVM, Emscripten 1.5, Empythoned)] on linux',
  },
  python3: {
    systemName: 'python3',
    highlightName: 'python',
    name: 'Python 3',
    extension: 'py',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [],
    includes: [],
    engine: 'python3.js',
    minifier: 'none',
    emscripted: true,
    tagline: 'A dynamic language emphasizing readability.',
    shortcut: 'P',
    aboutLink: 'http://en.wikipedia.org/wiki/Python_(programming_language)',
    engineLink: 'https://github.com/replit/empythoned',
    header: 'Python 3.9.2 (tags/v3.9.2:1a79785, Feb 19 2021, 13:44:55) [MSC v.1928 64 bit (AMD64)] on win32\nType "help", "copyright", "credits" or "license" for more information.',
  },
  ruby: {
    systemName: 'ruby',
    name: 'Ruby (beta)',
    extension: 'rb',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: [{ firefox_3: 'extern/ruby/dist/ruby.opt.js', opera: 'extern/ruby/dist/ruby.opt.js', default: 'extern/ruby/dist/ruby.closure.js' }],
    includes: ['extern/ruby/dist/lib'],
    engine: 'langs/ruby/jsrepl_ruby.js',
    minifier: 'none',
    emscripted: true,
    tagline: 'A natural dynamic object-oriented language.',
    shortcut: 'R',
    aboutLink: 'http://en.wikipedia.org/wiki/Ruby_(programming_language)',
    engineLink: 'https://github.com/replit/emscripted-ruby',

    ace_mode: { script: '/lib/ace/mode-ruby.js', module: 'ace/mode/ruby' },
    header: 'Ruby 1.8.7 (2008-05-31 patchlevel 0) [x86-linux]\n[GCC 4.2.1 (LLVM, Emscripten 1.5, Emscripted-Ruby)]',
  },
  roy: {
    systemName: 'roy',
    name: 'Roy',
    extension: 'roy',
    matchings: [['(', ')'], ['[', ']'], ['{', '}']],
    scripts: ['extern/roy/bundled-roy.js', 'util/console.js'],
    includes: [],
    engine: 'langs/roy/jsrepl_roy.js',
    minifier: 'closure',
    tagline: 'Small functional language that compiles to JavaScript.',
    shortcut: 'y',
    aboutLink: 'http://roy.brianmckenna.org/',
    engineLink: 'https://github.com/pufuwozu/roy',

    header: 'Roy 0.1.3\nCopyright (C) 2011 Brian McKenna',
  },
} as {
  [propType: string]: {
    systemName: string;
    name: string;
    highlightName?: string;
    extension?: string;
    matchings: Array<Array<string>>;
    includes: Array<string>;
    engine: string;
    minifier: string;
    tagline: string;
    shortcut: string;
    aboutLink: string;
    engineLink: string;
    header: string;
    [propType: string]: unknown;
  }
};

export default languageList;
