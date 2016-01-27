/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#include <iostream>
#include "typedef.h"
#include "parser.h"
#include "util.h"
#include "struct.h"
#include "union.h"

namespace hyperloop {

	TypeDefinition::TypeDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx) :
		Definition(cursor, name, ctx), type(nullptr) {
	}

	TypeDefinition::~TypeDefinition () {
		if (type) {
			delete type;
			type = nullptr;
		}
	}

	void TypeDefinition::setType(Type *_type, const std::string &_encoding) {
		type = _type;
		encoding = _encoding;
	}

	Json::Value TypeDefinition::toJSON () const {
		Json::Value kv;
		toJSONBase(kv);
		kv.removeMember("name");
		kv["type"] = type->getType();
		kv["value"] = type->getValue();

		if (encodingNeedsResolving(this->encoding)) {
			kv["encoding"] = CXTypeUnknownToEncoding(this->context, type);
		} else {
			kv["encoding"] = this->encoding;
		}

		return kv;
	}

	CXChildVisitResult TypeDefinition::executeParse (CXCursor cursor, ParserContext *context) {
		auto cxtype = clang_getCanonicalType(clang_getTypedefDeclUnderlyingType(cursor));
		auto typeString = CXStringToString(clang_getTypeSpelling(cxtype));
		auto type = new Type(context, cxtype, typeString);

//		std::cout << "typedef: " << typeString << ", " << type->toJSON() << std::endl;

		//
		// record would be like the following definition:
		// typedef union { float t; } T;
		//
		if (type->getType() == "record") {
			auto p = context->getPrevious();
			if (p != nullptr) {
				auto pn = p->getName();
				if (pn.empty()) {
					p->setName(typeString);
					auto up = dynamic_cast<UnionDefinition *>(p);
					if (up) {
						type->setType("union");
						context->getParserTree()->addUnion(up);
					} else {
						auto sd = dynamic_cast<StructDefinition *>(p);
						if (sd) {
							type->setType("struct");
							context->getParserTree()->addStruct(sd);
						}
						else {
							std::cerr << "Not sure what the typedef record reference type is: " << p->toJSON() << std::endl;
						}
					}
				}
			}
		}
		std::string encoding = CXStringToString(clang_getDeclObjCTypeEncoding(cursor));
		this->setType(type, encoding);
		context->getParserTree()->addType(this);
		addBlockIfFound(context, this, this->getFramework(), type, encoding);
		return CXChildVisit_Continue;
	}

}
