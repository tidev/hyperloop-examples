/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */

#include <assert.h>
#include <iostream>
#include <ctime>
#include "parser.h"
#include "util.h"
#include "class.h"
#include "typedef.h"
#include "enum.h"
#include "var.h"
#include "function.h"
#include "struct.h"
#include "union.h"

#define APIVERSION "1"

namespace hyperloop {

	// TODO: normally this should be a member variable to ParserTree but I'm having a weird
	// crash on some libraries that i can't yet figure out but moving outside works fine. c'est la vie
	static Blocks blocks;

	ParserTree::ParserTree () : context(nullptr) {
	}

	ParserTree::~ParserTree () {
		//TODO: cleanup all of them
		for (auto it = this->classes.begin(); it != this->classes.end(); it++) {
			auto classDef = it->second;
			delete classDef;
		}
	}

	void ParserTree::setContext (ParserContext *_context) {
		context = _context;
	}

	void ParserTree::addClass (hyperloop::ClassDefinition *definition) {
		auto key = definition->getName();
		this->classes[key] = definition;
	}

	void ParserTree::addProtocol (hyperloop::ClassDefinition *definition) {
		auto key = definition->getName();
		this->protocols[key] = definition;
	}

	void ParserTree::addType (TypeDefinition *definition) {
		auto key = definition->getName();
		this->types[key] = definition;
	}

	void ParserTree::addEnum (EnumDefinition *definition) {
		auto key = definition->getName();
		this->enums[key] = definition;
	}

	void ParserTree::addVar (VarDefinition *definition) {
		auto key = definition->getName();
		this->vars[key] = definition;
	}

	void ParserTree::addFunction (FunctionDefinition *definition) {
		auto key = definition->getName();
		this->functions[key] = definition;
	}

	void ParserTree::addStruct (StructDefinition *definition) {
		auto key = definition->getName();
		if (key.at(0) == '_') {
			// trim off any leading underscores
			size_t c = 0;
			for (; c < key.length(); c++) {
				char ch = key.at(c);
				if (ch == '_') {
					continue;
				}
				break;
			}
			if (c) {
				key = key.substr(c);
				definition->setName(key);
			}
		}
		this->structs[key] = definition;
	}

	void ParserTree::addUnion (UnionDefinition *definition) {
		auto key = definition->getName();
		if (!key.empty()) {
			this->unions[key] = definition;
		}
	}

	void ParserTree::addBlock (const std::string &framework, const std::string & def) {
		if (!def.empty() && !framework.empty()) {
			auto set = blocks[framework];
			set.insert(def);
			blocks[framework] = set;
		}
	}

	ClassDefinition* ParserTree::getClass (const std::string &name) {
		return this->classes[name];
	}

	TypeDefinition* ParserTree::getType (const std::string &name) {
		return this->types[name];
	}

	StructDefinition* ParserTree::getStruct (const std::string &name) {
		return this->structs[name];
	}

	UnionDefinition* ParserTree::getUnion (const std::string &name) {
		return this->unions[name];
	}

	EnumDefinition* ParserTree::getEnum (const std::string &name) {
		return this->enums[name];
	}

	bool ParserTree::hasClass (const std::string &name) {
		if (name.empty() || this->classes.empty()) { return false; }
		return (this->classes.find(name) != this->classes.end());
	}

	bool ParserTree::hasType (const std::string &name) {
		if (name.empty() || this->types.empty()) { return false; }
		return (this->types.find(name) != this->types.end());
	}

	bool ParserTree::hasStruct (const std::string &name) {
		if (name.empty() || this->structs.empty()) { return false; }
		return (this->structs.find(name) != this->structs.end());
	}

	bool ParserTree::hasUnion (const std::string &name) {
		if (name.empty() || this->unions.empty()) { return false; }
		return (this->unions.find(name) != this->unions.end());
	}

	bool ParserTree::hasEnum (const std::string &name) {
		if (name.empty() || this->enums.empty()) { return false; }
		return (this->enums.find(name) != this->enums.end());
	}

