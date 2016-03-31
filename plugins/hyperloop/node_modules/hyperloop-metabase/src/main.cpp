/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */

#include "clang-c/Index.h"

#include <map>
#include <string>
#include <vector>
#include <iostream>
#include <fstream>

#include "util.h"
#include "parser.h"
#include "json/json.h"

/**
 * return a std::map from command line args
 */
static std::map<std::string, std::string> argvToMap(int argc, char* argv[]) {
	std::map<std::string, std::string> args;
	size_t i = 1;
	while (i != argc) {
		std::string firstArg(argv[i]);
		if (hyperloop::startsWith(firstArg, '-')) {
			if (i+1 < argc) {
				args[firstArg] = std::string(argv[i+1]);
			} else {
				args[firstArg] = "true";
			}
		}
		++i;
	}
	return args;
}

/**
 * display command line help
 */
static void showHelp (const std::string& programName) {

	auto name = hyperloop::tokenize(programName, "/").back();

    std::cout << std::endl;
    std::cout << "Hyperloop Metabase Generator Help                                                   " << std::endl;
    std::cout << "=================================                                                   " << std::endl;
    std::cout << "Usage: " << name << " [option] <argument>                                           " << std::endl;
    std::cout << "                                                                                    " << std::endl;
    std::cout << "Creates a Hyperloop friendly JSON file                                              " << std::endl;
    std::cout << "                                                                                    " << std::endl;
    std::cout << "Options:                                                                            " << std::endl;
    std::cout << "  -h                  shows this help message and exit                              " << std::endl;
    std::cout << "  -i                  full path to existing header input                            " << std::endl;
    std::cout << "  -o                  full path to output JSON file, will be created or overwritten " << std::endl;
    std::cout << "  -sim-sdk-path       full path to the iPhone simulator SDK, run:                   " << std::endl;
    std::cout << "                        xcrun --sdk iphonesimulator --show-sdk-path                 " << std::endl;
    std::cout << "  -min-ios-ver        minimum iOS version to use                                    " << std::endl;
    std::cout << "  -hsp                full path to header search paths, comma separated             " << std::endl;
    std::cout << "  -pretty             output should be prettified JSON (false by default)           " << std::endl;
    std::cout << "  -x                  exclude system APIs (false by default)                        " << std::endl;
    std::cout << "  -bit                Architecture, `32` or `64`, defaults to 64                    " << std::endl;
    std::cout << "                                                                                    " << std::endl;
    std::cout << "Example                                                                             " << std::endl;
    std::cout << "  " << name << " -i objc.h -o metabase.json -sim-sdk-path /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator9.0.sdk -min-ios-ver 9.0" << std::endl;
    std::cout << std::endl << std::endl;
}

/**
 * main entry points
 */
int main(int argc, char* argv[]) {
	auto arguments = argvToMap(argc, argv);
	bool showsHelp = false;

	if (arguments.count("-h")){
		showsHelp = true;
	}
	if (!arguments.count("-o")) {
		showsHelp = true;
	}
	if (!arguments.count("-i")) {
		showsHelp = true;
	}
	if (!arguments.count("-sim-sdk-path")) {
		showsHelp = true;
	}
	if (!arguments.count("-min-ios-ver")) {
		showsHelp = true;
	}
	if (showsHelp) {
		showHelp(std::string(argv[0]));
		return EXIT_FAILURE;
	}

	auto output_file = arguments["-o"];
	auto input_header = arguments["-i"];;
	// xcrun --sdk iphonesimulator --show-sdk-path
	auto min_ios_version = arguments["-min-ios-ver"];
	auto iphone_sim_root = arguments["-sim-sdk-path"];
	auto prettify = arguments.count("-pretty") > 0;
	auto excludeSys = arguments.count("-x") > 0;
    auto bitArch = arguments.count("-bit") ? arguments["-bit"] : "64";
	auto includes = hyperloop::tokenize(arguments["-hsp"], ",");

	std::string min_ios_version_command("-mios-simulator-version-min=" + min_ios_version);

	std::vector<const char*> args;
	args.push_back("-x");
	args.push_back("objective-c");
	args.push_back(min_ios_version_command.c_str());
	args.push_back("-O0");
	args.push_back("-g");
	args.push_back("-fobjc-abi-version=2");
	args.push_back("-fobjc-legacy-dispatch");
	args.push_back("-fpascal-strings");
	args.push_back("-fexceptions");
	args.push_back("-fasm-blocks");
	args.push_back("-fstrict-aliasing");
	args.push_back("-fmessage-length=0");
	args.push_back("-fdiagnostics-show-note-include-stack");
	args.push_back("-fmacro-backtrace-limit=0");
    args.push_back(std::string("-m" + bitArch).c_str());

	if (includes.size() > 0) {
		for (auto i = 0; i < includes.size(); i++) {
			auto each = includes[i];
			if (each.at(0) == (int)'"') {
				each = each.substr(1);
			}
			if (each.at(each.length() - 1) == (int)'"') {
				each = each.substr(0, each.length() - 1);
			}
			args.push_back("-I");
			args.push_back(strdup(each.c_str()));
		}
	}

	args.push_back("-v");
	args.push_back("-isysroot");
	args.push_back(iphone_sim_root.c_str());
	args.push_back(input_header.c_str());

	std::ofstream out(output_file);
	if (out.fail()) {
		std::cerr << "open failed for file: " << output_file << " with error code " << strerror(errno) << std::endl;
		return EXIT_FAILURE;
	}
	auto index = clang_createIndex(1, 1);
	auto tu = clang_parseTranslationUnit(index, nullptr, &args[0], (int)args.size(), nullptr, 0,0);
	auto ctx = hyperloop::parse(tu, iphone_sim_root, min_ios_version, excludeSys);
	auto tree = ctx->getParserTree();
	auto root = tree->toJSON();
	Json::Reader reader;
	Json::StreamWriterBuilder builder;

	if (prettify) {
		builder.settings_["commentStyle"] = "None";
		builder.settings_["indentation"] = "\t";
	} else {
		builder.settings_["indentation"] = "";
	}
	out << Json::writeString(builder, root) << std::endl;
	out.flush();
	out.close();

	delete ctx;

	clang_disposeTranslationUnit(tu);
	clang_disposeIndex(index);

	return EXIT_SUCCESS;
}
