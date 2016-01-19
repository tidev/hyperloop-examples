/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_STRUCT_H
#define HYPERLOOP_STRUCT_H

#include <vector>
#include "def.h"

namespace hyperloop {
	
	class StructDefinition : public Definition {
	public:
		StructDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx);
		~StructDefinition();
		Json::Value toJSON () const;
		void addField (const std::string &name, Type *type, const std::string &encoding);
		std::vector<Argument *> getFields();
		std::string getEncoding();
	private:
		std::vector<Argument *> fields;
		CXChildVisitResult executeParse(CXCursor cursor, ParserContext *context);
	};
}

#endif
