/**
 * Hyperloop Metabase Generator
 * Copyright (c) 2015 by Appcelerator, Inc.
 */
#include <map>
#include "property.h"
#include "util.h"

namespace hyperloop {

	Property::Property(const std::string &_name, Type *_type, const std::vector<std::string> &_attributes, bool _optional) : name(_name), type(_type), attributes(_attributes), optional(_optional) {
	}

	Property::~Property() {
		delete type;
	}

	Json::Value Property::toJSON() const {
		Json::Value kv;
		kv["type"] = type->toJSON();
		kv["name"] = name;
		if (!attributes.empty()) {
			Json::Value attrs;
			for (auto it = attributes.begin(); it != attributes.end(); it++) {
				attrs.append(*it);
			}
			kv["attributes"] = attrs;
		}
		kv["optional"] = optional;
		return kv;
	}
}
