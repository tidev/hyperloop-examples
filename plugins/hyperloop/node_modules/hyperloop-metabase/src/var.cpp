/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#include <iostream>
#include "var.h"
#include "parser.h"
#include "util.h"

namespace hyperloop {

	VarDefinition::VarDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx) :
		Definition(cursor, name, ctx), type(nullptr) {
	}

	VarDefinition::~VarDefinition () {
		if (type) {
			delete type;
			type = nullptr;
		}
	}

	Json::Value VarDefinition::toJSON () const {
		Json::Value kv;
		toJSONBase(kv);
		kv["type"] = type->getType();
		kv["value"] = type->getValue();
		auto tree = this->context->getParserTree();
		if (encoding.empty()) {
			resolveEncoding(tree, kv, "type", "value");
		} else {
			kv["encoding"] = encoding;
		}
		return kv;
	}

	static CXChildVisitResult parseVarMember (CXCursor cursor, CXCursor parent, CXClientData clientData) {
		auto varDef = static_cast<VarDefinition*>(clientData);
		auto displayName = CXStringToString(clang_getCursorDisplayName(cursor));
		auto kind = clang_getCursorKind(cursor);
		switch (kind) {
			case CXCursor_TypeRef: {
				auto argType = clang_getCursorType(cursor);
				auto typeValue= CXStringToString(clang_getTypeSpelling(argType));
				auto encoding = CXStringToString(clang_getDeclObjCTypeEncoding(parent));
				auto typeName = EncodingToType(encoding);
				varDef->setType(new Type(varDef->getContext(), typeName, typeValue));
				varDef->setEncoding(encoding);
				break;
			}
			default: break;
		}
		return CXChildVisit_Continue;
	}

	CXChildVisitResult VarDefinition::executeParse (CXCursor cursor, ParserContext *context) {
		auto tree = context->getParserTree();
		auto type = clang_getCanonicalType(clang_getCursorType(cursor));
		this->type = new Type(context, type);
		tree->addVar(this);
		clang_visitChildren(cursor, parseVarMember, this);
		addBlockIfFound(context, this, this->getFramework(), this->type, encoding);
		return CXChildVisit_Continue;
	}

}