	Json::Value ParserTree::toJSON() const {

		Json::Value kv;
		Json::Value metadata;

		metadata["api-version"] = APIVERSION;
		if (context->getSDKPath().find("iPhone") != std::string::npos) {
			metadata["platform"] = "ios";
		}
		metadata["sdk-path"] = context->getSDKPath();
		metadata["min-version"] = context->getMinVersion();
		auto t = std::time(NULL);
		char mbstr[100];
		if (std::strftime(mbstr, sizeof(mbstr), "%FT%TZ", std::gmtime(&t))) {
			metadata["generated"] = mbstr;
		}
		metadata["system-generated"] = context->excludeSystemAPIs() ? "false" : "true";
		kv["metadata"] = metadata;

		if (types.size() > 0) {
			Json::Value typesKV;
			for (auto it = types.begin(); it != types.end(); it++) {
				typesKV[it->first] = it->second->toJSON();
			}
			kv["typedefs"] = typesKV;
		}

		if (classes.size() > 0) {
			Json::Value classesKV;
			for (auto it = classes.begin(); it != classes.end(); it++) {
				classesKV[it->first] = it->second->toJSON();
			}
			kv["classes"] = classesKV;
		}

		if (protocols.size() > 0) {
			Json::Value protocolsKV;
			for (auto it = protocols.begin(); it != protocols.end(); it++) {
				protocolsKV[it->first] = it->second->toJSON();
			}
			kv["protocols"] = protocolsKV;
		}

		if (enums.size() > 0) {
			Json::Value enumsKV;
			for (auto it = enums.begin(); it != enums.end(); it++) {
				enumsKV[it->first] = it->second->toJSON();
			}
			kv["enums"] = enumsKV;
		}

		if (vars.size() > 0) {
			Json::Value varsKV;
			for (auto it = vars.begin(); it != vars.end(); it++) {
				varsKV[it->first] = it->second->toJSON();
			}
			kv["vars"] = varsKV;
		}

		if (functions.size() > 0) {
			Json::Value functionsKV;
			for (auto it = functions.begin(); it != functions.end(); it++) {
				functionsKV[it->first] = it->second->toJSON();
			}
			kv["functions"] = functionsKV;
		}

		if (structs.size() > 0) {
			Json::Value structsKV;
			for (auto it = structs.begin(); it != structs.end(); it++) {
				structsKV[it->first] = it->second->toJSON();
			}
			kv["structs"] = structsKV;
		}

		if (unions.size() > 0) {
			Json::Value unionsKV;
			for (auto it = unions.begin(); it != unions.end(); it++) {
				unionsKV[it->first] = it->second->toJSON();
			}
			kv["unions"] = unionsKV;
		}

		if (blocks.size() > 0) {
			Json::Value blockSet;
			for (auto it = blocks.begin(); it != blocks.end(); it++) {
				auto key = it->first;
				Json::Value set;
				for (auto iit = it->second.begin(); iit != it->second.end(); iit++) {
					std::string block = *iit;
					set.append(callbackToJSON(context, block));
				}
				blockSet[key] = set;
			}
			kv["blocks"] = blockSet;
		}

		return kv;
	}

	ParserContext::ParserContext (const std::string &_sdkPath, const std::string &_minVersion, bool _excludeSys) : sdkPath(_sdkPath), minVersion(_minVersion), excludeSys(_excludeSys), previous(nullptr), current(nullptr) {
		this->tree.setContext(this);
	}

	ParserContext::~ParserContext() {
		this->previous = nullptr;
		this->current = nullptr;
	}

	void ParserContext::updateLocation (const std::map<std::string, std::string> &location) {
		this->filename = location.find("filename")->second;
		this->line = location.find("line")->second;
	}

	void ParserContext::setCurrent (Definition *current) {
		this->previous = this->current;
		this->current = current;
	}

