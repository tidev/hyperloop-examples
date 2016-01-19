/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#ifndef HYPERLOOP_PROPERTY_H
#define HYPERLOOP_PROPERTY_H

#include <vector>
#include "def.h"

namespace hyperloop {

	class Property : public Serializable {
		public:
			Property(const std::string &name, Type *type, const std::vector<std::string> &attributes, bool optional);
			~Property();
			Json::Value toJSON () const;
			inline std::string getName () { return name; }
		private:
			std::string name;
			Type *type;
			std::vector<std::string> attributes;
			bool optional;
	};
}

#endif
