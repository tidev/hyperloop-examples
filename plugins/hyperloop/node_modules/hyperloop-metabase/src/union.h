/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_UNION_H
#define HYPERLOOP_UNION_H

#include <vector>
#include "def.h"

namespace hyperloop {
	
	class UnionDefinition : public Definition {
	public:
		UnionDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx);
		~UnionDefinition();
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
