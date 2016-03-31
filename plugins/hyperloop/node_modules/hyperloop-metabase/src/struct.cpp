/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#include <iostream>
#include "struct.h"
#include "parser.h"
#include "util.h"

namespace hyperloop {

	static CXChildVisitResult parseStructMember (CXCursor cursor, CXCursor parent, CXClientData clientData) {
		auto structDef = static_cast<StructDefinition*>(clientData);
		auto displayName = CXStringToString(clang_getCursorDisplayName(cursor));
		auto kind = clang_getCursorKind(cursor);

		switch (kind) {
			case CXCursor_FieldDecl: {
				auto argType = clang_getCursorType(cursor);
				auto encoding = CXStringToString(clang_getDeclObjCTypeEncoding(cursor));
//				std::cout << "struct field " << displayName << ", type: " << argType.kind << ", encoding: " << encoding << " struct: " << structDef->getName() << std::endl;
				auto type = new Type(structDef->getContext(), argType);
				if (type->getType() == "typedef") {
					type->setType(EncodingToType(encoding));
				}
				structDef->addField(displayName, type, encoding);
				addBlockIfFound(structDef->getContext(), structDef, structDef->getFramework(), type, encoding);
				break;
			}
			case CXCursor_UnexposedAttr: {
				break;
			}
			default: {
				std::cerr << "not handled, struct: " << displayName << " kind: " << kind << std::endl;
				std::map<std::string, std::string> location;
				getSourceLocation(cursor, structDef->getContext(), location);
				std::cout << "struct: " << displayName << " kind: " << kind << ", " << hyperloop::toJSON(location) << std::endl;
				break;
			}
		}
		return CXChildVisit_Continue;
	}

	StructDefinition::StructDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx) :
		Definition(cursor, name, ctx) {
	}

	StructDefinition::~StructDefinition () {
		for (auto it = fields.begin(); it != fields.end(); it++) {
			delete *it;
		}
	}

	Json::Value StructDefinition::toJSON () const {
		Json::Value kv;
		toJSONBase(kv);
		if (fields.size() > 0) {
			Json::Value fkv;
			for (auto it = fields.begin(); it != fields.end(); it++) {
				auto v = (*it)->toJSON();
				v.removeMember("value");
				fkv.append(v);
			}
			kv["fields"] = fkv;
		}
		return kv;
	}

	std::string StructDefinition::getEncoding() {
		return structDefinitionToEncoding(this);
	}

	void StructDefinition::addField (const std::string &name, Type *type, const std::string &encoding) {
		auto arg = new Argument(name, type, encoding);
		fields.push_back(arg);
	}

	std::vector<Argument *> StructDefinition::getFields() {
		return fields;
	}

	CXChildVisitResult StructDefinition::executeParse (CXCursor cursor, ParserContext *context) {
		auto kind = clang_getCursorKind(cursor);
		if (!clang_isUnexposed(kind) && !this->getName().empty()) {
			context->getParserTree()->addStruct(this);
		}
		clang_visitChildren(cursor, parseStructMember, this);
		return CXChildVisit_Continue;
	}

}
