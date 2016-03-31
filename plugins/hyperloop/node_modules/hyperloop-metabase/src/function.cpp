/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#include <iostream>
#include "function.h"
#include "parser.h"
#include "util.h"

namespace hyperloop {

	static CXChildVisitResult parseFunctionMember (CXCursor cursor, CXCursor parent, CXClientData clientData) {
		auto functionDef = static_cast<FunctionDefinition*>(clientData);
		auto displayName = CXStringToString(clang_getCursorDisplayName(cursor));
		auto kind = clang_getCursorKind(cursor);

		std::map<std::string, std::string> location;
		getSourceLocation(cursor, functionDef->getContext(), location);
//		std::cerr << "function: " << displayName << " kind: " << kind << ", " << hyperloop::toJSON(location) << std::endl;

		switch (kind) {
			case CXCursor_ParmDecl: {
				auto argType = clang_getCursorType(cursor);
				auto typeValue= CXStringToString(clang_getTypeSpelling(argType));
				auto encoding = CXStringToString(clang_getDeclObjCTypeEncoding(cursor));
				functionDef->addArgument(displayName, argType, typeValue, encoding);
				break;
			}
			case CXCursor_ObjCClassRef:
			case CXCursor_TypeRef:
			case CXCursor_UnexposedAttr:
			case CXCursor_CompoundStmt:
			case CXCursor_AsmLabelAttr:
			case CXCursor_ConstAttr:
			case CXCursor_PureAttr: {
				break;
			}
			default: {
				std::cerr << "not handled, function: " << displayName << " kind: " << kind << std::endl;
				break;
			}
		}
		return CXChildVisit_Continue;
	}

	FunctionDefinition::FunctionDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx) :
		Definition(cursor, name, ctx), returnType(nullptr), variadic(false) {
	}

	FunctionDefinition::~FunctionDefinition () {
		if (returnType) {
			delete returnType;
			returnType = nullptr;
		}
	}

	void FunctionDefinition::addArgument(const std::string &argName, const CXType &paramType, const std::string &argType, const std::string &encoding) {
		auto type = new Type(this->getContext(), paramType, argType);
		if (type->getType() == "unexposed") {
			type->setType(EncodingToType(encoding));
		}
		addBlockIfFound(this->getContext(), this, this->getFramework(), type, encoding);
		arguments.add(argName, type, filterEncoding(encoding));
	}

	Json::Value FunctionDefinition::toJSON () const {
		auto tree = this->context->getParserTree();
		Json::Value kv;
		toJSONBase(kv);
		kv["name"] = this->getName();
		kv["returns"] = returnType->toJSON();
		kv["arguments"] = arguments.toJSON();
		if (this->variadic && arguments.count()) {
			kv["variadic"] = true;
		}
		resolveEncoding(tree, kv["returns"], "type", "value");
		for (auto c = 0; c < kv["arguments"].size(); c++) {
			resolveEncoding(tree, kv["arguments"][c], "type", "value");
		}
		return kv;
	}

	CXChildVisitResult FunctionDefinition::executeParse (CXCursor cursor, ParserContext *context) {
		auto returnType = clang_getCursorResultType(cursor);
		auto returnTypeValue = CXStringToString(clang_getTypeSpelling(clang_getCursorResultType(cursor)));
		this->returnType = new Type(context, returnType, returnTypeValue);
		this->variadic = clang_isFunctionTypeVariadic(clang_getCursorType(cursor));
		addBlockIfFound(context, this, this->getFramework(), this->returnType, "");
		context->getParserTree()->addFunction(this);
		clang_visitChildren(cursor, parseFunctionMember, this);
		return CXChildVisit_Continue;
	}

}
