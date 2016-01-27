/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#include <iostream>
#include "union.h"
#include "parser.h"
#include "util.h"

namespace hyperloop {

	static CXChildVisitResult parseUnionMember (CXCursor cursor, CXCursor parent, CXClientData clientData) {
		auto unionDef = static_cast<UnionDefinition*>(clientData);
		auto displayName = CXStringToString(clang_getCursorDisplayName(cursor));
		auto kind = clang_getCursorKind(cursor);

		switch (kind) {
			case CXCursor_FieldDecl: {
				auto argType = clang_getCursorType(cursor);
				auto encoding = CXStringToString(clang_getDeclObjCTypeEncoding(cursor));
				auto type = new Type(unionDef->getContext(), argType);
				unionDef->addField(displayName, type, encoding);
				hyperloop::addBlockIfFound(unionDef->getContext(), unionDef, unionDef->getFramework(), type, encoding);
				break;
			}
			case CXCursor_UnexposedAttr: {
				break;
			}
			case CXCursor_StructDecl: {
				//TODO:
				break;
			}
			default: {
				std::cerr << "not handled, union: " << displayName << " kind: " << kind << std::endl;
				std::map<std::string, std::string> location;
				hyperloop::getSourceLocation(cursor, unionDef->getContext(), location);
				std::cout << "union: " << displayName << " kind: " << kind << ", " << hyperloop::toJSON(location) << std::endl;
				break;
			}
		}
		return CXChildVisit_Continue;
	}

	UnionDefinition::UnionDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx) :
		Definition(cursor, name, ctx) {
	}

	UnionDefinition::~UnionDefinition () {
		for (auto it = fields.begin(); it != fields.end(); it++) {
			delete *it;
		}
	}

	Json::Value UnionDefinition::toJSON () const {
		Json::Value kv;
		toJSONBase(kv);
		if (fields.size() > 0) {
			Json::Value fkv;
			for (std::vector<Argument *>::const_iterator it = fields.begin(); it != fields.end(); it++) {
				auto v = (*it)->toJSON();
				v.removeMember("value");
				fkv.append(v);
			}
			kv["fields"] = fkv;
		}
		return kv;
	}

	std::string UnionDefinition::getEncoding() {
		//TODO:
		return "?";
	}

	void UnionDefinition::addField (const std::string &name, Type *type, const std::string &encoding) {
		auto arg = new Argument(name, type, encoding);
		fields.push_back(arg);
	}

	std::vector<Argument *> UnionDefinition::getFields() {
		return fields;
	}

	CXChildVisitResult UnionDefinition::executeParse (CXCursor cursor, ParserContext *context) {
		auto kind = clang_getCursorKind(cursor);
		if (!clang_isUnexposed(kind)) {
			context->getParserTree()->addUnion(this);
			clang_visitChildren(cursor, parseUnionMember, this);
		}
		return CXChildVisit_Continue;
	}

}
