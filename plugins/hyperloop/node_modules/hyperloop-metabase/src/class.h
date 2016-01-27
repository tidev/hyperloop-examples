/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_CLASS_H
#define HYPERLOOP_CLASS_H

#include <map>
#include <vector>
#include "def.h"
#include "property.h"

namespace hyperloop {

	class MethodDefinition;

	/**
	 * Class definition
	 */
	class ClassDefinition : public Definition {
		public:
			ClassDefinition (CXCursor cursor, const std::string &name, ParserContext *ctx);
			~ClassDefinition ();
			Json::Value toJSON () const;
			void addMethod (MethodDefinition *method);
			void addProtocol (const std::string &name);
			void addCategory (const std::string &name);
			void setSuperclass (const std::string &name);
			void addProperty (Property *property);
			std::string getSuperClass() { return superClass; }
			void setIsCategory(bool v) { this->category = v; }
			bool isClassCategory() { return this->category; }
			static void complete (ParserContext *);
		private:
			std::map<std::string, MethodDefinition *> methods;
			std::map<std::string, Property *> properties;
			std::vector<std::string> protocols;
			std::vector<std::string> categories;
			std::string superClass;
			bool category;

			CXChildVisitResult executeParse(CXCursor cursor, ParserContext *context);
			bool merge() const;
			static void copy (ClassDefinition *from, ClassDefinition *to);
	};
}

#endif
