/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_FUNCTION_H
#define HYPERLOOP_FUNCTION_H

#include <vector>
#include "def.h"

namespace hyperloop {

	class FunctionDefinition : public Definition {
	public:
		FunctionDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx);
		~FunctionDefinition();
		Json::Value toJSON () const;
		void addArgument(const std::string &argName, const CXType &paramType, const std::string &argType, const std::string &encoding);
	private:
		std::string name;
		Type *returnType;
		Arguments arguments;
		bool variadic;
		CXChildVisitResult executeParse(CXCursor cursor, ParserContext *context);
	};
}

#endif