	bool isSystemLocation (const std::string &location) {
		// at this point, the location should not start with a slash if a system framework
		// since we already looped off the /Developer path
		if (location.at(0) == (char)'/') {
			if (location.find("/usr/include/") == std::string::npos &&
				location.find("/usr/lib/") == std::string::npos) {
				return false;
			}
		}
		return true;
	}

	/**
	 * begin parsing the translation unit
	 */
	CXChildVisitResult begin(CXCursor cursor, CXCursor parent, CXClientData clientData) {

		auto displayName = CXStringToString(clang_getCursorDisplayName(cursor));

		if (clang_getCursorAvailability(cursor) != CXAvailability_Available) {
			return CXChildVisit_Continue;
		}

		auto ctx = (ParserContext *)static_cast<ParserContext *>(clientData);

		// get parser source information
		std::map<std::string, std::string> location;
		getSourceLocation(cursor, ctx, location);
		ctx->updateLocation(location);

		if (ctx->excludeSystemAPIs() && isSystemLocation(location["filename"])) {
			return CXChildVisit_Continue;
		}

		CXPlatformAvailability availability[10];
		int always_deprecated, always_unavailable;
		CXString deprecated_message, unavailable_message;

		int size = clang_getCursorPlatformAvailability(cursor,
											&always_deprecated,
											&deprecated_message,
											&always_unavailable,
											&unavailable_message,
											(CXPlatformAvailability*)&availability,10);

		// check and make sure this API is available
		if (size > 0) {
			bool unavailable = false;
			for (int c = 0; c < size; c++) {
				if (availability[c].Unavailable) {
					unavailable = true;
				}
			}
			clang_disposeCXPlatformAvailability(availability);
			if (unavailable || always_deprecated || always_unavailable) {
				return CXChildVisit_Continue;
			}
		}

		// figure out the element and then delegate
		auto kind = clang_getCursorKind(cursor);

		// std::cout << "AST: " << displayName << " kind: " << kind << ", location: " << location["filename"] << ":" << location["line"] << std::endl;

		Definition *definition = nullptr;

		switch (kind) {
			case CXCursor_ObjCProtocolDecl:
			case CXCursor_ObjCCategoryDecl:
			case CXCursor_ObjCInterfaceDecl: {
				definition = new ClassDefinition(cursor, displayName, ctx);
				break;
			}
			case CXCursor_TypedefDecl: {
				definition = new TypeDefinition(cursor, displayName, ctx);
				break;
			}
			case CXCursor_EnumDecl: {
				definition = new EnumDefinition(cursor, displayName, ctx);
				break;
			}
			case CXCursor_VarDecl: {
				definition = new VarDefinition(cursor, displayName, ctx);
				break;
			}
			case CXCursor_FunctionDecl: {
				definition = new FunctionDefinition(cursor, CXStringToString(clang_getCursorSpelling(cursor)), ctx);
				break;
			}
			case CXCursor_StructDecl: {
				definition = new StructDefinition(cursor, displayName, ctx);
				break;
			}
			case CXCursor_UnionDecl: {
				definition = new UnionDefinition(cursor, displayName, ctx);
				break;
			}
			default: {
				break;
			}
		}

		if (definition) {
			ctx->setCurrent(definition);
			definition->parse(cursor, parent, ctx);
		}

		// std::cout << "EXIT AST: " << displayName << " kind: " << kind << ", location: " << location["filename"] << ":" << location["line"] << std::endl;

		return CXChildVisit_Continue;
	}

	/**
	 * parse the translation unit and output to outputFile
	 */
	ParserContext* parse (CXTranslationUnit tu, std::string &sdkPath, std::string &minVersion, bool excludeSys) {
		auto cursor = clang_getTranslationUnitCursor(tu);
		auto ctx = new ParserContext(sdkPath, minVersion, excludeSys);
		clang_visitChildren(cursor, begin, ctx);
		ClassDefinition::complete(ctx);
		return ctx;
	}
}
