const path = require('path');
const config = require('./custom');

const ROOT_PATH = process.cwd();
const RootDirectory = ROOT_PATH;
const SourceDirectory = path.resolve(ROOT_PATH, 'src');
const NodeModulesDirectory = path.resolve(ROOT_PATH, 'node_modules');
const DistDirectory = path.resolve(ROOT_PATH, config.PRODUCTION.outputDir);
const SvgDirectory = path.resolve(ROOT_PATH, config.svgDir);

exports.RootDirectory = RootDirectory;
exports.SourceDirectory = SourceDirectory;
exports.NodeModulesDirectory = NodeModulesDirectory;
exports.DistDirectory = DistDirectory;
exports.SvgDirectory = SvgDirectory;
