/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_ENUM_H
#define HYPERLOOP_ENUM_H

#include "def.h"

namespace hyperloop {
	/**
	 * Enum definition
	 */
	class EnumDefinition : public Definition {
	public:
		EnumDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx);
		~EnumDefinition ();
		Json::Value toJSON () const;
		void setValue (const std::string &name, long long value);
	private:
		std::map<std::string, long long> values;
		CXChildVisitResult executeParse(CXCursor cursor, ParserContext *context);
	};
}

#endif
